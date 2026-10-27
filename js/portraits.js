"use strict";
// Synthetic portrait sprites used by the sample data.
const femalePortraitIds = new Set([
  "P002",
  "P004",
  "P006",
  "P008",
  "P010",
  "P011",
  "P013",
  "P015",
  "P016",
  "P018",
  "P019",
  "P021",
  "P023",
  "P025",
  "P027",
  "P028",
  "P030",
  "P033",
  "P034",
  "P036",
  "P038",
  "P040",
  "P042",
  "P044",
  "P046",
  "P048",
  "P049",
]);
const femalePortraitSlots = [
    1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35, 37, 39, 40, 42, 44, 46, 49, 50, 51,
  ],
  malePortraitSlots = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 41, 43, 45, 47, 48];
function portraitTile(id) {
  const female = femalePortraitIds.has(id),
    slots = female ? femalePortraitSlots : malePortraitSlots;
  let rank = 0;
  for (let n = 1; n <= Number(String(id).replace(/\D/g, "")); n++)
    if (femalePortraitIds.has(`P${String(n).padStart(3, "0")}`) === female) rank++;
  return slots[Math.min(rank - 1, slots.length - 1)];
}
function portraitPosition(id) {
  const index = portraitTile(id);
  return index >= 50
    ? `--portrait-extra-position:${(index - 50) * 100}%`
    : `--portrait-x:${((index % 10) * 100) / 9}%;--portrait-y:${Math.floor(index / 10) * 25}%`;
}
function portraitInlineStyle(id) {
  const index = portraitTile(id);
  if (index >= 50)
    return `background-image:url('assets/portraits/additional-women.png');background-size:200% 100%;background-position:${(index - 50) * 100}% 0%;background-repeat:no-repeat;color:transparent`;
  const x = ((index % 10) * 100) / 9,
    y = Math.floor(index / 10) * 25;
  return `background-image:url('assets/portraits/demo-portrait-sprite.png');background-size:1000% 500%;background-position:${x}% ${y}%;background-repeat:no-repeat;color:transparent`;
}
