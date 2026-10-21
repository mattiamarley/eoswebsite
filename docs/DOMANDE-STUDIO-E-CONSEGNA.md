# EOS — incontro di consegna e decisioni per la pubblicazione

Preparato il 21 ottobre 2026 · Documento di lavoro per Mattia

## Come condurre l’incontro

Apri così: «Prima di mettere online il nuovo sito vorrei confermare chi gestisce dominio, email e hosting, quali contenuti sono pubblicabili e chi sarà responsabile degli aggiornamenti. L’obiettivo è una consegna chiara, senza interrompere i servizi che già utilizzate».

Proponi 60 minuti: 10 per obiettivi e referenti, 15 per infrastruttura, 15 per contenuti e candidature, 10 per manutenzione, 10 per decisioni e scadenze. Per ogni risposta annota responsabile, documento da ricevere, scadenza e approvatore. Le credenziali vanno condivise con inviti nominativi o un gestore sicuro, non in questo verbale.

## Le 12 domande da porre per prime

1. Chi possiede e rinnova eosweb.it? Qual è il registrar e chi ha accesso alla zona DNS?
2. Dove è ospitato oggi il sito, chi lo gestisce e quando scadono contratto e servizi?
3. La posta elettronica è collegata allo stesso fornitore? Chi gestisce caselle, PEC e record MX, SPF, DKIM e DMARC?
4. Chi è il referente tecnico e chi dà l’approvazione finale a design, testi e pubblicazione?
5. Quali tre risultati deve ottenere il sito: contatti commerciali, reputazione, recruiting, gare o altro?
6. Quali progetti, clienti e fotografie possiamo pubblicare, con quali autorizzazioni e limitazioni?
7. Chi può accedere al pannello amministrativo e chi approva gli aggiornamenti?
8. Chi gestisce le candidature e quale informativa, periodo di conservazione e procedura di cancellazione approvate?
9. A chi saranno intestati hosting, Supabase e fatturazione? Chi riceverà gli avvisi di scadenza e di servizio?
10. Quali budget ricorrenti e tempi di assistenza volete concordare?
11. Quali pagine o servizi del vecchio sito devono continuare a funzionare? Avete dati di traffico e Search Console?
12. Qual è la data auspicata per il lancio e chi sarà disponibile per il collaudo e l’eventuale ripristino?

## Infrastruttura, dominio e passaggio dal vecchio sito

- Richiedere nome del fornitore, piano, scadenze, titolarità e contatto dell’attuale manutentore. Verificare separatamente dominio, DNS, web hosting, email e PEC: possono avere fornitori differenti.
- Il vecchio sito usa un CMS? Ci sono form, database, file scaricabili, aree riservate, sottodomini o integrazioni da conservare?
- È disponibile una copia completa di file, database e configurazione? Chi la produce e verifica?
- L’hosting supporta l’applicazione Next.js con un processo Node gestito, HTTPS, variabili riservate, log e riavvio automatico, oppure offre solo PHP/statico? Questa versione ha funzioni server e non è un semplice sito da caricare via FTP.
- Sono necessari ambienti distinti per anteprima e produzione? Chi deve poter vedere l’anteprima?
- Il dominio definitivo sarà con o senza www? Quali vecchi indirizzi vanno reindirizzati alle nuove pagine?
- Chi esegue il cambio DNS? In quale finestra? Quale controllo confermerà che email, sito e certificato funzionino?
- Qual è il piano di ritorno al sito precedente e per quanto tempo si mantiene il vecchio hosting disponibile?

**Da ricevere:** inventario dei servizi, export DNS, backup verificabile, lista degli URL esistenti, contatto del gestore. Non trasferire il dominio né cancellare il vecchio hosting solo per pubblicare il nuovo sito.

## Contenuti e credibilità di uno studio di ingegneria

- Ragione sociale, P.IVA/C.F., sedi, recapiti, riferimenti societari e LinkedIn sono corretti e aggiornati?
- Quali attività EOS svolge direttamente? Quali con partner? Chi verifica la precisione tecnica delle descrizioni?
- Quali certificazioni, qualifiche e premi si possono documentare? Chi ne controlla validità e uso del marchio?
- Sono confermati i numeri del mockup: 45+ clienti, 125.000 m², 32+ persone, 353 m² di uffici, 60% under 35? A quale data e con quale definizione si riferiscono?
- Chi consegna testi definitivi, biografie e immagini originali? Quali scadenze? Chi autorizza l’uso delle foto del team?
- Si desidera una versione inglese? Quali pagine e chi approva la traduzione tecnica?
- Per ogni progetto: titolo, luogo, anno, stato, committente pubblicabile, ambito dell’incarico EOS, discipline, descrizione, galleria, crediti fotografici e approvatore.
- È possibile pubblicare nomi e loghi dei clienti? Esistono NDA, vincoli di gara, segreti industriali o embargo?
- Foto, planimetrie e modelli BIM mostrano dettagli riservati, persone, impianti sensibili o dati che vanno rimossi?
- Quali progetti vanno in evidenza? Quali etichette devono alimentare i filtri? Chi ne mantiene la coerenza?

