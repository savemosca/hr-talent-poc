# TalentFlow project documentation

## Purpose and current status

TalentFlow is a local, bilingual web proof of concept for discussing the skills and development of production employees. Its initial use case is a master-project presentation: make information currently recorded in interviews and paper notes easier to explore, and support a conversation about possible progression to roles such as team leader or line supervisor.

The project is a **demonstration**, not a production HR system or an automated promotion tool. The current code, scoring rules and fictional data do not establish a person's potential, predict job performance or make an employment decision. A human reviewer must consider the employee's own interests, evidence, context and agreed development activities.

## How the project evolved

The conversation established these product decisions:

1. Focus on production employees, whose competency frameworks differ from those used for office employees.
2. Provide a web dashboard that can run on a PC without publishing data or depending on a remote service. Use Excel as a familiar way to edit source data and CSV as the import format.
3. Present a person profile, soft-skill assessment, career path and talent matrix. Let users select a person and compare current with initial scores.
4. Include Italian and English, light and dark themes, search, filtering, fictional examples and a clear visual identity.
5. Use a limited number of illustrative manufacturing roles with multiple people in each, so a department filter can show comparable examples.
6. Treat the matrix as a discussion aid, and show target-role gaps, development actions, aspirations and dated evidence directly in the relevant profile tabs.

The visual identity uses a blue foundation with a restrained warm accent. Its working principles and colors are described in [BRAND.md](BRAND.md). The first visual references informed the original scope, not the current design.

## User workflow

1. Open `index.html` locally in a supported browser; no install or server is required.
2. In **People**, search by name or ID, filter by department. The list is ordered by name and cannot be sorted by score: a ranking would contradict the purpose of the tool as a discussion aid. Each row shows the person's soft / hard weighted averages, and "Outdated assessment" is added when the latest assessment date is more than 12 months old (`STALE_MONTHS` in `app.js`). Open a person from the list. Search filters the list without silently changing the selected person.
3. In **Individual profile**, use **Overview**, **Skills** and **Development** to explore the selected person. The **Individual profile** navigation item is hidden until a person has been opened, then stays available. The selected person remains visible in the profile header and a different person can be selected there without returning to the directory. Overview shows identity, strengths, the soft / hard averages and a notice when the assessments are outdated; target-role gaps, dated assessment evidence and a collapsible guide to the 1–5 scale are in Skills, and the development plan and aspirations are in Development. There is no separate insights switch.
5. In **Department view**, filter by department or role and select a person through either the matrix or the adjacent list. On first entry the role filter is preset to the selected person's role, since skill definitions and weights are comparable within a role; choosing a different filter is respected afterwards, and with **All roles** a highlighted notice and a role colour legend are shown. The selected person's scores are shown beside the matrix; open the profile for details. The department view has its own department and role filters. When different departments use different skill definitions or weights, their averages are not directly comparable.
6. In **Data**, open `outputs/sample-data/TalentFlow-sample-data.xlsx`, save it and use `Convert-Excel.bat` on Windows or `python3 scripts/excel_to_csv.py workbook.xlsx` to generate a CSV, then import it. Alternatively export the `Data` sheet as CSV UTF-8 directly from Excel. The app never writes back to the workbook.

The interface is still a single locally opened application; the four sections are focused views, not separate online services. Main navigation uses buttons, and the profile sections use accessible tabs with arrow-key navigation. The selected view, profile section and filters are restored during the tab session.

The app supports Italian and English. On first use it chooses a supported language from the browser's preferences, defaulting to English if none match. An explicit selection is stored for later visits. The built-in sample is translated for display; imported text is displayed as supplied and is not automatically translated. The app follows the system light/dark preference until a theme is selected manually, then remembers that preference. Reduced-motion settings are respected.

## Architecture and repository

- `index.html`: semantic structure, controls and both language indicators.
- `style.css`: responsive layout, brand styling, light/dark themes and motion settings.
- `js/`: the application code, as plain scripts loaded in the order listed in `index.html` (not ES modules, which browsers refuse to load from `file://`). All scripts share one global scope, as before.
  - `sample-data.js`: fictional sample dataset, CSV headers and `sampleRows()`.
  - `csv.js`: CSV encoding (spreadsheet formula characters are neutralised), parsing and validation.
  - `utils.js`: date helpers, the stale-assessment rule, weighted average and HTML escaping.
  - `portraits.js`, `radar.js`: synthetic portrait sprites and the soft-skill radar.
  - `i18n.js`: Italian-to-English translation tables and language detection.
  - `state.js`: application state, theme, photo preference, language switching and storage.
  - `render.js`: rendering of the people list, profile, team view, matrix, matrix table and details.
  - `app.js`: event wiring and start-up.
