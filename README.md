# TalentFlow · POC dashboard HR

Una dashboard web dimostrativa per esplorare la crescita delle competenze degli operatori di produzione. Funziona sul computer, senza installazione, account, server o connessione: aprire **index.html** con un browser aggiornato (Chrome, Edge, Firefox o Safari). I dati iniziali comprendono 15 profili interamente fittizi, con nomi italiani e internazionali, distribuiti tra produzione, confezionamento, manutenzione, qualità e logistica interna. Anche gli eventuali riferimenti a persone reali sono casuali.

## Uso

1. Aprire `index.html` con doppio clic. Selezionare una persona dal menu o dalla matrice.
2. Usare **Scarica dati di esempio** per ottenere un CSV UTF-8 apribile in Excel. Modificarlo e salvarlo come **CSV UTF-8** mantenendo le intestazioni, poi scegliere **Importa CSV**. L'importazione avviene solo nel browser, in memoria: dopo l'aggiornamento della pagina occorre reimportare il file. Il file originale non viene modificato.
3. I dati sono organizzati con **una riga per persona e competenza**: le informazioni personali vanno ripetute identiche in tutte le righe dello stesso ID. Ogni persona deve avere almeno una skill `soft` e una `hard`. Le skill possono differire per reparto e persona. Nel campione le competenze hanno nomi comuni, ma alcuni pesi variano per reparto. Scegliere ID univoci e non duplicare una skill dello stesso tipo per la stessa persona.

| Colonne | Contenuto |
|---|---|
| `id`, `nome`, `ruolo`, `reparto`, `anzianita_anni` | Identificazione e profilo. |
| `job_description` | Descrizione del ruolo. |
| `percorso` | Ruoli separati da `|`, ad esempio `Operatore|Team leader|Capo linea`. |
| `prossimo_ruolo` | Prossimo ruolo indicativo. |
| `tipo`, `skill` | `soft` oppure `hard` e nome della competenza. |
| `iniziale`, `attuale` | Valori tra 1 e 5, anche decimali. Il confronto mostra solo questi due momenti. |
| `peso` | Numero positivo: rilevanza della skill nella media, eventualmente diversa per reparto. |
| `azione_sviluppo` | Suggerimento testuale associato alla competenza. |

Sono accettati CSV con separatore `;` o `,`, e valori numerici con punto o virgola decimale. Se l'importazione non è valida viene mostrato un errore e i dati già caricati restano visibili. Il CSV di esempio può essere aperto e modificato in Excel, ma l'app non legge direttamente file `.xlsx`.

## Logica della POC

- Il radar confronta punteggio iniziale e attuale delle soft skill; i numeri corrispondono alla lista accanto.
- I punti di forza sono le tre soft skill con punteggio attuale più alto; i consigli provengono dalla colonna `azione_sviluppo` delle tre soft skill con punteggio più basso. Sono suggerimenti configurati, non generati da un'IA.
- Ogni asse della matrice è una media ponderata: `somma(punteggio attuale × peso) / somma(pesi)`. X rappresenta le soft skill, Y le hard skill. I pallini rappresentano tutte le persone importate. La soglia dimostrativa è **3,5 su entrambi gli assi**; il quadrante superiore destro indica profili da approfondire, non una promozione automatica. I pesi e la soglia devono essere validati dall'azienda.
- La dicitura sul potenziale è soltanto un'indicazione basata sulla posizione nella matrice, non una valutazione psicologica o una previsione. Colloqui, contesto, aspirazioni individuali e giudizio umano rimangono essenziali.

## Riservatezza e limiti

La pagina non usa librerie esterne, servizi cloud, cookie o telemetria. I file importati non sono inviati dalla POC a un server. Il CSV resta sul computer dell'utente: custodia, accessi, backup, eventuale sincronizzazione cloud del PC e base giuridica sono da gestire secondo le policy aziendali. Non inserire dati reali nel repository Git. Questa è una dimostrazione, non un sistema HR di produzione: non offre autenticazione, cifratura, controlli di accesso, audit, gestione condivisa o storico annuale completo. Prima dell'uso con dati reali occorrono una valutazione con HR/IT/privacy e l'adeguamento alle policy applicabili.

## Evoluzioni possibili

Storico per anno, pesi centralizzati e coerenti per reparto, filtri e confronti per ruolo, raccolta di evidenze e feedback, gestione autorizzazioni, conservazione sicura e importazione diretta Excel. La soglia e le competenze vanno definite e validate con i responsabili di produzione.
