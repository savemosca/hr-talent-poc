"""Tests for the local Excel-to-CSV conversion workflow."""
import csv
import importlib.util
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('excel_to_csv', ROOT / 'scripts' / 'excel_to_csv.py')
converter = importlib.util.module_from_spec(spec)
spec.loader.exec_module(converter)


class ExcelToCsvTests(unittest.TestCase):
    def test_sample_workbook_converts_without_changing_source(self):
        workbook = ROOT / 'outputs' / 'sample-data' / 'TalentFlow-sample-data.xlsx'
        original = workbook.read_bytes()
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory) / 'sample.csv'
            self.assertEqual(converter.main([str(workbook), '--output', str(output)]), 0)
            with output.open(encoding='utf-8-sig', newline='') as handle:
                rows = list(csv.DictReader(handle, delimiter=';'))
            self.assertEqual(len(rows), 700)
            self.assertEqual(len({row['id'] for row in rows}), 50)
            self.assertEqual(rows[0]['current_date'], '2026-01-15')
            self.assertTrue(rows[0]['history'].startswith('2023-01-15:'))
            with self.assertRaises(converter.ConversionError):
                converter.main([str(workbook), '--output', str(output)])
        self.assertEqual(workbook.read_bytes(), original)

    def test_real_excel_dates_and_1904_epoch(self):
        self.assertEqual(converter.date_value('45292', False, 2, 'current_date'), '2024-01-01')
        self.assertEqual(converter.date_value('0', True, 2, 'current_date'), '1904-01-01')
        for invalid in ('60', '2024-02-30', '45292.5'):
            with self.subTest(invalid=invalid), self.assertRaises(converter.ConversionError):
                converter.date_value(invalid, False, 2, 'current_date')

    def test_validation_rejects_invalid_score_or_missing_skill_type(self):
        header = list(converter.REQUIRED)
        row = ['P1', 'Example', 'Operator', 'Assembly', '3', '', '', '', 'soft',
               'Teamwork', '2', '6', '1', '']
        with self.assertRaisesRegex(converter.ConversionError, 'between 1 and 5'):
            converter.normalize_rows([header, row], False)
        row[11] = '3'
        with self.assertRaisesRegex(converter.ConversionError, 'one soft skill and one hard skill'):
            converter.normalize_rows([header, row], False)

    def test_missing_sheet_reports_clear_error(self):
        workbook = ROOT / 'outputs' / 'sample-data' / 'TalentFlow-sample-data.xlsx'
        with self.assertRaisesRegex(converter.ConversionError, 'not found'):
            converter.read_workbook(workbook, 'Missing')


if __name__ == '__main__':
    unittest.main()