**Decisione da verbalizzare:** nessun lorem ipsum, fotografia dimostrativa o dato numerico non approvato nella versione pubblica definitiva. L’animazione EOS rappresenta il processo progettuale: non deve sembrare la dimostrazione di un’opera reale.

## Pannello amministrativo e flusso editoriale

- Quali persone gestiranno progetti, team, posizioni e candidature? Servono permessi diversi per HR ed editori?
- Pubblicazione diretta o bozza con approvazione? La versione attuale pubblica direttamente i contenuti salvati: un flusso di approvazione sarebbe un’estensione.
- Chi concede e revoca gli accessi quando cambia un collaboratore? Sono previsti account personali e autenticazione a più fattori?
- Quali operazioni devono lasciare una traccia? Serve uno storico delle modifiche o un cestino di recupero? Non considerarli inclusi senza implementarli.
- Quanti contenuti e immagini prevedete? Ci sono limiti editoriali, dimensioni o formati concordati?
- Chi effettua la formazione? Chi prepara un progetto campione e conferma di saperlo modificare autonomamente?

**Accessi attuali in locale:** sito `http://127.0.0.1:3001`, accesso `/login`, amministrazione `/admin`. Il pannello richiede un account con ruolo amministratore assegnato sul server. Sul sito pubblicato il dominio sostituirà l’indirizzo locale.

## Candidature, privacy e servizi esterni

- Chi è il referente privacy dello studio e chi approva le informative? C’è un DPO o consulente da coinvolgere?
- Quali dati sono davvero necessari per candidarsi? CV, contatti e posizione sono sufficienti? Evitare richieste superflue o dati particolari.
- Per quanto tempo conservare le candidature, chi può consultarle e come gestire richieste di accesso o cancellazione?
- Come vengono gestite candidature spontanee e candidature ricevute via email? La gestione via email non elimina gli obblighi organizzativi.
- Chi riceve le notifiche? Devono contenere solo un avviso e un collegamento al pannello, evitando CV allegati a più destinatari?
- In quale regione si trovano database e file? Quali fornitori e subfornitori trattano dati? Chi verifica accordi e trasferimenti?
- Serve controllo antimalware dei PDF prima di consentire il download? Chi monitora spam e invii anomali?
- Sono previsti analytics, video incorporati, mappe o pixel pubblicitari? Quali sono necessari e chi approva le scelte privacy?
- Quale procedura seguire in caso di accesso sospetto o esposizione di dati? Chi valuta gli adempimenti e chi comunica all’esterno?

**Stato del progetto:** le candidature dal sito sono disattivate. Prima di attivarle verificare informativa, storage privato, permessi, limitazione invii, gestione allegati e percorso di cancellazione. Le decisioni giuridiche spettano allo studio e al suo consulente: non presentare il codice come certificazione GDPR.

## Manutenzione: proposta da concordare

La manutenzione va distinta dallo sviluppo iniziale. Hosting e database sono servizi continuativi; aggiornamenti applicativi, controllo errori e assistenza sono lavoro continuativo. Indicare nel contratto inclusioni, esclusioni, orari, costo, disdetta e modalità di passaggio a un altro fornitore.

| Attività | Cosa concordare | Evidenza da consegnare |
|---|---|---|
| Monitoraggio | Pagine controllate, frequenza, destinatari, orario di presidio | Avvisi e registro incidenti |
| Aggiornamenti | Frequenza ordinaria, urgenze di sicurezza, prova in anteprima | Versioni, esito controlli, possibilità di ritorno |
| Backup | Database **e** file, frequenza, retention, cifratura, luogo di conservazione | Log backup e prova periodica di ripristino |
| Assistenza | Canale, priorità, tempo di presa in carico, budget ore | Ticket e report sintetico |
| Contenuti | Chi aggiorna testi/progetti, quante modifiche incluse | Richiesta e approvazione |
| Account | Revisione accessi, rinnovi, fatturazione | Inventario proprietari e scadenze |
| Privacy | Cancellazione candidature, aggiornamento informative | Procedura e verifiche del referente |

Non promettere “backup garantito” solo perché il provider dichiara di eseguire copie: controllare cosa include il piano, in particolare i file di Storage, e provare il recupero. Concordare quanta perdita di dati è tollerabile (RPO) e in quanto tempo ripristinare (RTO), senza inventare garanzie.

Esempio di priorità da negoziare: P1 sito o accessi compromessi; P2 funzione principale indisponibile; P3 difetto grafico o aggiornamento contenuti. Il tempo di risposta è diverso dal tempo di risoluzione. Assistenza serale, festiva o 24/7 va contrattualizzata e organizzata, non sottintesa.

## FAQ da usare durante la consegna

**Dobbiamo cambiare hosting?** Solo dopo aver verificato quello attuale. Occorre un ambiente compatibile con le funzioni server del sito; il database Supabase è un servizio distinto.

