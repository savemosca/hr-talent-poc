#!/usr/bin/env python3
"""Convert a TalentFlow .xlsx Data sheet to a locally importable UTF-8 CSV."""

import argparse
import csv
import math
import posixpath
import re
import sys
import zipfile
from datetime import date, timedelta
from pathlib import Path
from xml.etree import ElementTree as ET

MAIN = '{http://schemas.openxmlformats.org/spreadsheetml/2006/main}'
REL = '{http://schemas.openxmlformats.org/officeDocument/2006/relationships}'
PKG = '{http://schemas.openxmlformats.org/package/2006/relationships}'
REQUIRED = ('id', 'name', 'role', 'department', 'tenure_years', 'job_description',
            'career_path', 'next_role', 'type', 'skill', 'initial', 'current',
            'weight', 'development_action')
ALIASES = {'nome': 'name', 'ruolo': 'role', 'reparto': 'department',
           'anzianita_anni': 'tenure_years', 'percorso': 'career_path',
           'prossimo_ruolo': 'next_role', 'tipo': 'type', 'iniziale': 'initial',
           'attuale': 'current', 'peso': 'weight', 'azione_sviluppo': 'development_action'}
PERSON_FIELDS = ('name', 'role', 'department', 'tenure_years', 'job_description',
                 'career_path', 'next_role', 'aspiration', 'availability')
DATE_FIELDS = ('initial_date', 'current_date', 'development_due')


class ConversionError(Exception):
    """A readable error caused by the source workbook or its contents."""


def column_index(reference):
    match = re.fullmatch(r'([A-Za-z]+)[1-9][0-9]*', reference or '')
    if not match:
        raise ConversionError(f'Invalid cell reference: {reference!r}')
    value = 0
    for char in match.group(1).upper():
        value = value * 26 + ord(char) - ord('A') + 1
    return value - 1


def read_workbook(path, sheet_name):
    try:
        with zipfile.ZipFile(path) as archive:
            workbook = ET.fromstring(archive.read('xl/workbook.xml'))
            properties = workbook.find(MAIN + 'workbookPr')
            date_1904 = properties is not None and properties.get('date1904', '').lower() in ('1', 'true')
            sheet = next((s for s in workbook.findall(f'.//{MAIN}sheet') if s.get('name') == sheet_name), None)
            if sheet is None:
                raise ConversionError(f'Sheet {sheet_name!r} not found. Use --sheet to select another sheet.')
            relationship_id = sheet.get(REL + 'id')
            relations = ET.fromstring(archive.read('xl/_rels/workbook.xml.rels'))
            relation = next((r for r in relations.findall(PKG + 'Relationship') if r.get('Id') == relationship_id), None)
            if relation is None or relation.get('TargetMode') == 'External':
                raise ConversionError('The worksheet reference is missing or external.')
            target = relation.get('Target', '')
            sheet_path = posixpath.normpath(target.lstrip('/') if target.startswith('/') else posixpath.join('xl', target))
            if not sheet_path.startswith('xl/'):
                raise ConversionError('The worksheet reference is invalid.')
            root = ET.fromstring(archive.read(sheet_path))
            shared = []
            if 'xl/sharedStrings.xml' in archive.namelist():
                strings = ET.fromstring(archive.read('xl/sharedStrings.xml'))
                shared = [''.join(part.text or '' for part in item.iter(MAIN + 't'))
                          for item in strings.findall(MAIN + 'si')]
            rows = []
            for row in root.findall(f'.//{MAIN}sheetData/{MAIN}row'):
                cells = {}
                for cell in row.findall(MAIN + 'c'):
                    index = column_index(cell.get('r'))
                    cell_type = cell.get('t', 'n')
                    raw = cell.find(MAIN + 'v')
                    formula = cell.find(MAIN + 'f')
                    if formula is not None and (raw is None or raw.text is None):
                        raise ConversionError(f"Formula {cell.get('r')} has no cached value. Open the workbook in Excel, recalculate and save it.")
                    if cell_type == 'e':
                        raise ConversionError(f"Excel error in cell {cell.get('r')}: {raw.text if raw is not None else 'unknown'}")
                    if cell_type == 'inlineStr':
                        value = ''.join(part.text or '' for part in cell.iter(MAIN + 't'))
                    elif raw is None or raw.text is None:
                        value = ''
                    elif cell_type == 's':
                        try:
                            value = shared[int(raw.text)]
                        except (ValueError, IndexError):
                            raise ConversionError(f"Invalid shared text in cell {cell.get('r')}.") from None
                    elif cell_type == 'b':
                        value = 'TRUE' if raw.text == '1' else 'FALSE'
                    else:
                        value = raw.text
                    cells[index] = value
                if cells and any(str(value).strip() for value in cells.values()):
                    rows.append([cells.get(i, '') for i in range(max(cells) + 1)])
            return rows, date_1904
    except (zipfile.BadZipFile, KeyError, ET.ParseError) as error:
        raise ConversionError(f'Could not read the .xlsx workbook: {error}') from error


