# TalentFlow · HR dashboard proof of concept

A local web dashboard for exploring production employees' skills and development. Open `index.html` in a current browser. No installation, account, server or network connection is required. The built-in dataset contains 50 fictional people in five illustrative production roles, with ten people per role: assembly, functional testing, welding, maintenance, and internal logistics. Scores, skill definitions, weighting and career paths are invented for demonstration; they do not represent actual Siemens employees or its assessment framework. The industrial setting is loosely informed by [Siemens’s Frankfurt switchgear factory](https://www.siemens.com/en-gb/company/jobs/growth-careers/job-offers-switchgear-plant-frankfurt/), which describes manufacturing, functional testing and welding. The internal logistics role is a generic illustrative role informed by [Siemens job listings](https://jobs.siemens.com/en_US/externaljobs/SearchJobs/?folderId=491342&folderOffset=120&folderRecordsPerPage=6).

The theme button switches between light and dark appearance. The selected theme is saved in browser storage; when no preference has been saved, the application uses the device setting. No employee data is stored there.

The initial interface language follows the browser language (Italian or English; English fallback). A manually selected language is saved in browser local storage. The selector also translates the built-in sample profiles. Imported text remains in its original language and is not automatically translated. Names or text entered by users are not sent anywhere.

For the full product decisions, architecture, data model, calculations and production gaps, see [project documentation](docs/PROJECT.md).

## Getting started

1. Open `index.html` and search by name or ID, filter by department, and select a person from the menu or talent matrix. Enable **Show insights** to view the target-role comparison, development actions, aspirations and assessment history. The choice is remembered on the device. The matrix shows the filtered people. Expand the hard-skills breakdown to inspect scores and weights.
2. Open the [example workbook](outputs/sample-data/TalentFlow-sample-data.xlsx), or download the sample CSV from the dashboard. Edit the `Data` sheet and save a copy as CSV UTF-8. Select **Import CSV** in the dashboard. The application does not read `.xlsx` directly.
3. Imported CSV content and the selected person, search and department are kept in the browser’s session storage for the current tab, so they survive a refresh. Closing the tab normally ends the session; browser session restore may retain it. The original file is never modified. If browser storage is unavailable or full, the app warns that imported data will be lost on refresh.

Each row represents one skill for one person. Repeat identical personal information for every row of the same ID. Each person must have at least one `soft` and one `hard` skill. IDs must be unique per person and skills must not be duplicated within a person's skill type. Skills and weights can differ by department. In the sample, each department corresponds to a role: its ten people share the same skill names and weights so that comparisons within the role are meaningful. Sample scores span all four matrix quadrants; their distribution is deliberately illustrative, not empirical.

| Columns | Meaning |
|---|---|
| `id`, `name`, `role`, `department`, `tenure_years` | Person and role information. |
| `job_description` | Description of current duties. |
| `career_path` | Roles separated by `|`, e.g. `Operator|Team leader|Supervisor`. |
| `next_role` | Indicative next role. |
| `type`, `skill` | `soft` or `hard`, and the skill name. |
| `initial`, `current` | Scores between 1 and 5, including decimals. Only these two assessments are compared. |
| `weight` | Positive number indicating the skill's relevance to the weighted average. |
| `development_action` | Suggested development action for this skill. |
| `target` | Optional target level from 1 to 5 for this skill and next role. |
| `aspiration` | Optional expressed interest, repeated identically for each row of the same person. |
| `initial_date`, `current_date` | Optional assessment dates in `YYYY-MM-DD` format. |
| `availability` | Optional availability expressed by the employee, repeated identically for each row of the same person. |
| `assessor`, `evidence` | Optional assessor and observation for the skill. |
| `development_owner`, `development_due` | Optional action owner and review date (`YYYY-MM-DD`). |
| `history` | Optional chronological entries `YYYY-MM-DD:score` separated by `|`, e.g. `2023-01-15:2.5|2024-07-15:3.0`. |

All ten insights fields are optional; old CSV files continue to work. Missing values are shown as unavailable. The three-point histories, dates, evidence, targets, aspirations and action owners in the sample are fictional examples, not actual assessments. When target levels exist, the development plan prioritizes the largest gaps; otherwise it displays the lowest soft-skill scores and clearly states the basis. Targets are configured inputs, not validated predictions.

CSV files separated by semicolons or commas are supported, as are decimal points and decimal commas. The original Italian column names from the earlier proof of concept are also accepted. Invalid imports show an error and leave the existing data unchanged.

## Scoring

- The radar compares initial and current soft-skill scores; numbers correspond to the adjacent list.
- Strengths are the three highest current soft skills. Suggestions are the `development_action` text for the three lowest soft skills; they are configured data, not AI-generated advice.
- Each matrix axis uses `sum(current score × weight) / sum(weights)`: X is soft skills and Y is hard skills. Each dot represents a person. The illustrative threshold is **3.5 on both axes**; the top-right area identifies profiles for further discussion, not automatic promotion. HR and department managers must validate the weights and threshold.
- The potential label is a simple matrix-based indicator, not a psychological assessment or prediction. Interviews, context, individual aspirations and human judgment remain essential.

## Tests

Run `node tests/dashboard.test.cjs` to check import validation, scoring, filtering, empty states and language switching.

## Privacy and limitations

The application has no external libraries, cloud services, cookies or telemetry. Imported data is not transmitted to a server by the application. The imported CSV is stored in browser session storage, which is not encrypted by this application. Language and theme preferences are stored in local storage; view state is stored in session storage. File access, local storage, backups, device cloud synchronization, and lawful use remain subject to company policies. Never commit real employee data. This is a demonstration, not a production HR system: it has no authentication, encryption, access control, audit trail or shared editing. Dated history is imported as supplied rather than collected through an assessment workflow. Consult HR, IT and privacy teams before using actual employee data.

Possible next steps include yearly history, consistent department-level weight definitions, role filters, assessment evidence, access controls, secure storage and direct Excel import.