- `outputs/sample-data/TalentFlow-sample-data.xlsx`: fictional editable source workbook and Italian/English instructions.
- `scripts/excel_to_csv.py` and `Convert-Excel.bat`: optional local converter from a saved `.xlsx` workbook to a validated dashboard CSV; Python 3 is required for conversion, but not to run the web dashboard.
- `tests/dashboard.test.cjs` and `tests/test_excel_to_csv.py`: tests of data parsing, calculations, conversion, filters, localization, storage and optional insights.
- `docs/BRAND.md`: working brand direction.
- `README.md`: concise setup, usage, schema and limitations.

Run `node tests/dashboard.test.cjs` from the project directory; it loads the scripts in the order given by `index.html`. Besides logic, it checks that every visible static string in `index.html` has an English translation (brand names and text set from code are listed as exceptions in the test), so a forgotten translation fails the test. `.prettierrc.json` holds the formatting settings; JavaScript and CSS were formatted with Prettier (`npx prettier --write style.css js/*.js`), which is a development convenience and not needed to run the app. The app itself has no build step, backend, external JavaScript library, network dependency or telemetry. The optional converter uses only Python's standard library, works offline, reads cached Excel formula results and does not edit the workbook. It is currently opened as a local file. Automated tests exercise application logic with a simulated DOM; they do not replace accessibility, responsive or multi-browser testing.

## Fictional reference dataset

The built-in sample and workbook contain 50 fictional people across five illustrative cohorts, ten people each: assembly operator, functional testing operator, industrial welder, maintenance technician and logistics operator. Names, scores, targets, histories, dates, evaluators, evidence, interests, actions and career paths are invented. They do not represent real employees, actual Siemens job descriptions, company HR practices or an empirical workforce distribution.