def number(value, row, label):
    try:
        result = float(value.replace(',', '.'))
    except ValueError:
        raise ConversionError(f'Row {row}: {label} must be a number.') from None
    if not math.isfinite(result):
        raise ConversionError(f'Row {row}: {label} must be a finite number.')
    return result


def date_value(value, date_1904, row, label):
    if not value:
        return ''
    try:
        if re.fullmatch(r'\d+(?:\.\d+)?', value):
            serial = float(value)
            if not serial.is_integer() or serial < 0 or (not date_1904 and serial == 60):
                raise ValueError('unsupported Excel date')
            if date_1904:
                converted = date(1904, 1, 1) + timedelta(days=int(serial))
            else:
                base = date(1899, 12, 31) if serial < 60 else date(1899, 12, 30)
                converted = base + timedelta(days=int(serial))
            return converted.isoformat()
        if not re.fullmatch(r'\d{4}-\d{2}-\d{2}', value):
            raise ValueError('expected ISO date')
        return date.fromisoformat(value).isoformat()
    except (ValueError, OverflowError):
        raise ConversionError(f'Row {row}: {label} must be a valid date (YYYY-MM-DD or an Excel date).') from None


def normalize_rows(rows, date_1904):
    if len(rows) < 2:
        raise ConversionError('The selected sheet has no data rows.')
    names = [ALIASES.get(str(v).strip().lower(), str(v).strip().lower()) for v in rows[0]]
    while names and not names[-1]:
        names.pop()
    if not all(names):
        raise ConversionError('Every column inside the data table must have a header.')
    if len(names) != len(set(names)):
        raise ConversionError('Duplicate column names are not supported.')
    missing = [name for name in REQUIRED if name not in names]
    if missing:
        raise ConversionError('Missing required columns: ' + ', '.join(missing))
    output, people = [], {}
    for row_number, values in enumerate(rows[1:], start=2):
        values = [str(v).strip() for v in values]
        if len(values) > len(names) and any(values[len(names):]):
            raise ConversionError(f'Row {row_number}: data exists beyond the last header.')
        item = {name: values[i] if i < len(values) else '' for i, name in enumerate(names)}
        if not item['id'] or not item['name'] or not item['department'] or not item['skill']:
            raise ConversionError(f'Row {row_number}: ID, name, department and skill are required.')
        item['type'] = item['type'].lower()
        if item['type'] not in ('soft', 'hard'):
            raise ConversionError(f'Row {row_number}: type must be soft or hard.')
        for field in ('initial', 'current'):
            if not 1 <= number(item[field], row_number, field) <= 5:
                raise ConversionError(f'Row {row_number}: {field} must be between 1 and 5.')
        if number(item['weight'], row_number, 'weight') <= 0:
            raise ConversionError(f'Row {row_number}: weight must be greater than zero.')
        if item.get('target') and not 1 <= number(item['target'], row_number, 'target') <= 5:
            raise ConversionError(f'Row {row_number}: target must be between 1 and 5.')
        for field in DATE_FIELDS:
            if field in item:
                item[field] = date_value(item[field], date_1904, row_number, field)
        if item.get('history'):
            previous = ''
            for entry in item['history'].split('|'):
                parts = entry.strip().split(':')
                if len(parts) != 2 or not re.fullmatch(r'\d{4}-\d{2}-\d{2}', parts[0]):
                    raise ConversionError(f'Row {row_number}: history must use YYYY-MM-DD:score entries separated by |.')
                day = date_value(parts[0], date_1904, row_number, 'history')
                if day <= previous or not 1 <= number(parts[1], row_number, 'history score') <= 5:
                    raise ConversionError(f'Row {row_number}: history dates must increase and scores must be between 1 and 5.')
                previous = day
        identity = tuple(item.get(field, '') for field in PERSON_FIELDS)
        person = people.setdefault(item['id'], {'identity': identity, 'skills': set(), 'types': set()})
        if person['identity'] != identity:
            raise ConversionError(f"Row {row_number}: inconsistent person details for ID {item['id']}.")
        skill_key = (item['type'], item['skill'])
        if skill_key in person['skills']:
            raise ConversionError(f"Row {row_number}: duplicate skill for ID {item['id']}.")
        person['skills'].add(skill_key)
        person['types'].add(item['type'])
        output.append([item[name] for name in names])
    for person_id, person in people.items():
        if person['types'] != {'soft', 'hard'}:
            raise ConversionError(f'ID {person_id}: at least one soft skill and one hard skill are required.')
    return names, output, len(people)


