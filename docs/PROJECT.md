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
6. Treat the matrix as a discussion aid, then add an optional HR insights view covering target-role gaps, a development plan, aspirations and dated evidence.

The visual identity uses a blue foundation with a restrained warm accent. Its working principles and colors are described in [BRAND.md](BRAND.md). The first visual references informed the original scope, not the current design.

## User workflow

1. Open `index.html` locally in a supported browser; no install or server is required.
2. Search by name or ID, filter by department and select a person. The matrix contains the people matching the active filters.
3. Review the profile, strengths, soft-skill radar and list, career path, suggestions and matrix. Expand the hard-skill breakdown to inspect individual scores and weights.
4. Enable **Show insights / Mostra approfondimenti** to reveal target-role gaps, development actions, stated aspirations and the history and evidence for a selected skill. The control is optional and its state is remembered locally.
5. To work with a different dataset, edit `outputs/sample-data/TalentFlow-sample-data.xlsx`, save the `Data` sheet as CSV UTF-8 and import it. The application does not read `.xlsx` directly and never writes back to the source workbook.

The app supports Italian and English. On first use it chooses a supported language from the browser's preferences, defaulting to English if none match. An explicit selection is stored for later visits. The built-in sample is translated for display; imported text is displayed as supplied and is not automatically translated. The app follows the system light/dark preference until a theme is selected manually, then remembers that preference. Reduced-motion settings are respected.

## Architecture and repository

- `index.html`: semantic structure, controls and both language indicators.
- `style.css`: responsive layout, brand styling, light/dark themes and motion settings.
- `app.js`: fictional sample generator, CSV parsing and validation, calculations, UI rendering, translation and browser storage.
- `outputs/sample-data/TalentFlow-sample-data.xlsx`: fictional editable source workbook and Italian/English instructions.
- `tests/dashboard.test.cjs`: Node-based tests of data parsing, calculations, filters, localization, storage and optional insights.
- `docs/BRAND.md`: working brand direction.
- `README.md`: concise setup, usage, schema and limitations.

Run `node tests/dashboard.test.cjs` from the project directory. The app itself has no build step, backend, external JavaScript library, network dependency or telemetry. It is currently opened as a local file. Automated tests exercise application logic with a simulated DOM; they do not replace accessibility, responsive or multi-browser testing.

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

### Talent matrix

For each person, separately for soft and hard skills:

`weighted average = sum(current score × weight) / sum(weight)`

The horizontal axis is soft-skill average; the vertical axis is hard-skill average. Both range from 1 to 5. A dot shows one person and filters control which people appear. The example threshold of 3.5 on each axis divides the matrix into four regions. The top-right is currently highlighted for further discussion of a team-leader path. The sample threshold and weights are placeholders; a high score in the current role does not prove interest in, readiness for or future success in a leadership role.

The main-view matrix indicator is derived only from whether both averages reach 3.5. Its two-decimal display is rounded, but the comparison uses unrounded values. In particular, it is not a separate measurement of potential or a promotion decision. Specific requirements such as safety must be considered on their own merits rather than assumed to be satisfied by an average.

### Optional HR insights

When enabled and a person is visible:

- **Target-role gaps:** show each supplied target beside the current score. Gap = `max(0, target − current)`. Skills are ordered from the largest gap down. The first five are visible initially; the remainder can be expanded. A missing target is omitted, not treated as zero.
- **Development plan:** when any targets are supplied, suggest actions for up to three skills with the largest positive supplied gaps. If all supplied targets are reached, show that no gap has been recorded for the available targets. If there are no targets at all, use the three lowest soft-skill scores and disclose that basis. Partial target data means the resulting priorities are partial. Owner and review date appear only when supplied; actions need agreement and review by people.
- **Aspirations:** show the optional stated interest, availability and the indicative next role. Missing interests are explicitly shown as not recorded.
- **Assessments and evidence:** a skill selector shows supplied history as a dated bar chart, plus its assessor and evidence. If `history` is absent, dated initial/current points can be shown when dates were provided. When dates or evidence are missing, the app says so. The chart does not itself create annual assessment records.

The demo uses illustrative 2023, 2024 and 2026 records. The current model stores one assessor and one evidence text per skill, not a separate assessor/evidence for every historical observation. There is no in-app editing workflow or audit history.

## Local persistence and privacy

Language, theme and visibility of HR insights are stored as browser preferences in `localStorage`. The imported CSV and view state (selected person, search and department) are stored in the current tab's `sessionStorage`, so refresh can restore them. Browser behavior such as session restoration or copied tabs may retain or duplicate session data. If session storage is unavailable or full, the app warns that imported data will not survive refresh. The app does not encrypt browser storage or provide a per-user login. It does not send the data to a server, but device access, browser profiles, backups and synchronization remain outside its control.

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