The industrial setting is loosely informed by public information about [Siemens's Frankfurt switchgear factory](https://www.siemens.com/en-gb/company/jobs/growth-careers/job-offers-switchgear-plant-frankfurt/), which describes manufacturing, functional testing and welding, and by [Siemens job listings](https://jobs.siemens.com/en_US/externaljobs/SearchJobs/?folderId=491342&folderOffset=120&folderRecordsPerPage=6) for the existence of logistics work. The five role definitions, skill selections and weights are illustrative project choices. The sample is intentionally varied to populate all four matrix quadrants, not to simulate a measured real-world distribution.

Within each sample cohort, the same hard-skill definitions and weights are used. Across departments the hard skills and weights differ, so equal aggregate scores do not necessarily mean equivalent competencies. For meaningful comparison, filter to a common role and validate the framework with HR and production managers.

## Data model

The CSV has **one row per person and skill**, not one row per person. A person is identified by `id`. Profile fields must be repeated consistently across all rows for that ID. Each person must have at least one `soft` and one `hard` row; a skill must not be duplicated within a type for the same person.

### Required columns

The following headers must exist even if a non-key field is blank. Scores must be numbers in the range 1–5; weights must be positive. Decimal points or commas are accepted.

| Field | Meaning |
|---|---|
| `id`, `name`, `role`, `department`, `tenure_years` | Person identification, current role, department and tenure. |
| `job_description`, `career_path`, `next_role` | Current responsibilities, `|`-separated progression and indicative next role. |
| `type`, `skill` | Skill category (`soft` or `hard`) and name. |
| `initial`, `current` | Initial and current score. These are the two points used in the main radar and scoring. |
| `weight` | Positive weight used in the matrix average for the relevant skill type. |
| `development_action` | Text of a suggested action for the skill. |

### Optional columns

Older CSV files without these headers remain supported. Missing values are displayed as unavailable, rather than being invented.

| Field | Meaning |
|---|---|
| `target` | Expected skill level for the next role, from 1 to 5. An empty target means no comparison is available for that skill. |
| `aspiration` | Person's stated interest or context; must be repeated identically on all of that person's rows. |
| `availability` | Availability expressed by the person; repeated identically on all of that person’s rows. |
| `initial_date`, `current_date` | Dates of the two main scores, in `YYYY-MM-DD` form. |
| `assessor`, `evidence` | Assessor and observation for the skill. |
| `development_owner`, `development_due` | Action owner and review date; date uses `YYYY-MM-DD`. |
| `history` | Optional sequence such as `2023-01-15:2.5|2024-07-15:3.0|2026-01-15:3.5`. Dates must be valid, unique and strictly chronological; values must be between 1 and 5. |

The import supports comma- or semicolon-separated CSV, quoted fields, UTF-8 and the original Italian aliases for the required headers. A failed validation leaves the previously loaded dataset in place and displays an error. Date and history checks validate syntax and range; they cannot establish that an observation is genuine. In particular, the app does not currently cross-check history values against the separate initial/current fields or enforce uniform targets/weights for a role.

## Calculations and interpretation

### Radar and strengths

The radar plots the selected person's soft skills on a 1–5 scale, with initial and current values. The nearby list is the precise numeric reference. Main-view strengths are the three soft skills with the highest current score. The three main-view suggestions are attached to the lowest current soft-skill scores; they are configured text from the data, not AI-generated recommendations.

### Score scale

The interface shows illustrative descriptors for each level: 1 Basic (needs continuous supervision), 2 Developing (simple tasks with frequent support), 3 Independent (works independently in normal conditions), 4 Advanced (handles unusual situations and helps colleagues), 5 Reference (a reference point who passes the skill on). They are examples to make scores comparable between assessors; the real descriptors must be defined and validated with HR and production managers, and may differ by skill.

### Talent matrix

For each person, separately for soft and hard skills:

`weighted average = sum(current score × weight) / sum(weight)`

The horizontal axis is soft-skill average; the vertical axis is hard-skill average. Both range from 1 to 5. A dot shows one person and filters control which people appear. Dots are coloured by role (six colours, repeated if there are more roles) and named on hover, keyboard focus and for the selected person; hovering a row of the colleague list highlights its dot. The example threshold of 3.5 on each axis divides the matrix into four regions. Because 3.5 sits at 62.5% of the 1–5 scale, the regions have different sizes; the interface states this in a footnote rather than distorting the scale. The top-right is highlighted as an area to explore. The sample threshold and weights are placeholders; a high score in the current role does not prove interest in, readiness for or future success in a leadership role.

The main-view matrix indicator is derived only from whether both averages reach 3.5. Its two-decimal display is rounded, but the comparison uses unrounded values. In particular, it is not a separate measurement of potential or a promotion decision. Specific requirements such as safety must be considered on their own merits rather than assumed to be satisfied by an average.

### Role gaps and development details

When enabled and a person is visible:

- **Target-role gaps:** show each supplied target beside the current score. Gap = `max(0, target − current)`. Skills are ordered from the largest gap down. The first five are visible initially; the remainder can be expanded. A missing target is omitted, not treated as zero.
- **Development plan:** when any targets are supplied, suggest actions for up to three skills with the largest positive supplied gaps. If all supplied targets are reached, show that no gap has been recorded for the available targets. If there are no targets at all, use the three lowest soft-skill scores and disclose that basis. Partial target data means the resulting priorities are partial. Owner and review date appear only when supplied; actions need agreement and review by people.
- **Aspirations:** show the optional stated interest, availability and the indicative next role. Missing interests are explicitly shown as not recorded.
- **Assessments and evidence:** a skill selector shows supplied history as a dated bar chart, plus its assessor and evidence. If `history` is absent, dated initial/current points can be shown when dates were provided. When dates or evidence are missing, the app says so. The chart does not itself create annual assessment records.

The demo uses illustrative 2023, 2024 and 2026 records. The current model stores one assessor and one evidence text per skill, not a separate assessor/evidence for every historical observation. There is no in-app editing workflow or audit history.

## Local persistence and privacy

Language, theme and the photo preference are stored as browser preferences in `localStorage`. The imported CSV and view state (selected person, current view, profile section, search and department filters) are stored in the current tab's `sessionStorage`, so refresh can restore them. Browser behavior such as session restoration or copied tabs may retain or duplicate session data. If session storage is unavailable or full, the app warns that imported data will not survive refresh. The app does not encrypt browser storage or provide a per-user login. It does not send the data to a server, but device access, browser profiles, backups and synchronization remain outside its control.

The **Show photos** option in People hides portraits everywhere and shows initials instead. The note next to it explains why: photos can influence how scores are read, so they are best hidden in discussions about growth and promotion. Portraits are only shown for the sample data; imported data always uses initials. The 50 fictional sample profiles use locally bundled synthetic portrait art in two sprite images. These illustrations are not identity photographs and are not linked to real workers.

Do not commit real employee data. `.gitignore` excludes ordinary Excel and CSV files while explicitly allowing the fictional example workbook. The sample workbook is the only tracked Excel file intended by the project. Use of real HR data requires HR, IT and privacy review and an appropriate approved operating model.

## Outstanding work before production

- Establish an approved local or internal deployment and security model: authentication where appropriate, authorization by role, encrypted storage, managed backups, retention, deletion and auditability.
- Design a reliable assessment workflow: dated records, per-observation evidence and assessor, multi-year updates, conflict handling, data export and safe persistence. A CSV import and browser session are not a shared system of record.
- Define and validate competency frameworks, rating anchors, role targets, weighting, thresholds and minimum requirements with HR, production leaders and employees. Confirm consistency before comparing people or departments.
- Separate current-role performance, evidence of leadership behavior, readiness and individual aspirations. Do not present a 3.5 threshold or matrix position as validated potential.
- Add structured review, calibration and challenge of evaluations; define what happens when data is incomplete or assessors disagree.
- Test with representative users, keyboard and assistive technologies, multiple screen sizes and supported browsers. Add real browser tests and broader CSV/error/storage tests.
- Decide whether direct Excel import, user editing, PDF reporting and integrations are actually needed. Preserve an offline option if company policy and project needs require it.
- Maintain the private repository and review access before sharing. The repository contains fictional sample data only; real employee data must remain excluded.