**Supabase è adatto?** Può esserlo. La sicurezza dipende da permessi delle tabelle e dei file, gestione degli account, configurazione, backup e manutenzione. Il solo collegamento dell’app non prova che queste condizioni siano soddisfatte.

**Il dominio e le email devono cambiare?** Non necessariamente. Si può mantenere il dominio e la posta, modificando solo i record necessari per il web. Prima serve conoscere la configurazione esistente.

**Perché il sito funziona sul computer ma non è online?** L’indirizzo 127.0.0.1 identifica quel computer. Per gli utenti serve una pubblicazione su un hosting sempre attivo, con dominio e HTTPS.

**Chi possiede gli account?** È preferibile che dominio, hosting e servizi siano intestati allo studio, con accessi delegati nominativi al manutentore. Formalizzare anche proprietà e licenze del codice e dei materiali.

**Il sito è sicuro al 100%?** Non è una promessa professionale. Si documentano controlli, rischi residui, responsabilità e procedure di aggiornamento. Una compilazione riuscita o zero avvisi automatici non equivalgono a un penetration test.

**Posso pubblicare un progetto da solo?** Sì, con un account autorizzato e dopo la formazione. Nella versione attuale titolo, descrizione, immagini, etichette e selezione in evidenza sono gestibili; il funzionamento completo richiede lo schema database aggiornato.

**Perché vedo immagini stock o lorem ipsum?** Servono alla revisione del design. Prima del lancio vanno sostituiti con materiali autorizzati e testi approvati, con i crediti richiesti.

**Chi vede i CV?** Solo gli operatori autorizzati, se le policy e lo storage sono configurati e verificati correttamente. Non pubblicare URL permanenti aperti ai documenti.

**Serve un banner cookie?** Dipende dalle tecnologie effettivamente usate. Prima si fa un inventario; poi il referente privacy approva informativa ed eventuale gestione del consenso. Non aggiungere tracker prima di questa decisione.

**È incluso il posizionamento su Google?** Distinguere SEO tecnica iniziale, indicizzazione e attività editoriale continuativa. Non garantire posizioni o traffico.

**Quanto costa ogni anno?** Preparare un prospetto distinto per dominio, hosting, database/storage, eventuale posta e monitoraggio, manutenzione e sviluppo extra. Verificare prezzi e limiti del piano al momento della proposta.

**Cosa succede se smettiamo la manutenzione?** Il sito può continuare a funzionare finché i servizi sono pagati, ma aggiornamenti e incidenti non sono gestiti senza un incarico. Prevedere consegna accessi, codice, documentazione, backup ed esportazione dati.

**Una nuova sezione è manutenzione?** Di norma è sviluppo evolutivo: definire prima costo e tempi. Correzioni di difetti del lavoro consegnato, modifiche contenutistiche e nuove funzioni devono avere regole diverse e scritte.

**Chi approva il lancio?** Un referente nominato dallo studio dopo il collaudo. Conservare l’approvazione della versione e dei contenuti, con una lista esplicita di eventuali eccezioni accettate.

## Checklist per il via libera

- [ ] Proprietari, fatturazione, rinnovi e contatti di emergenza definiti.
- [ ] Collegamento database funzionante; migrazioni applicate e ruoli verificati.
- [ ] Prove con utente anonimo, utente normale e amministratore in ambiente di collaudo.
- [ ] File pubblici e riservati separati; nessuna chiave privilegiata esposta al browser.
- [ ] Test di inserimento/modifica progetti, etichette, evidenza, team e posizioni.
- [ ] Candidature abilitate solo dopo prova completa oppure chiaramente escluse dal lancio.
- [ ] Testi, fotografie, loghi, numeri, crediti e dati societari approvati.
- [ ] Informative completate e tecnologie esterne censite.
- [ ] Controllo mobile, tablet, desktop, tastiera, movimento ridotto e principali browser.
- [ ] Backup di database e file con prova di ripristino; procedura di ritorno al vecchio sito.
- [ ] Reindirizzamenti vecchi URL, metadati, indicizzazione e pagine errore verificati.
- [ ] Formazione amministratori, manuale, verbale collaudo e accordo di manutenzione consegnati.

## Verbale da compilare

| Decisione o materiale | Responsabile EOS | Responsabile tecnico | Scadenza | Approvato / da fare |
|---|---|---|---|---|
| Inventario hosting, DNS e posta | | | | |
| Progetto Supabase e fatturazione | | | | |
| Progetti, etichette e fotografie | | | | |
| Team e numeri dello studio | | | | |
| Informative e gestione candidature | | | | |
| Collaudo e formazione | | | | |
| Manutenzione, backup e assistenza | | | | |
| Pubblicazione e piano di ripristino | | | | |

## Riferimenti tecnici

- Supabase, checklist di produzione: https://supabase.com/docs/guides/deployment/going-into-prod
- Supabase, permessi per riga (RLS): https://supabase.com/docs/guides/database/postgres/row-level-security
- Consultare anche la guida operativa EOS già fornita in PDF per la preparazione estesa all’incontro.
