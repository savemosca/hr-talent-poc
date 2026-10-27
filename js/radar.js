"use strict";
// Radar chart of soft skills.
function radar(skills, animate) {
  const n = skills.length,
    c = 150,
    r = 93,
    pt = (i, v) => {
      const a = (2 * Math.PI * i) / n - Math.PI / 2;
      return [c + (Math.cos(a) * r * v) / 5, c + (Math.sin(a) * r * v) / 5];
    };
  const points = (v) => skills.map((s, i) => pt(i, typeof v === "string" ? s[v] : v).join(",")).join(" ");
  let svg = `<svg viewBox="0 0 300 300" role="img" aria-label="${language === "en" ? "Radar chart of initial and current soft skills" : "Grafico radar delle soft skill iniziali e attuali"}">`;
  for (let k = 1; k <= 5; k++)
    svg += `<polygon points="${points(k)}" fill="none" stroke="var(--chart-grid)" stroke-width=".7"/>`;
  skills.forEach((s, i) => {
    const [x, y] = pt(i, 5),
      [lx, ly] = pt(i, 5.75);
    svg += `<line x1="${c}" y1="${c}" x2="${x}" y2="${y}" stroke="var(--chart-grid)" stroke-width=".7"/><text x="${lx}" y="${ly}" text-anchor="middle" dominant-baseline="middle" fill="var(--chart-label)" font-size="7">${i + 1}</text>`;
  });
  for (const [key, color] of [
    ["initial", "var(--chart-initial)"],
    ["current", "var(--chart-current)"],
  ]) {
    svg += `<g class="radar-series radar-series--${key}${animate ? " radar-series--animate" : ""}"><polygon points="${points(key)}" fill="${color}" fill-opacity=".22" stroke="${color}" stroke-width="2"/>`;
    skills.forEach((s, i) => {
      const [x, y] = pt(i, s[key]);
      svg += `<circle cx="${x}" cy="${y}" r="2.6" fill="${color}"/>`;
    });
    svg += "</g>";
  }
  return svg + "</svg>";
}
