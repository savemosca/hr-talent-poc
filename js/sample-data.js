"use strict";
// Fictional sample dataset and CSV headers.
const softNames = [
  "Leadership",
  "Comunicazione",
  "Lavoro di squadra",
  "Problem solving",
  "Capacità decisionale",
  "Responsabilità",
  "Attenzione alla sicurezza",
  "Orientamento alla qualità",
  "Adattabilità",
  "Gestione dei conflitti",
];
const hardNames = ["Conduzione impianti", "Controllo qualità", "Procedure di sicurezza", "Manutenzione di base"];
const people = [
  [
    "P001",
    "Marco Bianchi",
    "Operatore senior",
    "Produzione",
    "8",
    "Assemblaggio e controllo dei componenti; verifica degli standard di qualità; supporto al team e rispetto delle procedure.",
    "Operatore|Operatore senior|Team leader|Capo linea",
    "Team leader",
    [4.2, 4, 4.5, 4, 3.8, 4.2, 4.6, 4.3, 3.9, 3.6],
    [4.2, 4.3, 4.7, 3.8],
  ],
  [
    "P002",
    "Giulia Conti",
    "Operatrice di linea",
    "Produzione",
    "5",
    "Conduzione della linea, controllo visivo e registrazione delle anomalie.",
    "Operatrice|Operatrice senior|Team leader|Capo linea",
    "Operatrice senior",
    [3.4, 4.3, 4.5, 3.6, 3.2, 4, 4.5, 4.3, 4.1, 3.3],
    [3.8, 4.2, 4.5, 3.2],
  ],
  [
    "P003",
    "Luca Ferrari",
    "Operatore senior",
    "Produzione",
    "7",
    "Preparazione degli impianti, controlli di processo e affiancamento ai colleghi.",
    "Operatore|Operatore senior|Team leader|Capo linea",
    "Team leader",
    [3.8, 3.7, 4.1, 4, 3.7, 4, 4.4, 4.2, 3.9, 3.4],
    [4.3, 4, 4.4, 4.1],
  ],
  [
    "P004",
    "Sara Moretti",
    "Operatrice",
    "Confezionamento",
    "3",
    "Confezionamento, verifica delle etichette e segnalazione delle non conformità.",
    "Operatrice|Operatrice senior|Team leader|Capo reparto",
    "Operatrice senior",
    [3, 3.6, 4, 3.4, 3, 3.7, 4.3, 4.1, 4, 3.2],
    [3.2, 3.9, 4.2, 2.8],
  ],
  [
    "P005",
    "Andrea Rossi",
    "Operatore",
    "Produzione",
    "4",
    "Conduzione delle macchine e controlli di processo secondo le istruzioni operative.",
    "Operatore|Operatore senior|Team leader|Capo linea",
    "Operatore senior",
    [3.2, 3.4, 3.7, 3.5, 3.1, 3.6, 4.1, 3.8, 3.5, 3],
    [3.8, 3.7, 4.1, 3.3],
  ],
  [
    "P006",
    "Amina Benali",
    "Operatrice senior",
    "Confezionamento",
    "6",
    "Controllo dei lotti, cambio formato e affiancamento dei nuovi colleghi.",
    "Operatrice|Operatrice senior|Team leader|Capo reparto",
    "Team leader",
    [4.1, 4.4, 4.6, 3.9, 3.8, 4.4, 4.7, 4.5, 4.2, 4],
    [4.2, 4.5, 4.6, 3.5],
  ],
  [
    "P007",
    "Daniel Kowalski",
    "Addetto manutenzione",
    "Manutenzione",
    "9",
    "Diagnostica di primo livello e supporto agli interventi programmati sugli impianti.",
    "Tecnico junior|Tecnico|Coordinatore manutenzione",
    "Coordinatore manutenzione",
    [3.5, 3.4, 3.9, 4.5, 4, 4.3, 4.6, 4.2, 3.8, 3.3],
    [4.7, 4.1, 4.7, 4.8],
  ],
  [
    "P008",
    "Elena Romano",
    "Addetta controllo qualità",
    "Qualità",
    "6",
    "Verifica delle specifiche, registrazione dei controlli e gestione delle non conformità.",
    "Addetta qualità|Specialista qualità|Responsabile qualità",
    "Specialista qualità",
    [3.6, 4.2, 4.1, 4.3, 3.8, 4.5, 4.5, 4.9, 4, 3.7],
    [3.6, 4.8, 4.5, 3.1],
  ],
  [
    "P009",
    "Ravi Patel",
    "Operatore di linea",
    "Produzione",
    "2",
    "Preparazione dei materiali, avvio macchina e segnalazione delle anomalie.",
    "Operatore|Operatore senior|Team leader|Capo linea",
    "Operatore senior",
    [2.9, 3.3, 3.8, 3.5, 3, 3.6, 4.2, 3.8, 4.1, 3.1],
    [3.3, 3.5, 4.1, 3],
  ],
  [
    "P010",
    "Sofia Hernández",
    "Operatrice senior",
    "Confezionamento",
    "7",
    "Coordinamento del cambio turno, controllo delle etichette e supporto alla formazione.",
    "Operatrice|Operatrice senior|Team leader|Capo reparto",
    "Team leader",
    [4.3, 4.5, 4.6, 4.1, 4, 4.4, 4.7, 4.5, 4.4, 4.1],
    [4.1, 4.4, 4.6, 3.7],
  ],
  [
    "P011",
    "Mei Chen",
    "Operatrice di linea",
    "Produzione",
    "4",
    "Monitoraggio dei parametri di processo e rilevazione delle anomalie di produzione.",
    "Operatrice|Operatrice senior|Team leader|Capo linea",
    "Operatrice senior",
    [3.1, 3.6, 4, 4.2, 3.4, 4, 4.4, 4.5, 4, 3.2],
    [4.2, 4.4, 4.5, 3.7],
  ],
  [
    "P012",
    "Omar Diallo",
    "Operatore",
    "Logistica interna",
    "3",
    "Movimentazione dei materiali, approvvigionamento delle linee e controllo delle scorte.",
    "Operatore logistico|Operatore senior|Team leader logistico",
    "Operatore senior",
    [3.3, 4, 4.4, 3.5, 3.2, 4.1, 4.6, 3.8, 4.3, 3.7],
    [3.5, 3.6, 4.5, 3.2],
  ],
  [
    "P013",
    "Francesca Greco",
    "Operatrice senior",
    "Produzione",
    "10",
    "Gestione delle postazioni critiche e affiancamento degli operatori durante il turno.",
    "Operatrice|Operatrice senior|Team leader|Capo linea",
    "Team leader",
    [4.5, 4.4, 4.6, 4.3, 4.2, 4.5, 4.8, 4.6, 4.3, 4.2],
    [4.5, 4.6, 4.8, 4.1],
  ],
  [
    "P014",
    "Alex Morgan",
    "Tecnico di reparto",
    "Manutenzione",
    "5",
    "Controlli preventivi, analisi dei guasti e collaborazione con la produzione.",
    "Tecnico junior|Tecnico|Coordinatore manutenzione",
    "Coordinatore manutenzione",
    [3.2, 3.7, 4, 4.2, 3.6, 4.1, 4.5, 4, 4.1, 3.5],
    [4.4, 3.9, 4.6, 4.5],
  ],
  [
    "P015",
    "Nadia Popescu",
    "Addetta controllo qualità",
    "Qualità",
    "3",
    "Campionamento dei prodotti, controlli documentali e segnalazione degli scostamenti.",
    "Addetta qualità|Specialista qualità|Responsabile qualità",
    "Specialista qualità",
    [3.1, 3.8, 4.2, 3.9, 3.4, 4.2, 4.5, 4.7, 4, 3.5],
    [3.3, 4.5, 4.5, 2.9],
  ],
];
const additionalNames = [
  "Valentina Serra",
  "Youssef Amrani",
  "Chiara Lombardi",
  "Anna Müller",
  "Pietro Marini",
  "Fatima Zahra",
  "Mateusz Nowak",
  "Beatrice Ricci",
  "Samuel Okoro",
  "Laura Moretti",
  "Emil Johansson",
  "Sofia Rinaldi",
  "Priya Sharma",
  "Alessandro Fontana",
  "Marta Colombo",
  "David Williams",
  "Ibrahim Hassan",
  "Claudia Villa",
  "Nina Petrova",
  "Filippo Gallo",
  "Grace Mensah",
  "Tomás Silva",
  "Aisha Khan",
  "Federico De Luca",
  "Maya Rodriguez",
  "Stefano Caruso",
  "Leila Haddad",
  "Thomas Dubois",
  "Giorgia Riva",
  "Andrei Ionescu",
  "Isabella Costa",
  "Hugo Ferreira",
  "Sara Esposito",
  "Keiko Tanaka",
  "Marco Mancini",
];
additionalNames.forEach((name, index) => {
  const source = people[(index * 7 + 3) % 15];
  const variation = ((index % 7) - 3) * 0.12;
  const scores = (values) =>
    values.map((v, i) =>
      Math.max(1, Math.min(5, Math.round((v + variation + (((i + index) % 3) - 1) * 0.1) * 10) / 10)),
    );
  people.push([
    `P${String(index + 16).padStart(3, "0")}`,
    name,
    source[2],
    source[3],
    String(2 + ((index * 3) % 13)),
    ...source.slice(5, 8),
    scores(source[8]),
    scores(source[9]),
  ]);
});
// Fictional factory archetypes, informed by publicly described Siemens manufacturing work.
const roleProfiles = [
  {
    role: "Operatore assemblaggio",
    department: "Assemblaggio",
    description: "Assemblaggio di componenti industriali, uso delle istruzioni operative e controllo delle anomalie.",
    path: "Operatore assemblaggio|Operatore esperto|Team leader|Capo linea",
    next: "Operatore esperto",
    hard: ["Lettura schemi tecnici", "Assemblaggio componenti", "Controlli di processo", "Procedure di sicurezza"],
    weights: [1.2, 1.6, 1.2, 1.5],
  },
  {
    role: "Addetto collaudo funzionale",
    department: "Collaudo",
    description: "Esecuzione dei test funzionali, registrazione dei risultati e segnalazione delle anomalie.",
    path: "Addetto collaudo funzionale|Addetto collaudo esperto|Team leader|Responsabile collaudo",
    next: "Addetto collaudo esperto",
    hard: ["Lettura schemi tecnici", "Test funzionali", "Documentazione dei test", "Procedure di sicurezza"],
    weights: [1.3, 1.7, 1.2, 1.5],
  },
  {
    role: "Saldatore industriale",
    department: "Saldatura",
    description: "Preparazione dei componenti, saldatura e controllo visivo nel rispetto delle procedure.",
    path: "Saldatore industriale|Saldatore esperto|Team leader|Capo reparto",
    next: "Saldatore esperto",
    hard: ["Lettura schemi tecnici", "Tecniche di saldatura", "Controllo visivo", "Procedure di sicurezza"],
    weights: [1.2, 1.7, 1.3, 1.5],
  },
  {
    role: "Tecnico manutenzione",
    department: "Manutenzione",
    description: "Controlli preventivi, diagnostica di primo livello e supporto agli interventi sugli impianti.",
    path: "Tecnico manutenzione|Tecnico esperto|Coordinatore manutenzione|Responsabile manutenzione",
    next: "Tecnico esperto",
    hard: ["Diagnostica impianti", "Manutenzione preventiva", "Ricerca guasti", "Procedure di sicurezza"],
    weights: [1.5, 1.4, 1.5, 1.6],
  },
  {
    role: "Operatore logistico",
    department: "Logistica interna",
    description: "Movimentazione dei materiali, approvvigionamento delle postazioni e controllo delle scorte.",
    path: "Operatore logistico|Operatore logistico esperto|Team leader logistico|Responsabile logistica",
    next: "Operatore logistico esperto",
    hard: ["Gestione materiali", "Tracciabilità dei lotti", "Controllo delle scorte", "Procedure di sicurezza"],
    weights: [1.4, 1.5, 1.3, 1.5],
  },
];
const softLevels = [2.1, 2.5, 2.8, 3.1, 3.3, 3.5, 3.8, 4.1, 4.4, 4.7];
const hardLevels = [4.3, 2.2, 3.8, 2.6, 4.5, 3.1, 2.1, 4.1, 2.9, 4.6];
const clampScore = (value) => Math.max(1, Math.min(5, Math.round(value * 10) / 10));
people.forEach((person, index) => {
  const role = roleProfiles[index % roleProfiles.length],
    rank = Math.floor(index / roleProfiles.length);
  person[2] = role.role;
  person[3] = role.department;
  person[5] = role.description;
  person[6] = role.path;
  person[7] = role.next;
  person[8] = softNames.map((_, skill) =>
    clampScore(softLevels[rank] + ((index % 5) - 2) * 0.14 + (((skill * 3 + index * 2) % 7) - 3) * 0.12),
  );
  person[9] = role.hard.map((_, skill) =>
    clampScore(hardLevels[rank] + ((index % 5) - 2) * 0.16 + (((skill * 5 + index * 2) % 7) - 3) * 0.13),
  );
  person[10] = index % roleProfiles.length;
});
const requiredHeaders = [
  "id",
  "name",
  "role",
  "department",
  "tenure_years",
  "job_description",
  "career_path",
  "next_role",
  "type",
  "skill",
  "initial",
  "current",
  "weight",
  "development_action",
];
const optionalHeaders = [
  "initial_date",
  "current_date",
  "assessor",
  "evidence",
  "target",
  "aspiration",
  "development_owner",
  "development_due",
  "history",
  "availability",
];
const headers = [...requiredHeaders, ...optionalHeaders];
const advice = {
  Leadership: "Affiancare un team leader e coordinare una breve riunione di reparto.",
  Comunicazione: "Allenare passaggi di consegna chiari e chiedere feedback ai colleghi.",
  "Lavoro di squadra": "Partecipare a un’attività interfunzionale e condividere obiettivi e risultati.",
  "Problem solving": "Analizzare un problema ricorrente con il metodo dei 5 perché.",
  "Capacità decisionale": "Discutere casi pratici con il responsabile e motivare le scelte.",
  Responsabilità: "Concordare un obiettivo misurabile e verificarne periodicamente i risultati.",
  "Attenzione alla sicurezza": "Ripassare le procedure e partecipare a un confronto sui rischi di reparto.",
  "Orientamento alla qualità": "Rivedere una non conformità e proporre un’azione correttiva.",
  Adattabilità: "Svolgere un affiancamento su una diversa postazione.",
  "Gestione dei conflitti": "Esercitare ascolto attivo e confronto costruttivo con un tutor.",
};
function sampleRows() {
  return people.flatMap((p) => {
    const role = roleProfiles[p[10]];
    const extras = (current, initial, target) => [
      "2023-01-15",
      "2026-01-15",
      "Responsabile di reparto",
      "Esempio simulato: osservazione da verificare.",
      target,
      "Disponibile a esplorare un percorso di coordinamento.",
      "Responsabile e collaboratore",
      "2026-12-15",
      `2023-01-15:${initial}|2024-07-15:${clampScore((initial + current) / 2)}|2026-01-15:${current}`,
      "Disponibilità da discutere durante il colloquio.",
    ];
    return [
      ...softNames.map((skill, i) => {
        const initial = clampScore(p[8][i] - (0.3 + (i % 4) * 0.15));
        return [
          ...p.slice(0, 8),
          "soft",
          skill,
          initial,
          p[8][i],
          i === 0 ? 1.5 : 1,
          advice[skill],
          ...extras(p[8][i], initial, [4, 4, 4, 4, 3.5, 4, 4.5, 4, 3.5, 4][i]),
        ];
      }),
      ...role.hard.map((skill, i) => {
        const initial = clampScore(p[9][i] - (0.3 + (i % 3) * 0.15));
        return [
          ...p.slice(0, 8),
          "hard",
          skill,
          initial,
          p[9][i],
          role.weights[i],
          "Concordare con il responsabile formazione pratica e verifica sul campo.",
          ...extras(p[9][i], initial, i === 3 ? 4.5 : 4),
        ];
      }),
    ];
  });
}
