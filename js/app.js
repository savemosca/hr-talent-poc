"use strict";
// Event wiring and start-up.
function localizedError(message) {
  if (language === "en") return message;
  return message
    .replace("target must be between 1 and 5.", "il livello atteso deve essere tra 1 e 5.")
    .replace("must use a valid YYYY-MM-DD date.", "deve essere una data valida nel formato AAAA-MM-GG.")
    .replace(
      "history must contain YYYY-MM-DD:score entries between 1 and 5.",
      "lo storico deve contenere voci AAAA-MM-GG:punteggio tra 1 e 5.",
    )
    .replace(
      "history dates must be unique and chronological.",
      "le date dello storico devono essere uniche e in ordine cronologico.",
    )
    .replace("The file is empty.", "Il file è vuoto.")
    .replace("Missing required column: ", "Colonna obbligatoria mancante: ")
    .replace("Invalid quotes in the CSV file.", "Virgolette non valide nel file CSV.")
    .replace("Unclosed quotes in the CSV file.", "Virgolette non chiuse nel file CSV.")
    .replace(/^Row /, "Riga ")
    .replace(
      "check ID, name, department, type (soft/hard), and skill.",
      "controlla ID, nome, reparto, tipo (soft/hard) e competenza.",
    )
    .replace("must be a number.", "deve essere un numero.")
    .replace(
      "scores must be between 1 and 5 and weight must be positive.",
      "i punteggi devono essere tra 1 e 5 e il peso deve essere positivo.",
    )
    .replace("inconsistent personal data for ", "dati personali incoerenti per ")
    .replace("duplicate skill for ", "competenza duplicata per ")
    .replace(
      "at least one soft skill and one hard skill are required.",
      "sono richieste almeno una soft skill e una hard skill.",
    );
}
for (const view of ["people", "profile", "team", "data"]) $("nav-" + view).onclick = () => setMainView(view);
for (const tab of ["overview", "skills", "development"]) {
  $("tab-" + tab).onclick = () => setProfileTab(tab);
  $("tab-" + tab).onkeydown = (e) => {
    const tabs = ["overview", "skills", "development"];
    const index = tabs.indexOf(tab);
    let next;
    if (e.key === "ArrowRight") next = tabs[(index + 1) % tabs.length];
    else if (e.key === "ArrowLeft") next = tabs[(index + tabs.length - 1) % tabs.length];
    else if (e.key === "Home") next = tabs[0];
    else if (e.key === "End") next = tabs[tabs.length - 1];
    if (next) {
      e.preventDefault();
      setProfileTab(next, true);
    }
  };
}
$("people-list").onclick = (e) => {
  const button = e.target.closest("[data-person]");
  if (!button || !dataset.some((p) => p.id === button.dataset.person)) return;
  current = button.dataset.person;
  profileTab = "overview";
  setMainView("profile");
};
$("team-list").onclick = (e) => {
  const button = e.target.closest("[data-person]");
  if (!button || !dataset.some((p) => p.id === button.dataset.person)) return;
  current = button.dataset.person;
  render();
  const selected = [...$("team-list").querySelectorAll("[data-person]")].find(
    (item) => item.dataset.person === current,
  );
  if (selected) selected.focus({ preventScroll: true });
};
$("back-to-people").onclick = () => setMainView("people");
$("open-skills").onclick = () => setProfileTab("skills");
$("open-development").onclick = () => setProfileTab("development");
$("team-open-profile").onclick = () => setMainView("profile");
function updateTeamFilter() {
  const group = dataset.filter(
    (p) => (!teamDepartment || p.department === teamDepartment) && (!teamRole || p.role === teamRole),
  );
  if (group.length && !group.some((p) => p.id === current)) current = group[0].id;
  render();
}
$("team-department").onchange = (e) => {
  teamTouched = true;
  $("team-list").scrollTop = 0;
  teamDepartment = e.target.value;
  if (teamRole && !dataset.some((p) => p.role === teamRole && (!teamDepartment || p.department === teamDepartment)))
    teamRole = "";
  updateTeamFilter();
};
$("team-role").onchange = (e) => {
  teamTouched = true;
  $("team-list").scrollTop = 0;
  teamRole = e.target.value;
  updateTeamFilter();
};
$("history-skill").onchange = (e) => {
  historySkill = e.target.value;
  const person = dataset.find((p) => p.id === current);
  if (person) renderAdvanced(localizePerson(person));
};
$("photos").onchange = (e) => {
  showPhotos = e.target.checked;
  try {
    localStorage.setItem("talentflow-photos", showPhotos ? "on" : "off");
  } catch {}
  render();
};
$("theme").onclick = () => {
  darkTheme = !darkTheme;
  try {
    localStorage.setItem("talentflow-theme", darkTheme ? "dark" : "light");
  } catch {}
  updateTheme();
};
$("search").oninput = (e) => {
  searchTerm = e.target.value.trim().toLocaleLowerCase();
  render();
};
$("department").onchange = (e) => {
  selectedDepartment = e.target.value;
  render();
};
$("clear-filters").onclick = () => {
  searchTerm = "";
  selectedDepartment = "";
  $("search").value = "";
  render();
  $("search").focus();
};
$("import").onclick = () => $("file").click();
$("language").onchange = (e) => {
  language = e.target.value;
  try {
    localStorage.setItem("talentflow-language", language);
  } catch {}
  applyLanguage();
};
$("person").onchange = (e) => {
  current = e.target.value;
  render();
};
$("template").onclick = () => {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csvEncode(sampleRows())], { type: "text/csv;charset=utf-8" }));
  a.download = "talentflow-sample.csv";
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
};
$("file").onchange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const csv = await file.text();
    const next = loadData(parseCSV(csv));
    sessionDataSaved = false;
    try {
      sessionStorage.removeItem("talentflow-import");
      sessionStorage.setItem("talentflow-import", JSON.stringify({ name: file.name, csv }));
      sessionDataSaved = true;
    } catch {}
    dataset = next;
    datasetRevision++;
    usingSample = false;
    importedFilename = file.name;
    current = dataset[0].id;
    selectedDepartment = "";
    teamDepartment = "";
    teamRole = "";
    searchTerm = "";
    $("search").value = "";
    $("error").hidden = true;
    updateNotice();
    render();
  } catch (err) {
    $("error").textContent =
      (language === "en" ? "Import failed: " : "Importazione non riuscita: ") + localizedError(err.message);
    $("error").hidden = false;
  }
  e.target.value = "";
};
applyLanguage();
