"use strict";
// Italian to English translations and language detection.
const translations = {
  "PEOPLE & CULTURE": "PEOPLE & CULTURE",
  "SVILUPPO TALENTI": "TALENT DEVELOPMENT",
  "Dashboard talenti": "Talent dashboard",
  "Una visione chiara delle competenze, oggi e nel tempo.": "A clear view of skills, today and over time.",
  "Dati in locale": "Local data",
  "PERSONA SELEZIONATA": "SELECTED PERSON",
  "Persone e competenze": "People and skills",
  "Seleziona una persona per esplorare il suo percorso.": "Select a person to explore their development.",
  "Profilo individuale": "Individual profile",
  "Scarica dati di esempio": "Download example data",
  "Importa CSV": "Import CSV",
  "LA PERSONA": "THE PERSON",
  "PROFILO SELEZIONATO": "SELECTED PROFILE",
  "PROFILO OPERATORE": "EMPLOYEE PROFILE",
  "RUOLO ATTUALE": "CURRENT ROLE",
  "PROSSIMO PASSO": "NEXT STEP",
  "INDICAZIONE DALLA MATRICE": "MATRIX INDICATOR",
  "Punti di forza": "Strengths",
  "SOFT SKILL PIÙ ALTE": "HIGHEST SOFT SKILLS",
  "Ogni percorso inizia dal riconoscere il potenziale.": "Every journey starts with recognizing potential.",
  "EVOLUZIONE DELLE COMPETENZE": "SKILLS OVER TIME",
  "SCALA 1–5": "SCALE 1–5",
  "Soft skill nel tempo": "Soft skills over time",
  "Un confronto tra la valutazione iniziale e quella attuale.": "Compare the initial and current assessments.",
  "Valutazione attuale": "Current assessment",
  "Valutazione iniziale": "Initial assessment",
  "CRESCITA E SVILUPPO": "GROWTH AND DEVELOPMENT",
  "Il percorso di crescita": "Career development",
  "Responsabilità attuali e prossime opportunità.": "Current responsibilities and future opportunities.",
  "Job description": "Job description",
  "Percorso di carriera": "Career path",
  "Prossime opportunità": "Development opportunities",
  "Suggerimenti orientativi sulle competenze più da sviluppare.":
    "Suggested actions for skills with the greatest room to grow.",
  "VISIONE D’INSIEME": "OVERVIEW",
  "MEDIE PONDERATE": "WEIGHTED AVERAGES",
  "Matrice dei talenti": "Talent matrix",
  "Una lettura combinata di competenze tecniche e trasversali.":
    "A combined view of technical and interpersonal skills.",
  "HARD SKILL": "HARD SKILLS",
  "DA SVILUPPARE": "DEVELOP",
  "AREA DA APPROFONDIRE": "AREA TO EXPLORE",
  "BASE DA COSTRUIRE": "BUILD THE FOUNDATION",
  "SOFT SOLIDE": "STRONG SOFT SKILLS",
  "SOFT SKILL": "SOFT SKILLS",
  "Soglia indicativa: 3,5 su entrambi gli assi. Il risultato supporta il confronto, non sostituisce la valutazione HR.":
    "Indicative threshold: 3.5 on both axes. This supports discussion and does not replace HR assessment.",
  "PROGETTO DIMOSTRATIVO": "DEMONSTRATION PROJECT",
  "Le valutazioni richiedono sempre una revisione umana.": "Assessments always require human review.",
  WORKSPACE: "WORKSPACE",
  "Dashboard talenti": "Talent dashboard",
  "Percorsi di crescita": "Career development",
  "Il talento cresce": "Talent grows",
  "insieme alle persone.": "with people.",
  "Una nuova prospettiva per lo sviluppo in produzione.": "A new perspective on development in manufacturing.",
  "PROGETTO PILOTA": "PILOT PROJECT",
  "su 5 · media ponderata": "out of 5 · weighted average",
  "Vai al contenuto": "Skip to content",
  "CERCA UNA PERSONA": "SEARCH PEOPLE",
  REPARTO: "DEPARTMENT",
  "Nessuna persona trovata": "No people found",
  "Modifica la ricerca o seleziona un altro reparto.": "Change your search or select another department.",
  "Cancella filtri": "Clear filters",
  "Dettaglio hard skill": "Hard skills breakdown",
  Produzione: "Production",
  Confezionamento: "Packaging",
  Manutenzione: "Maintenance",
  Qualità: "Quality",
  "Logistica interna": "Internal logistics",
  Operatore: "Operator",
  Operatrice: "Operator",
  "Operatore senior": "Senior operator",
  "Operatrice senior": "Senior operator",
  "Operatore di linea": "Line operator",
  "Operatrice di linea": "Line operator",
  "Operatore logistico": "Logistics operator",
  "Operatore junior": "Junior operator",
  "Tecnico junior": "Junior technician",
  Tecnico: "Technician",
  "Tecnico di reparto": "Department technician",
  "Addetto manutenzione": "Maintenance technician",
  "Addetta controllo qualità": "Quality control operator",
  "Addetta qualità": "Quality operator",
  "Specialista qualità": "Quality specialist",
  "Responsabile qualità": "Quality manager",
  "Coordinatore manutenzione": "Maintenance coordinator",
  "Team leader logistico": "Logistics team leader",
  "Capo linea": "Line supervisor",
  "Capo reparto": "Department supervisor",
  Leadership: "Leadership",
  Comunicazione: "Communication",
  "Lavoro di squadra": "Teamwork",
  "Problem solving": "Problem solving",
  "Capacità decisionale": "Decision making",
  Responsabilità: "Accountability",
  "Attenzione alla sicurezza": "Safety awareness",
  "Orientamento alla qualità": "Quality mindset",
  Adattabilità: "Adaptability",
  "Gestione dei conflitti": "Conflict management",
  "Conduzione impianti": "Equipment operation",
  "Controllo qualità": "Quality control",
  "Procedure di sicurezza": "Safety procedures",
  "Manutenzione di base": "Basic maintenance",
  "Affiancare un team leader e coordinare una breve riunione di reparto.":
    "Shadow a team leader and lead a short team meeting.",
  "Allenare passaggi di consegna chiari e chiedere feedback ai colleghi.":
    "Practice clear shift handovers and ask colleagues for feedback.",
  "Partecipare a un’attività interfunzionale e condividere obiettivi e risultati.":
    "Join a cross-functional activity and share goals and results.",
  "Analizzare un problema ricorrente con il metodo dei 5 perché.": "Analyze a recurring issue using the five whys.",
  "Discutere casi pratici con il responsabile e motivare le scelte.":
    "Discuss practical cases with the manager and explain decisions.",
  "Concordare un obiettivo misurabile e verificarne periodicamente i risultati.":
    "Agree on a measurable goal and review progress regularly.",
  "Ripassare le procedure e partecipare a un confronto sui rischi di reparto.":
    "Review procedures and discuss department risks.",
  "Rivedere una non conformità e proporre un’azione correttiva.":
    "Review a nonconformity and propose a corrective action.",
  "Svolgere un affiancamento su una diversa postazione.": "Shadow a colleague at a different workstation.",
  "Esercitare ascolto attivo e confronto costruttivo con un tutor.":
    "Practice active listening and constructive discussion with a mentor.",
  "Concordare con il responsabile formazione pratica e verifica sul campo.":
    "Agree on practical training and an on-the-job review with the manager.",
  "Assemblaggio e controllo dei componenti; verifica degli standard di qualità; supporto al team e rispetto delle procedure.":
    "Assemble and inspect components, check quality standards, support the team and follow procedures.",
  "Conduzione della linea, controllo visivo e registrazione delle anomalie.":
    "Operate the line, perform visual checks and record anomalies.",
  "Preparazione degli impianti, controlli di processo e affiancamento ai colleghi.":
    "Prepare equipment, perform process checks and support colleagues.",
  "Confezionamento, verifica delle etichette e segnalazione delle non conformità.":
    "Package products, verify labels and report nonconformities.",
  "Conduzione delle macchine e controlli di processo secondo le istruzioni operative.":
    "Operate machines and perform process checks according to work instructions.",
  "Controllo dei lotti, cambio formato e affiancamento dei nuovi colleghi.":
    "Check batches, change formats and support new colleagues.",
  "Diagnostica di primo livello e supporto agli interventi programmati sugli impianti.":
    "Perform first-level diagnostics and support scheduled equipment maintenance.",
  "Verifica delle specifiche, registrazione dei controlli e gestione delle non conformità.":
    "Verify specifications, record checks and handle nonconformities.",
  "Preparazione dei materiali, avvio macchina e segnalazione delle anomalie.":
    "Prepare materials, start machines and report anomalies.",
  "Coordinamento del cambio turno, controllo delle etichette e supporto alla formazione.":
    "Coordinate shift handovers, check labels and support training.",
  "Monitoraggio dei parametri di processo e rilevazione delle anomalie di produzione.":
    "Monitor process parameters and identify production anomalies.",
  "Movimentazione dei materiali, approvvigionamento delle linee e controllo delle scorte.":
    "Move materials, supply production lines and check inventory.",
  "Gestione delle postazioni critiche e affiancamento degli operatori durante il turno.":
    "Manage critical workstations and support operators during the shift.",
  "Controlli preventivi, analisi dei guasti e collaborazione con la produzione.":
    "Perform preventive checks, analyze failures and work with production.",
  "Campionamento dei prodotti, controlli documentali e segnalazione degli scostamenti.":
    "Sample products, check documentation and report deviations.",
};
Object.assign(translations, {
  Assemblaggio: "Assembly",
  Collaudo: "Testing",
  Saldatura: "Welding",
  "Operatore assemblaggio": "Assembly operator",
  "Operatore esperto": "Experienced operator",
  "Addetto collaudo funzionale": "Functional testing operator",
  "Addetto collaudo esperto": "Experienced testing operator",
  "Responsabile collaudo": "Testing manager",
  "Saldatore industriale": "Industrial welder",
  "Saldatore esperto": "Experienced welder",
  "Tecnico manutenzione": "Maintenance technician",
  "Tecnico esperto": "Experienced technician",
  "Responsabile manutenzione": "Maintenance manager",
  "Operatore logistico esperto": "Experienced logistics operator",
  "Responsabile logistica": "Logistics manager",
  "Lettura schemi tecnici": "Technical drawing interpretation",
  "Assemblaggio componenti": "Component assembly",
  "Controlli di processo": "Process checks",
  "Test funzionali": "Functional testing",
  "Documentazione dei test": "Test documentation",
  "Tecniche di saldatura": "Welding techniques",
  "Controllo visivo": "Visual inspection",
  "Diagnostica impianti": "Equipment diagnostics",
  "Manutenzione preventiva": "Preventive maintenance",
  "Ricerca guasti": "Troubleshooting",
  "Gestione materiali": "Materials handling",
  "Tracciabilità dei lotti": "Batch traceability",
  "Controllo delle scorte": "Inventory control",
  "Assemblaggio di componenti industriali, uso delle istruzioni operative e controllo delle anomalie.":
    "Assemble industrial components, follow work instructions and check for anomalies.",
  "Esecuzione dei test funzionali, registrazione dei risultati e segnalazione delle anomalie.":
    "Perform functional tests, record results and report anomalies.",
  "Preparazione dei componenti, saldatura e controllo visivo nel rispetto delle procedure.":
    "Prepare components, weld and perform visual inspection according to procedures.",
  "Controlli preventivi, diagnostica di primo livello e supporto agli interventi sugli impianti.":
    "Perform preventive checks and first-level diagnostics, and support equipment maintenance.",
  "Movimentazione dei materiali, approvvigionamento delle postazioni e controllo delle scorte.":
    "Move materials, supply workstations and check inventory.",
});
function preferredLanguage() {
  try {
    const saved = localStorage.getItem("talentflow-language");
    if (saved === "it" || saved === "en") return saved;
  } catch {}
  const languages =
    typeof navigator !== "undefined" ? (navigator.languages?.length ? navigator.languages : [navigator.language]) : [];
  for (const item of languages) {
    const code = String(item || "")
      .toLowerCase()
      .split("-")[0];
    if (code === "it" || code === "en") return code;
  }
  return "en";
}
Object.assign(translations, {
  "Approfondimenti HR": "HR insights",
  "Obiettivi, evidenze e percorso di sviluppo": "Goals, evidence and development plan",
  "Mostra approfondimenti": "Show insights",
  "SVILUPPO E CONFRONTO": "DEVELOPMENT AND REVIEW",
  "Un supporto al colloquio, da interpretare insieme alla persona.":
    "A discussion aid to review together with the employee.",
  "REVISIONE UMANA": "HUMAN REVIEW",
  "Competenze per il prossimo ruolo": "Skills for the next role",
  "Confronto tra valutazione attuale e livello atteso, se disponibile.":
    "Compare current scores with target levels, when available.",
  "Piano di sviluppo": "Development plan",
  "Azioni da discutere e concordare con la persona.": "Actions to discuss and agree with the employee.",
  "Aspirazioni e colloquio": "Aspirations and discussion",
  "Interessi espressi dalla persona e informazioni di contesto.": "The employee’s expressed interests and context.",
  "Valutazioni ed evidenze": "Assessments and evidence",
  "Date, valutatore e osservazioni associate alle competenze.": "Dates, assessor and observations for each skill.",
  "COMPETENZA DA ESAMINARE": "SKILL TO REVIEW",
  "Responsabile di reparto": "Department manager",
  "Esempio simulato: osservazione da verificare.": "Fictional example: observation to be verified.",
  "Disponibile a esplorare un percorso di coordinamento.": "Open to exploring a coordination role.",
  "Responsabile e collaboratore": "Manager and employee",
  "Disponibilità da discutere durante il colloquio.": "Availability to be discussed during the interview.",
});
Object.assign(translations, {
  "La soglia è 3,5 su una scala da 1 a 5: per questo i quadranti non hanno la stessa dimensione.":
    "The threshold is 3.5 on a 1–5 scale, so the quadrants are not the same size.",
  "Valutazione datata: l’ultima risale a più di 12 mesi fa. Verificarla prima di usarla in un colloquio.":
    "Outdated assessment: the latest is more than 12 months old. Check it before using it in a conversation.",
  "Valutazione datata": "Outdated assessment",
  "Come leggere i punteggi": "How to read the scores",
  "1 · Base": "1 · Basic",
  "2 · In sviluppo": "2 · Developing",
  "3 · Autonomo": "3 · Independent",
  "4 · Avanzato": "4 · Advanced",
  "5 · Riferimento": "5 · Reference",
  "Conosce l’attività, ma ha bisogno di supervisione continua.": "Knows the task but needs continuous supervision.",
  "Svolge compiti semplici, con supporto frequente.": "Performs simple tasks with frequent support.",
  "Lavora in autonomia in condizioni normali.": "Works independently in normal conditions.",
  "Gestisce anche situazioni insolite e aiuta i colleghi.": "Handles unusual situations and helps colleagues.",
  "È un punto di riferimento e trasferisce la competenza ad altri.":
    "Is a reference point and passes the skill on to others.",
  "Descrittori illustrativi: vanno validati con HR e responsabili di produzione.":
    "Illustrative descriptors: to be validated with HR and production managers.",
});
Object.assign(translations, {
  "Navigazione principale": "Main navigation",
  "Vista di reparto": "Department view",
  Dati: "Data",
  "Trova una persona e apri il suo profilo.": "Find a person and open their profile.",
  "Filtri persone": "People filters",
  "Elenco persone": "People directory",
  PERSONA: "PERSON",
  RUOLO: "ROLE",
  "Una vista centrata sulla persona e sul suo percorso.": "A person-centered view of skills and development.",
  "Tutte le persone": "All people",
  "CAMBIA PERSONA": "CHANGE PERSON",
  "Sezioni del profilo": "Profile sections",
  Panoramica: "Overview",
  Competenze: "Skills",
  Sviluppo: "Development",
  "IL PROSSIMO PASSO": "THE NEXT STEP",
  "Dal profilo all’azione": "From profile to action",
  "Approfondisci le competenze e definisci un percorso di sviluppo insieme alla persona.":
    "Explore skills and agree a development path together.",
  "Esplora le competenze": "Explore skills",
  "Vai allo sviluppo": "Go to development",
  CONFRONTO: "COMPARISON",
  "Esplora le competenze del gruppo e apri un profilo per approfondire.":
    "Explore the team’s skills and open a profile for details.",
  "Apri il profilo selezionato": "Open selected profile",
  "PERSONE NELLA VISTA": "PEOPLE IN THIS VIEW",
  "Confronto tra colleghi": "Compare colleagues",
  "Seleziona una persona per evidenziarla nella matrice.": "Select a person to highlight them in the matrix.",
  DATI: "DATA",
  "Gestisci il file usato dalla dashboard, direttamente sul tuo PC.":
    "Manage the file used by the dashboard, directly on your computer.",
  "FILE CORRENTE": "CURRENT FILE",
  "Importa i dati": "Import data",
  "Esporta il foglio Data come CSV UTF-8 e selezionalo qui.": "Export the Data sheet as UTF-8 CSV and select it here.",
  "Su Windows puoi usare anche Convert-Excel.bat, incluso nel progetto; richiede Python 3.":
    "On Windows, you can also use Convert-Excel.bat included in the project; Python 3 is required.",
  "PER INIZIARE": "GET STARTED",
  "Modello e istruzioni": "Template and instructions",
  "Usa i dati dimostrativi come base per preparare il tuo file.":
    "Use the example data as a starting point for your file.",
  "Scarica Excel di esempio": "Download example Excel",
  "PROFILO INDIVIDUALE": "INDIVIDUAL PROFILE",
  Persone: "People",
  "Disponibili nelle schede Competenze e Sviluppo.": "Available in the Skills and Development tabs.",
  "Per confronti più significativi, seleziona uno stesso ruolo: le competenze e i pesi possono variare.":
    "For more meaningful comparisons, select the same role: skills and weights may vary.",
});

Object.assign(translations, {
  "Mostra le foto": "Show photos",
  "Le foto possono influenzare la lettura dei punteggi: durante le discussioni su crescita e promozioni conviene nasconderle.":
    "Photos can influence how scores are read: hide them during discussions about growth and promotion.",
});

Object.assign(translations, {
  "Vista a tabella": "Table view",
  "Matrice dei talenti": "Talent matrix",
  "Usa le frecce per spostarti tra i punti e Invio per selezionare una persona.":
    "Use the arrow keys to move between dots and Enter to select a person.",
});
