"use strict";
// Rendering of the people list, profile, team view and details.
function render() {
  const departments = [...new Set(dataset.map((p) => p.department))].sort((a, b) => a.localeCompare(b));
  $("department").innerHTML =
    `<option value="">${language === "en" ? "All departments" : "Tutti i reparti"}</option>` +
    departments
      .map(
        (d) =>
          `<option value="${escapeHtml(d)}" ${d === selectedDepartment ? "selected" : ""}>${escapeHtml(usingSample ? t(d) : d)}</option>`,
      )
      .join("");
  $("search").placeholder = language === "en" ? "Name or ID" : "Nome o ID";
  const visible = dataset.filter(
    (p) =>
      (!selectedDepartment || p.department === selectedDepartment) &&
      (!searchTerm || `${p.name} ${p.id}`.toLocaleLowerCase().includes(searchTerm)),
  );
  $("result-count").textContent =
    language === "en"
      ? `${visible.length} of ${dataset.length} people`
      : `${visible.length} di ${dataset.length} persone`;
  $("empty").hidden = visible.length > 0;
  $("directory").hidden = visible.length === 0;
  $("person").disabled = false;
  renderDirectory(visible);
  if (!dataset.some((p) => p.id === current)) current = dataset[0].id;
  saveView();
  updateViewVisibility();
  document.querySelectorAll(".card").forEach((el) => {
    el.classList.remove("updated");
    void el.offsetWidth;
    el.classList.add("updated");
  });
  const p = localizePerson(dataset.find((p) => p.id === current) || dataset[0]);
  current = p.id;
  const profileKey = datasetRevision + ":" + current,
    animateProfile = profileKey !== lastAnimatedProfile;
  lastAnimatedProfile = profileKey;
  const soft = p.skills.filter((s) => s.type === "soft"),
    hard = p.skills.filter((s) => s.type === "hard");
  const s = average(soft),
    h = average(hard),
    eligible = s >= 3.5 && h >= 3.5;
  const fmt = (n) => (language === "en" ? n.toFixed(1) : n.toFixed(1).replace(".", ","));
  $("person").innerHTML = dataset
    .map(
      (x) =>
        `<option value="${escapeHtml(x.id)}" ${x.id === p.id ? "selected" : ""}>${escapeHtml(x.name)} · ${escapeHtml(usingSample ? t(x.department) : x.department)}</option>`,
    )
    .join("");
  $("matrix-current").textContent =
    (language === "en" ? "Selected person: " : "Persona selezionata: ") + p.name + (p.role ? " · " + p.role : "");
  $("profile-context-name").textContent = p.name;
  $("profile-context-meta").textContent = [p.role, p.department].filter(Boolean).join(" · ");
  $("name").textContent = p.name;
  $("role").textContent = p.role || (language === "en" ? "Role not provided" : "Ruolo non indicato");
  $("dept").textContent = p.department;
  $("seniority").textContent = p.tenure_years
    ? `${p.tenure_years} ${language === "en" ? "years of service" : "anni di anzianità"}`
    : language === "en"
      ? "Tenure not provided"
      : "Anzianità non indicata";
  $("initials").textContent = p.name
    .split(/\s+/)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
  $("initials").setAttribute("class", usingSample && showPhotos ? "portrait portrait--demo" : "portrait");
  $("initials").setAttribute("style", usingSample && showPhotos ? portraitInlineStyle(p.id) : "");
  $("current-role").textContent = p.role || "—";
  $("next-role").textContent = p.next_role || (language === "en" ? "To be defined" : "Da definire");
  $("potential").textContent = eligible
    ? language === "en"
      ? "Explore further"
      : "Da approfondire"
    : language === "en"
      ? "In development"
      : "In sviluppo";
  $("strengths").innerHTML = [...soft]
    .sort((a, b) => b.current - a.current)
    .slice(0, 3)
    .map((x) => `<span class="chip">${escapeHtml(x.skill)} · ${fmt(x.current)}</span>`)
    .join("");
  $("radar").innerHTML = radar(soft, animateProfile);
  $("skill-list").innerHTML = soft
    .map(
      (x, i) =>
        `<div class="skill-row"><span>${i + 1}. ${escapeHtml(x.skill)}</span><span><b>${fmt(x.current)}</b> / <em>${fmt(x.initial)}</em></span><div class="bar"><i class="${animateProfile ? "bar-fill--animate" : ""}" style="width:${x.current * 20}%;--bar-delay:${Math.min(i, 9) * 12}ms"></i></div></div>`,
    )
    .join("");
  $("description").textContent =
    p.job_description || (language === "en" ? "No description available." : "Descrizione non disponibile.");
  $("path").innerHTML = (
    p.career_path
      ? p.career_path.split("|")
      : [language === "en" ? "Career path to be defined" : "Percorso da definire"]
  )
    .map((x) => `<div>${escapeHtml(x.trim())}</div>`)
    .join("");
  $("advice").innerHTML = [...soft]
    .sort((a, b) => a.current - b.current)
    .slice(0, 3)
    .map(
      (x) =>
        `<div class="advice-item"><strong>${escapeHtml(x.skill)} · ${fmt(x.current)}/5</strong>${escapeHtml(x.development_action || (language === "en" ? "Agree a development activity with the manager." : "Definire un’attività di sviluppo con il responsabile."))}</div>`,
    )
    .join("");
  const scoreFormat = (n) => (language === "en" ? n.toFixed(2) : n.toFixed(2).replace(".", ","));
  $("soft-score").textContent = scoreFormat(s);
  $("hard-score").textContent = scoreFormat(h);
  $("hard-list").innerHTML = hard
    .map(
      (x) =>
        `<div class="hard-row"><span>${escapeHtml(x.skill)}</span><strong>${fmt(x.current)} / 5</strong><small>${language === "en" ? "Weight" : "Peso"} ${fmt(x.weight)}</small></div>`,
    )
    .join("");
  $("matrix-status").textContent = eligible
    ? language === "en"
      ? "Area to explore"
      : "Area da approfondire"
    : language === "en"
      ? "Skills to develop"
      : "Competenze da sviluppare";
  {
    const last = p.skills
      .map((x) => x.current_date)
      .filter(validDate)
      .sort()
      .at(-1);
    $("stale-note").hidden = !(last && isStale(last));
  }
  $("ov-soft").textContent = $("soft-score").textContent;
  $("ov-hard").textContent = $("hard-score").textContent;
  renderAdvanced(p);
  renderTeam(departments, p, fmt);
  const teamPeople = dataset.filter(
    (x) => (!teamDepartment || x.department === teamDepartment) && (!teamRole || x.role === teamRole),
  );
  $("points").innerHTML = teamPeople
    .map((x) => {
      const xs = average(x.skills.filter((y) => y.type === "soft")),
        ys = average(x.skills.filter((y) => y.type === "hard"));
      return `<button type="button" tabindex="${x.id === p.id ? "0" : "-1"}" class="point role-${roleIndex(x.role)} ${x.id === p.id ? "selected" : ""} ${x.id === p.id && animateProfile ? "point--animate" : ""}" style="left:${((xs - 1) / 4) * 100}%;bottom:${((ys - 1) / 4) * 100}%" data-id="${escapeHtml(x.id)}" data-name="${escapeHtml(x.name)}" title="${escapeHtml(x.name)}: soft ${fmt(xs)}, hard ${fmt(ys)}" aria-label="${language === "en" ? "Select" : "Seleziona"} ${escapeHtml(x.name)}"></button>`;
    })
    .join("");
  $("team-list")
    .querySelectorAll(".team-row")
    .forEach((row) => {
      const mark = (on) => {
        const pt = [...$("points").children].find((i) => i.dataset.id === row.dataset.person);
        if (pt) pt.classList.toggle("point--hover", on);
      };
      row.onmouseenter = () => mark(true);
      row.onmouseleave = () => mark(false);
    });
  $("points")
    .querySelectorAll("button")
    .forEach(
      (b) =>
        (b.onclick = () => {
          current = b.dataset.id;
          render();
          const selected = [...$("points").querySelectorAll("button")].find((item) => item.dataset.id === current);
          if (selected) selected.focus({ preventScroll: true });
        }),
    );
  $("points")
    .querySelectorAll("button")
    .forEach((b) => (b.onkeydown = (event) => moveMatrixFocus(b, event)));
  $("matrix-table").innerHTML = matrixTable(teamPeople, p.id, fmt);
}
// Plain-language name of the matrix area a person falls in (same 3.5 threshold as the chart).
function matrixArea(soft, hard) {
  const en = language === "en";
  if (soft >= 3.5 && hard >= 3.5) return en ? "Area to explore" : "Area da approfondire";
  if (hard >= 3.5) return en ? "Develop" : "Da sviluppare";
  if (soft >= 3.5) return en ? "Strong soft skills" : "Soft solide";
  return en ? "Build the foundation" : "Base da costruire";
}
// Table equivalent of the chart, for screen readers and keyboard users.
function matrixTable(group, selectedId, fmt) {
  const en = language === "en";
  const head = en ? ["Person", "Role", "Soft", "Hard", "Area"] : ["Persona", "Ruolo", "Soft", "Hard", "Area"];
  const rows = [...group]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((x) => {
      const soft = average(x.skills.filter((y) => y.type === "soft")),
        hard = average(x.skills.filter((y) => y.type === "hard"));
      return `<tr${x.id === selectedId ? ' aria-current="true"' : ""}><th scope="row">${escapeHtml(x.name)}</th><td>${escapeHtml(usingSample ? t(x.role) : x.role)}</td><td>${fmt(soft)}</td><td>${fmt(hard)}</td><td>${matrixArea(soft, hard)}</td></tr>`;
    })
    .join("");
  return `<table><caption>${en ? "Soft and hard weighted averages by person" : "Medie ponderate soft e hard per persona"}</caption><thead><tr>${head.map((h) => `<th scope="col">${h}</th>`).join("")}</tr></thead><tbody>${rows}</tbody></table>`;
}
// Arrow keys move focus to the nearest dot in that direction; Enter or Space (native button) selects it.
function moveMatrixFocus(button, event) {
  const direction = { ArrowRight: [1, 0], ArrowLeft: [-1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[event.key];
  if (!direction) return;
  event.preventDefault();
  const center = (el) => {
    const box = el.getBoundingClientRect();
    return [box.left + box.width / 2, box.top + box.height / 2];
  };
  const [x, y] = center(button);
  let best = null,
    bestScore = Infinity;
  for (const other of $("points").querySelectorAll("button")) {
    if (other === button) continue;
    const [ox, oy] = center(other);
    const along = (ox - x) * direction[0] + (oy - y) * direction[1];
    const across = Math.abs((ox - x) * direction[1]) + Math.abs((oy - y) * direction[0]);
    if (along <= 0) continue;
    const score = along + 2 * across;
    if (score < bestScore) {
      best = other;
      bestScore = score;
    }
  }
  if (best) {
    button.tabIndex = -1;
    best.tabIndex = 0;
    best.focus();
  }
}
function updateViewVisibility() {
  if (mainView === "profile") profileUnlocked = true;
  $("nav-profile").hidden = !profileUnlocked;
  for (const view of ["people", "profile", "team", "data"]) {
    const active = view === mainView;
    $("view-" + view).hidden = !active;
    $("nav-" + view).setAttribute("aria-current", active ? "page" : "false");
    $("nav-" + view).classList.toggle("active", active);
  }
  for (const tab of ["overview", "skills", "development"]) {
    const active = tab === profileTab;
    $("panel-" + tab).hidden = !active;
    $("tab-" + tab).setAttribute("aria-selected", String(active));
    $("tab-" + tab).tabIndex = active ? 0 : -1;
  }
  $("skills-insights").hidden = profileTab !== "skills";
  $("development-insights").hidden = profileTab !== "development";
}
function setMainView(view) {
  if (!["people", "profile", "team", "data"].includes(view)) return;
  mainView = view;
  if (view === "profile") profileUnlocked = true;
  if (view === "team" && !teamTouched && !teamRole && !teamDepartment) {
    const c = dataset.find((p) => p.id === current);
    if (c && c.role) teamRole = c.role;
  }
  if (
    view === "team" &&
    !dataset.some(
      (p) =>
        p.id === current && (!teamDepartment || p.department === teamDepartment) && (!teamRole || p.role === teamRole),
    )
  ) {
    teamDepartment = "";
    teamRole = "";
  }
  if (view === "profile" && profileTab === "skills") lastAnimatedProfile = "";
  render();
  if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "auto" });
  $(view + "-title").focus({ preventScroll: true });
}
function setProfileTab(tab, focus = false) {
  if (!["overview", "skills", "development"].includes(tab)) return;
  if (tab !== profileTab && tab === "skills") lastAnimatedProfile = "";
  profileTab = tab;
  render();
  if (focus) $("tab-" + tab).focus();
}
function renderDirectory(people) {
  const avgOf = (person, type) => average(person.skills.filter((x) => x.type === type));
  const score = (n) => (language === "en" ? n.toFixed(1) : n.toFixed(1).replace(".", ","));
  const ordered = [...people].sort((a, b) => a.name.localeCompare(b.name));
  $("people-list").innerHTML = ordered
    .map((person) => {
      const p = localizePerson(person);
      const lastDate = person.skills
        .map((skill) => skill.current_date)
        .filter(validDate)
        .sort()
        .at(-1);
      const detail = lastDate
        ? (language === "en" ? "Latest assessment: " : "Ultima valutazione: ") +
          new Intl.DateTimeFormat(language === "en" ? "en-GB" : "it-IT", {
            year: "numeric",
            month: "short",
            day: "2-digit",
            timeZone: "UTC",
          }).format(new Date(lastDate + "T00:00:00Z")) +
          (isStale(lastDate) ? " · " + t("Valutazione datata") : "")
        : p.id;
      const photoOn = usingSample && showPhotos;
      const extraPortrait = photoOn && portraitTile(p.id) >= 50;
      const portraitClass = photoOn
        ? extraPortrait
          ? " directory-avatar--demo-extra"
          : " directory-avatar--demo"
        : "";
      return `<button type="button" class="directory-row" data-person="${escapeHtml(p.id)}"><span class="directory-person"><span class="directory-avatar${portraitClass}" aria-hidden="true"${photoOn ? ` style="${portraitPosition(p.id)}"` : ""}>${
        photoOn
          ? ""
          : escapeHtml(
              p.name
                .split(/\s+/)
                .slice(0, 2)
                .map((x) => x[0])
                .join("")
                .toUpperCase(),
            )
      }</span><span><strong>${escapeHtml(p.name)}</strong><small>${escapeHtml(detail)}</small></span></span><span class="directory-role">${escapeHtml(p.role || "—")}</span><span class="directory-dept">${escapeHtml(p.department)}</span><span class="directory-scores">${score(avgOf(person, "soft"))} / ${score(avgOf(person, "hard"))}</span><span class="directory-arrow" aria-hidden="true">→</span></button>`;
    })
    .join("");
}
const roleIndex = (role) =>
  Math.max(
    0,
    [...new Set(dataset.map((x) => x.role).filter(Boolean))].sort((a, b) => a.localeCompare(b)).indexOf(role),
  ) % 6;
