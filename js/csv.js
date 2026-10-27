"use strict";
// CSV encoding, parsing and validation.
// Text that starts with =, +, - or @ would be run as a formula by spreadsheet programs, so it is prefixed with a quote.
function csvCell(value) {
  const text = String(value);
  const safe = typeof value !== "number" && /^[=+\-@\t\r]/.test(text) ? "'" + text : text;
  return '"' + safe.replaceAll('"', '""') + '"';
}
function csvEncode(rows) {
  return "\ufeff" + [headers, ...rows].map((row) => row.map(csvCell).join(";")).join("\r\n");
}
function parseCSV(text) {
  text = text.replace(/^\ufeff/, "");
  const first = text.split(/\r?\n/, 1)[0];
  const sep = first.includes(";") ? ";" : ",";
  let rows = [],
    row = [],
    field = "",
    quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') {
      if (field) throw Error("Invalid quotes in the CSV file.");
      quoted = true;
    } else if (c === sep) {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      if (row.some((v) => v.trim())) rows.push(row);
      row = [];
    } else field += c;
  }
  if (quoted) throw Error("Unclosed quotes in the CSV file.");
  row.push(field);
  if (row.some((v) => v.trim())) rows.push(row);
  return rows;
}
function validDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(value + "T00:00:00Z");
  return Number.isFinite(d.getTime()) && d.toISOString().slice(0, 10) === value;
}
function parseHistory(value, row) {
  const points = value.split("|").map((entry) => {
    const [date, raw, ...extra] = entry.trim().split(":");
    const score = Number((raw || "").replace(",", "."));
    if (extra.length || !validDate(date) || !raw || !Number.isFinite(score) || score < 1 || score > 5)
      throw Error("Row " + row + ": history must contain YYYY-MM-DD:score entries between 1 and 5.");
    return { date, score };
  });
  if (points.some((p, i) => i > 0 && p.date <= points[i - 1].date))
    throw Error("Row " + row + ": history dates must be unique and chronological.");
  return points;
}
function loadData(rows) {
  if (rows.length < 2) throw Error("The file is empty.");
  const aliases = {
    nome: "name",
    ruolo: "role",
    reparto: "department",
    anzianita_anni: "tenure_years",
    percorso: "career_path",
    prossimo_ruolo: "next_role",
    tipo: "type",
    iniziale: "initial",
    attuale: "current",
    peso: "weight",
    azione_sviluppo: "development_action",
  };
  const head = rows[0].map((x) => {
    const key = x.trim().toLowerCase();
    return aliases[key] || key;
  });
  for (const h of requiredHeaders) if (!head.includes(h)) throw Error("Missing required column: " + h);
  const idx = Object.fromEntries(headers.map((h) => [h, head.indexOf(h)]));
  const byId = new Map();
  for (let n = 1; n < rows.length; n++) {
    const obj = Object.fromEntries(headers.map((h) => [h, String(rows[n][idx[h]] ?? "").trim()]));
    if (!obj.id || !obj.name || !obj.department || !obj.skill || !["soft", "hard"].includes(obj.type.toLowerCase()))
      throw Error("Row " + (n + 1) + ": check ID, name, department, type (soft/hard), and skill.");
    obj.type = obj.type.toLowerCase();
    for (const key of ["initial", "current", "weight"]) {
      const raw = obj[key].replace(",", ".");
      if (!raw || !Number.isFinite(Number(raw))) throw Error("Row " + (n + 1) + ": " + key + " must be a number.");
      obj[key] = Number(raw);
    }
    if (obj.initial < 1 || obj.initial > 5 || obj.current < 1 || obj.current > 5 || obj.weight <= 0)
      throw Error("Row " + (n + 1) + ": scores must be between 1 and 5 and weight must be positive.");
    if (obj.target) {
      const target = Number(obj.target.replace(",", "."));
      if (!Number.isFinite(target) || target < 1 || target > 5)
        throw Error("Row " + (n + 1) + ": target must be between 1 and 5.");
      obj.target = target;
    }
    for (const field of ["initial_date", "current_date", "development_due"])
      if (obj[field] && !validDate(obj[field]))
        throw Error("Row " + (n + 1) + ": " + field + " must use a valid YYYY-MM-DD date.");
    if (obj.history) parseHistory(obj.history, n + 1);
    if (!byId.has(obj.id)) byId.set(obj.id, { ...obj, skills: [] });
    const p = byId.get(obj.id);
    for (const key of [
      "name",
      "role",
      "department",
      "tenure_years",
      "job_description",
      "career_path",
      "next_role",
      "aspiration",
      "availability",
    ])
      if (p[key] !== obj[key]) throw Error("Row " + (n + 1) + ": inconsistent personal data for " + obj.id + ".");
    if (p.skills.some((s) => s.type === obj.type && s.skill === obj.skill))
      throw Error("Row " + (n + 1) + ": duplicate skill for " + obj.name + ".");
    p.skills.push(obj);
  }
  const result = [...byId.values()];
  for (const p of result)
    if (!p.skills.some((s) => s.type === "soft") || !p.skills.some((s) => s.type === "hard"))
      throw Error(p.name + ": at least one soft skill and one hard skill are required.");
  return result;
}
