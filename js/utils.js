"use strict";
// Small shared helpers: dates, weighted average, escaping.
const STALE_MONTHS = 12;
function isStale(date) {
  const d = new Date(date + "T00:00:00Z"),
    n = new Date();
  return (n.getUTCFullYear() - d.getUTCFullYear()) * 12 + n.getUTCMonth() - d.getUTCMonth() > STALE_MONTHS;
}
function average(skills) {
  return skills.reduce((a, s) => a + s.current * s.weight, 0) / skills.reduce((a, s) => a + s.weight, 0);
}
function escapeHtml(s) {
  return String(s).replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );
}