function renderTeam(departments, selected, fmt) {
  $("team-guidance").classList.toggle("is-warning", !teamRole);
  $("matrix-legend").innerHTML = teamRole
    ? ""
    : [
        ...new Set(
          dataset
            .filter((x) => !teamDepartment || x.department === teamDepartment)
            .map((x) => x.role)
            .filter(Boolean),
        ),
      ]
        .sort((a, b) => a.localeCompare(b))
        .map(
          (role) => `<span><i class="role-${roleIndex(role)}"></i>${escapeHtml(usingSample ? t(role) : role)}</span>`,
        )
        .join("");
  const previousScroll = $("team-list").scrollTop || 0;
  const availableRoles = [
    ...new Set(
      dataset
        .filter((x) => !teamDepartment || x.department === teamDepartment)
        .map((x) => x.role)
        .filter(Boolean),
    ),
  ].sort((a, b) => a.localeCompare(b));
  if (teamRole && !availableRoles.includes(teamRole)) teamRole = "";
  const group = dataset.filter(
    (x) => (!teamDepartment || x.department === teamDepartment) && (!teamRole || x.role === teamRole),
  );
  $("team-role").innerHTML =
    `<option value="">${language === "en" ? "All roles" : "Tutti i ruoli"}</option>` +
    availableRoles
      .map(
        (role) =>
          `<option value="${escapeHtml(role)}" ${role === teamRole ? "selected" : ""}>${escapeHtml(usingSample ? t(role) : role)}</option>`,
      )
      .join("");
  $("team-department").innerHTML =
    `<option value="">${language === "en" ? "All departments" : "Tutti i reparti"}</option>` +
    departments
      .map(
        (d) =>
          `<option value="${escapeHtml(d)}" ${d === teamDepartment ? "selected" : ""}>${escapeHtml(usingSample ? t(d) : d)}</option>`,
      )
      .join("");
  $("team-count").textContent = language === "en" ? `${group.length} people` : `${group.length} persone`;
  $("team-open-profile").disabled = !group.some((p) => p.id === current);
  $("team-list").innerHTML = [...group]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((person) => {
      const soft = average(person.skills.filter((s) => s.type === "soft")),
        hard = average(person.skills.filter((s) => s.type === "hard"));
      return `<button type="button" class="team-row ${person.id === selected.id ? "is-selected" : ""}" data-person="${escapeHtml(person.id)}" aria-pressed="${person.id === selected.id}"><span><strong>${escapeHtml(person.name)}</strong><small>${escapeHtml(usingSample ? t(person.department) : person.department)}</small></span><span class="team-row-scores">${fmt(soft)} / ${fmt(hard)}<small>soft / hard</small></span></button>`;
    })
    .join("");
  $("team-list").scrollTop = previousScroll;
}
function renderAdvanced(person) {
  const isEnglish = language === "en",
    tr = (it, en) => (isEnglish ? en : it),
    format = (n) => (isEnglish ? Number(n).toFixed(1) : Number(n).toFixed(1).replace(".", ",")),
    safe = escapeHtml;
  const dated = (value) =>
    validDate(value)
      ? new Intl.DateTimeFormat(isEnglish ? "en-GB" : "it-IT", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          timeZone: "UTC",
        }).format(new Date(value + "T00:00:00Z"))
      : tr("Non indicata", "Not provided");
  const withTargets = person.skills
    .filter((skill) => skill.target !== "" && skill.target !== undefined)
    .sort((a, b) => b.target - b.current - (a.target - a.current));
  const gapRow = (skill) => {
    const gap = Math.max(0, skill.target - skill.current);
    return `<div class="detail-row"><strong>${safe(skill.skill)}</strong><span class="gap-value">${format(skill.current)} / ${format(skill.target)}</span><small>${gap > 0 ? tr("Divario", "Gap") + ": " + format(gap) : tr("Livello atteso raggiunto", "Target reached")} · ${skill.type === "soft" ? "Soft skill" : "Hard skill"}</small></div>`;
  };
  $("gap-content").innerHTML = withTargets.length
    ? `<p class="detail-meta"><strong>${tr("Ruolo di riferimento", "Reference role")}:</strong> ${safe(person.next_role || tr("Non indicato", "Not provided"))}</p><p class="detail-meta gap-legend">${tr("Attuale / livello atteso", "Current / target level")}</p>` +
      withTargets.slice(0, 5).map(gapRow).join("") +
      (withTargets.length > 5
        ? `<details class="more-gaps"><summary>${tr("Mostra tutte le competenze", "Show all skills")} (${withTargets.length})</summary>${withTargets.slice(5).map(gapRow).join("")}</details>`
        : "")
    : `<p class="detail-empty">${tr("Livelli attesi non disponibili. Aggiungi la colonna target al CSV.", "Target levels are unavailable. Add the target column to the CSV.")}</p>`;
  const candidates = withTargets.length
    ? withTargets.filter((skill) => skill.current < skill.target)
    : [...person.skills.filter((skill) => skill.type === "soft")].sort((a, b) => a.current - b.current);
  const actions = candidates.slice(0, 3);
  const method = withTargets.length
    ? tr("Priorità basate sul divario dal livello atteso.", "Priorities based on the gap to the target.")
    : tr(
        "Priorità basate sui punteggi soft più bassi; manca il livello atteso.",
        "Priorities based on the lowest soft scores; target levels are missing.",
      );
  $("plan-content").innerHTML = actions.length
    ? `<p class="detail-meta">${method}</p>` +
      actions
        .map(
          (skill) =>
            `<div class="detail-row"><strong>${safe(skill.skill)}</strong><small>${safe(skill.development_action || tr("Azione da concordare.", "Action to be agreed."))}<br>${tr("Responsabile", "Owner")}: ${safe(skill.development_owner || tr("Da concordare", "To be agreed"))} · ${tr("Verifica", "Review")}: ${safe(dated(skill.development_due))}</small></div>`,
        )
        .join("")
    : `<p class="detail-empty">${tr("Nessun divario registrato rispetto ai livelli attesi disponibili.", "No gap recorded against available target levels.")}</p>`;
  $("aspiration-content").innerHTML =
    `<div class="detail-row"><strong>${tr("Interesse espresso", "Expressed interest")}</strong><small>${safe(person.aspiration || tr("Non ancora raccolto.", "Not yet recorded."))}</small></div><div class="detail-row"><strong>${tr("Disponibilità", "Availability")}</strong><small>${safe(person.availability || tr("Non ancora raccolta.", "Not yet recorded."))}</small></div><div class="detail-row"><strong>${tr("Prossimo ruolo", "Next role")}</strong><small>${safe(person.next_role || tr("Da definire insieme.", "To be defined together."))}</small></div>`;
  const options = person.skills.map((skill) => ({ key: skill.type + ":" + skill.skill, skill }));
  if (!options.some((option) => option.key === historySkill)) historySkill = options[0].key;
  $("history-skill").innerHTML = options
    .map(
      (option) =>
        `<option value="${safe(option.key)}" ${option.key === historySkill ? "selected" : ""}>${safe(option.skill.skill)}</option>`,
    )
    .join("");
  const skill = options.find((option) => option.key === historySkill).skill;
  const points = skill.history
    ? parseHistory(skill.history, 0)
    : [
        [skill.initial_date, skill.initial],
        [skill.current_date, skill.current],
      ]
        .filter(([date]) => validDate(date))
        .map(([date, score]) => ({ date, score }))
        .sort((a, b) => a.date.localeCompare(b.date));
  const chart = points.length
    ? `<div class="history-wrap"><div class="history-chart" role="img" aria-label="${tr("Storico valutazioni", "Assessment history")}: ${safe(points.map((point) => dated(point.date) + " " + format(point.score) + "/5").join(", "))}">${points.map((point) => `<div class="history-column"><strong>${format(point.score)}</strong><span class="history-bar" style="height:${point.score * 13}px"></span><time datetime="${safe(point.date)}">${safe(dated(point.date))}</time></div>`).join("")}</div></div>`
    : `<p class="detail-empty">${tr("Nessuna valutazione datata disponibile.", "No dated assessments are available.")}</p>`;
  $("history-content").innerHTML =
    chart +
    `<div class="detail-row"><strong>${tr("Valutatore", "Assessor")}</strong><small>${safe(skill.assessor || tr("Non indicato", "Not provided"))}</small></div><div class="detail-row"><strong>${tr("Evidenza", "Evidence")}</strong><small>${safe(skill.evidence || tr("Nessuna evidenza registrata.", "No evidence recorded."))}</small></div>`;
}