def available_output(input_path):
    base = input_path.with_name(input_path.stem + '.dashboard.csv')
    candidate, suffix = base, 2
    while candidate.exists():
        candidate = input_path.with_name(f'{input_path.stem}.dashboard-{suffix}.csv')
        suffix += 1
    return candidate


def main(argv=None):
    parser = argparse.ArgumentParser(description='Convert the TalentFlow Excel workbook into a local dashboard CSV.')
    parser.add_argument('workbook', nargs='?', help='Path to the .xlsx file. If omitted, you will be prompted.')
    parser.add_argument('--sheet', default='Data', help='Worksheet name (default: Data).')
    parser.add_argument('--output', help='Output CSV path. Existing files are never overwritten.')
    args = parser.parse_args(argv)
    workbook_name = args.workbook
    if not workbook_name:
        try:
            workbook_name = input('Enter the path to the saved Excel workbook (.xlsx): ').strip().strip('"')
        except EOFError:
            parser.error('A workbook path is required.')
    input_path = Path(workbook_name).expanduser()
    if input_path.suffix.lower() != '.xlsx' or not input_path.is_file():
        raise ConversionError('Select an existing .xlsx file (not .xls or .xlsm).')
    rows, date_1904 = read_workbook(input_path, args.sheet)
    headers, data, people_count = normalize_rows(rows, date_1904)
    output_path = Path(args.output).expanduser() if args.output else available_output(input_path)
    if output_path.resolve() == input_path.resolve():
        raise ConversionError('The output path must not be the Excel workbook.')
    if output_path.suffix.lower() != '.csv':
        raise ConversionError('The output filename must end in .csv.')
    try:
        with output_path.open('x', encoding='utf-8-sig', newline='') as handle:
            writer = csv.writer(handle, delimiter=';', lineterminator='\r\n')
            writer.writerow(headers)
            writer.writerows(data)
    except FileExistsError:
        raise ConversionError(f'Output already exists: {output_path}. Choose a different path.') from None
    print(f'Created: {output_path.resolve()}')
    print(f'Validated: {people_count} people, {len(data)} skill rows. Import this CSV in TalentFlow.')
    return 0


if __name__ == '__main__':
    try:
        sys.exit(main())
    except (ConversionError, OSError) as error:
        print(f'Error: {error}', file=sys.stderr)
        sys.exit(1)
