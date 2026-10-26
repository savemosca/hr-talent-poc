# TalentFlow · HR dashboard proof of concept

A local web dashboard for exploring production employees' skills and development. Open `index.html` in a current browser. No installation, account, server or network connection is required. The built-in dataset contains 50 fictional profiles across five departments; names and details are illustrative.

The theme button switches between light and dark appearance. The selected theme is saved in browser storage; when no preference has been saved, the application uses the device setting. No employee data is stored there.

The language selector switches the interface and built-in sample profiles between Italian and English. Imported text remains in its original language and is not automatically translated. Names or text entered by users are not sent anywhere.

## Getting started

1. Open `index.html` and search by name or ID, filter by department, and select a person from the menu or talent matrix. The matrix shows the filtered people. Expand the hard-skills breakdown to inspect scores and weights.
2. Open the [example workbook](outputs/sample-data/TalentFlow-sample-data.xlsx), or download the sample CSV from the dashboard. Edit the `Data` sheet and save a copy as CSV UTF-8. Select **Import CSV** in the dashboard. The application does not read `.xlsx` directly.
3. Data is loaded into browser memory only; it is not saved automatically. Import the file again after refreshing the page. The original file is never modified.

Each row represents one skill for one person. Repeat identical personal information for every row of the same ID. Each person must have at least one `soft` and one `hard` skill. IDs must be unique per person and skills must not be duplicated within a person's skill type. Skills and weights can differ by department.

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

CSV files separated by semicolons or commas are supported, as are decimal points and decimal commas. The original Italian column names from the earlier proof of concept are also accepted. Invalid imports show an error and leave the existing data unchanged.

## Scoring

- The radar compares initial and current soft-skill scores; numbers correspond to the adjacent list.
- Strengths are the three highest current soft skills. Suggestions are the `development_action` text for the three lowest soft skills; they are configured data, not AI-generated advice.
- Each matrix axis uses `sum(current score × weight) / sum(weights)`: X is soft skills and Y is hard skills. Each dot represents a person. The illustrative threshold is **3.5 on both axes**; the top-right area identifies profiles for further discussion, not automatic promotion. HR and department managers must validate the weights and threshold.
- The potential label is a simple matrix-based indicator, not a psychological assessment or prediction. Interviews, context, individual aspirations and human judgment remain essential.

## Tests

Run `node tests/dashboard.test.cjs` to check import validation, scoring, filtering, empty states and language switching.

## Privacy and limitations

The application has no external libraries, cloud services, cookies or telemetry. Imported data is not transmitted to a server by the application. File access, local storage, backups, device cloud synchronization, and lawful use remain subject to company policies. Never commit real employee data. This is a demonstration, not a production HR system: it has no authentication, encryption, access control, audit trail, shared editing or complete yearly history. Consult HR, IT and privacy teams before using actual employee data.

Possible next steps include yearly history, consistent department-level weight definitions, role filters, assessment evidence, access controls, secure storage and direct Excel import.
