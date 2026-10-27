"use strict";
// Application state, theme, language switching and storage.
let language = preferredLanguage(),
  usingSample = true,
  importedFilename = "",
  sessionDataSaved = true;
let historySkill = "",
  teamTouched = false,
  profileUnlocked = false;
// Portraits can bias how scores are read, so people can hide them; the choice is a per-device preference.
let showPhotos = true;
try {
  showPhotos = localStorage.getItem("talentflow-photos") !== "off";
} catch {}
let darkTheme = false;
try {
  const preference = localStorage.getItem("talentflow-theme");
  darkTheme = preference ? preference === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
} catch {}
function updateTheme() {
  document.documentElement.dataset.theme = darkTheme ? "dark" : "light";
  $("theme").setAttribute("aria-pressed", String(darkTheme));
  $("theme").setAttribute(
    "aria-label",
    language === "en"
      ? darkTheme
        ? "Activate light theme"
        : "Activate dark theme"
      : darkTheme
        ? "Attiva tema chiaro"
        : "Attiva tema scuro",
  );
  $("theme-label").textContent =
    language === "en" ? (darkTheme ? "Light theme" : "Dark theme") : darkTheme ? "Tema chiaro" : "Tema scuro";
  $("theme-icon").textContent = darkTheme ? "☀" : "◐";
}
const t = (value) => (language === "en" ? translations[value] || value : value);
const initialNotice = {
  it: "Stai visualizzando dati dimostrativi interamente fittizi. Importa un CSV per esplorare i tuoi dati in locale.",
  en: "You are viewing entirely fictional demonstration data. Import a CSV to explore your data locally.",
};
const staticText = [];
const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
while (walker.nextNode()) {
  const node = walker.currentNode;
  const original = node.nodeValue;
  if (Object.keys(translations).some((key) => original.includes(key))) staticText.push([node, original]);
}
function applyLanguage() {
  document.documentElement.lang = language;
  const keys = Object.keys(translations).sort((a, b) => b.length - a.length);
  const pattern = new RegExp(keys.map((key) => key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|"), "g");
  for (const [node, original] of staticText) {
    node.nodeValue = language === "it" ? original : original.replace(pattern, (match) => translations[match]);
  }
  $("photos").checked = showPhotos;
  updateTheme();
  document.title = language === "it" ? "TalentFlow | POC HR" : "TalentFlow | HR proof of concept";
  $("language").value = language;
  $("primary-nav").setAttribute("aria-label", language === "en" ? "Main navigation" : "Navigazione principale");
  $("directory-filters").setAttribute("aria-label", language === "en" ? "People filters" : "Filtri persone");
  $("directory").setAttribute("aria-label", language === "en" ? "People directory" : "Elenco persone");
  $("profile-tabs").setAttribute("aria-label", language === "en" ? "Profile sections" : "Sezioni del profilo");
  $("flag-it").toggleAttribute("hidden", language !== "it");
  $("flag-en").toggleAttribute("hidden", language !== "en");
  updateNotice();
  render();
}
function updateNotice() {
  const message = usingSample
    ? initialNotice[language]
    : (language === "en" ? "Imported in this tab: " : "Importato in questa scheda: ") +
      importedFilename +
      (sessionDataSaved
        ? language === "en"
          ? ". Data is stored in this browser tab for this session, including after refresh."
          : ". I dati sono conservati in questa scheda per la sessione, anche dopo un refresh."
        : language === "en"
          ? ". Browser storage is unavailable; refresh will clear the imported data."
          : ". L’archiviazione del browser non è disponibile; un refresh cancellerà i dati importati.");
  $("notice").textContent = message;
  $("dataset-label").textContent = usingSample
    ? language === "en"
      ? "Demo data"
      : "Dati dimostrativi"
    : language === "en"
      ? "Imported data"
      : "Dati importati";
}
function saveView() {
  try {
    sessionStorage.setItem(
      "talentflow-view",
      JSON.stringify({
        person: current,
        department: selectedDepartment,
        search: $("search").value,
        view: mainView,
        profileTab: profileTab,
        teamDepartment: teamDepartment,
        teamRole: teamRole,
      }),
    );
  } catch {}
}
function localizePerson(p) {
  if (language !== "en" || !usingSample) return p;
  return {
    ...p,
    aspiration: t(p.aspiration),
    availability: t(p.availability),
    role: t(p.role),
    department: t(p.department),
    job_description: t(p.job_description),
    career_path: p.career_path.split("|").map(t).join("|"),
    next_role: t(p.next_role),
    skills: p.skills.map((s) => ({
      ...s,
      skill: t(s.skill),
      development_action: t(s.development_action),
      assessor: t(s.assessor),
      evidence: t(s.evidence),
      development_owner: t(s.development_owner),
    })),
  };
}
let dataset = loadData([headers, ...sampleRows()]);
let current = dataset[0].id,
  selectedDepartment = "",
  searchTerm = "",
  datasetRevision = 0,
  lastAnimatedProfile = "",
  mainView = "people",
  profileTab = "overview",
  teamDepartment = "",
  teamRole = "";
const $ = (id) => document.getElementById(id);
try {
  const saved = JSON.parse(sessionStorage.getItem("talentflow-import") || "null");
  if (saved && typeof saved.csv === "string" && typeof saved.name === "string") {
    dataset = loadData(parseCSV(saved.csv));
    usingSample = false;
    importedFilename = saved.name;
    current = dataset[0].id;
  }
} catch {}
try {
  const view = JSON.parse(sessionStorage.getItem("talentflow-view") || "null");
  if (
    view &&
    typeof view.person === "string" &&
    typeof view.department === "string" &&
    typeof view.search === "string"
  ) {
    if (dataset.some((p) => p.id === view.person)) current = view.person;
    if (["people", "profile", "team", "data"].includes(view.view)) mainView = view.view;
    if (["overview", "skills", "development"].includes(view.profileTab)) profileTab = view.profileTab;
    if (dataset.some((p) => p.department === view.teamDepartment)) teamDepartment = view.teamDepartment;
    if (dataset.some((p) => p.role === view.teamRole && (!teamDepartment || p.department === teamDepartment)))
      teamRole = view.teamRole;
    if (dataset.some((p) => p.department === view.department)) selectedDepartment = view.department;
    $("search").value = view.search;
    searchTerm = view.search.trim().toLocaleLowerCase();
  }
} catch {}
