# Rassegna del sito EOS — 1 novembre 2026

## Interventi completati in questa passata

- Aura bianca permanente sul logo chiuso, sia desktop sia mobile; intensità maggiore quando la navigazione desktop è estesa. La pulsazione resta attiva sul logo chiuso, nello stesso blu del logo, insieme all’aura bianca fissa, rispettando la preferenza di movimento ridotto. Alla prima apertura della sessione, la navbar desktop resta estesa per 6 secondi prima di richiudersi.
- Apertura del menu mobile al contatto del dito o della penna, mantenendo il click per mouse e tastiera. Il tasto non avvia un gesto di scorrimento.
- Pagina bloccata con posizione fissa mentre il menu mobile è aperto, per interrompere anche lo scorrimento inerziale. Alla chiusura vengono ripristinati gli stili precedenti e la posizione di lettura senza scorrimento animato.
- Intestazioni Milano, Roma e Trieste allineate alla riga finale «ambiente e sicurezza» su desktop. La griglia condivide le righe tra azienda e sedi: non usa uno spostamento fisso che si romperebbe al variare delle righe del testo.
- Responsive di About e Ufficio: titoli lunghi del carosello fino a tre righe sul mobile, font fluido 20–24 px, descrizione 13 px fino a quattro righe e più spazio verticale per la foto. Il titolo lungo presente nel CMS ora è interamente leggibile nel formato stretto verificato.
- Testo conclusivo con larghezza vincolata, sottotitolo adattivo e righe bilanciate. Sul mobile il paragrafo è allineato a sinistra anziché giustificato.

Non sono stati cambiati i contenuti Supabase, le offerte di lavoro, le persone, le impostazioni Vercel o le informative. I punti sotto restano da affrontare uno alla volta.

## Ambito e risultati delle verifiche

Sono state controllate Home, About, Portfolio, Ufficio, Jobs e Contatti in quattro larghezze CSS effettivamente misurate nel browser: 344, 419, 826 e 1376 px. Il browser di prova presenta una differenza tra la dimensione richiesta alla finestra e quella del viewport CSS: qui sono riportati i valori misurati, non un’emulazione dichiarata di un particolare iPhone.

Controllati inoltre accesso admin senza sessione, login, Privacy policy, Cookie policy, scheda progetto, scheda team, candidatura per posizione e candidatura spontanea. Le pagine che leggono il CMS sono state verificate anche dopo il caricamento dei dati.

| Area | Risultato |
| --- | --- |
| Overflow orizzontale delle sei pagine principali | Non rilevato nelle quattro larghezze provate |
| Titolo lungo del carosello About | Altezza visibile e altezza del testo coincidono nel formato stretto: non più troncato |
| Chiusura del menu dopo lo scroll | Posizione ripristinata: 975,806 px prima e dopo la prova |
| Footer desktop | Testo «ambiente e sicurezza» e tre città alla stessa coordinata verticale misurata |
| Schede progetto e team | Apertura e chiusura riuscite; nessun overflow orizzontale rilevato nella finestra stretta |
| Tre mappe | Milano, Roma e Trieste caricate; affiancate su desktop e impilate sul mobile |
| Accesso anonimo al backend | Reindirizzamento al login: contenuti riservati non mostrati |
| Lint, build di produzione e test esistenti | Superati; 36 test su 36 |

### Limiti del collaudo

- L’apertura e chiusura del menu dopo uno scroll sono state provate in un viewport mobile del browser. L’inerzia di Safari su un iPhone fisico resta da ricontrollare sul dispositivo: non viene dichiarata una prova hardware che non è stata eseguita.
- Il pannello admin autenticato è stato esaminato nel codice; non era disponibile una sessione amministrativa per collaudare ogni editor dall’interfaccia.
- Il modulo pubblico su Vercel è attivo. Nell’ambiente locale l’intake è disattivato: le relative CTA mostrano il messaggio di attivazione. Questa differenza di configurazione non è stata modificata.
- Nessun CV caricato, nessuna candidatura creata e nessun dato reale di candidati consultato. Rimane da fare il collaudo completo di invio, associazione alla posizione, consultazione e download nell’admin con dati di prova concordati.
- Questa è una rassegna funzionale, visiva e del codice coinvolto, non un penetration test né una verifica delle impostazioni private dei servizi cloud.

## Anomalie e punti da affrontare, non modificati

### 1. Informative provvisorie con candidatura pubblica attiva — priorità alta

**Confermato anche su Vercel.** Il modulo contiene la presa visione dell’informativa e permette di selezionare il curriculum, ma il collegamento porta a una pagina con «Informativa in preparazione». Anche Cookie policy è ancora un testo provvisorio.

Evidenze: [privacy pubblica](https://eoswebsite.vercel.app/privacy-policy), [Jobs pubblica](https://eoswebsite.vercel.app/jobs), `src/app/(site)/[section]/page.tsx`, `src/components/site/ApplicationForm.tsx`.

**Intervento proposto:** ricevere i testi definitivi approvati dall’azienda e sostituire le pagine provvisorie; collegare e versionare correttamente l’informativa candidature. L’attivazione del form non è stata alterata durante la rassegna.

### 2. Testi segnaposto e dettagli dei servizi non specifici — priorità alta

Home, About, Ufficio, Portfolio e Jobs/Contatti contengono ancora Lorem ipsum. Le schede delle competenze aprono dettagli che, senza una descrizione dedicata, ripiegano sullo stesso testo generico.

Evidenze: `src/lib/site-content.ts`, `src/components/site/AboutLayout.tsx`, `src/components/site/StudioLayout.tsx`, `src/components/site/PortfolioLayout.tsx`, `src/components/site/Cards.tsx`.

**Intervento proposto:** definire testi reali per ogni sezione e ogni competenza, con revisione dell’azienda; decidere quali contenuti rendere modificabili dal backend.

### 3. Contenuti di prova e refusi nel CMS pubblico — priorità alta

Nelle pagine pubbliche sono presenti biografie/ruoli chiaramente provvisori e il titolo «Beckend Developer». Le didascalie usano inoltre grafie non uniformi come «Sansiro» e «San Siro». Questi contenuti provengono dal CMS, quindi una modifica al layout non li corregge in modo definitivo.

**Intervento proposto:** rivedere le schede team, le offerte, le descrizioni dei progetti e le didascalie nel backend; rimuovere le prove e uniformare i nomi. Nessun record è stato modificato durante questo controllo.

### 4. Dati aziendali e certificazioni inseriti nel codice — da confermare con l’azienda

I valori come 30 anni, 140 progetti, 9 certificazioni ISO, 32 collaboratori, 353 m², 60% under 35, 45 clienti e 125.000 m² sono definiti nei componenti. Non è possibile dedurre dalla sola implementazione se siano aggiornati o approvati. Non vengono classificati come falsi: serve conferma dell’azienda.

Evidenze: `AboutLayout.tsx`, `StudioLayout.tsx`, `PortfolioLayout.tsx`.

**Intervento proposto:** ricevere l’elenco approvato dei numeri e delle certificazioni, correggere eventuali dati e valutare la loro gestione dal CMS.

### 5. Carosello in evidenza quando non ci sono stelle — priorità media

**Confermato dal codice, senza cambiare le stelle nel database.** Se nessun progetto ha `is_featured=true`, il componente usa comunque i primi progetti disponibili. Quindi togliere l’ultima stella non fa necessariamente sparire la sezione «in evidenza».

Evidenza: selezione `featured`, `mock` e `slides` in `src/components/site/FeaturedProjects.tsx`.

**Intervento proposto:** stabilire se senza stelle il carosello debba essere nascosto oppure diventare una sezione esplicitamente chiamata «Progetti recenti».

### 6. Risorse SEO e anteprime di condivisione incomplete — priorità media

**Verificato sul sito pubblico.** `/robots.txt` e `/sitemap.xml` rispondono con status 200, ma il contenuto è HTML con titolo «Pagina non trovata | EOS»: non sono un robots.txt e una sitemap validi. Nel codice mancano inoltre canonical, descrizioni specifiche delle singole pagine e metadati/immagini Open Graph per le condivisioni.

Evidenze: richieste GET alle due risorse pubbliche; `src/app/layout.tsx`, `generateMetadata` nella pagina di sezione e assenza dei file metadata corrispondenti.

**Intervento proposto:** scegliere il dominio definitivo, aggiungere le risorse corrette e completare i metadati per le pagine; definire anche l’indicizzazione di login e area riservata.

### 7. Dopo il login si perde la pagina admin richiesta — priorità medio-bassa

Aprendo senza sessione `/admin/contenuti/progetti`, si arriva a `/login` senza un parametro che conservi la destinazione. Il login supporta già `redirectTo`, ma `requireAdmin()` non lo trasmette; il risultato predefinito è la dashboard.

Evidenze: prova di navigazione anonima; `src/utils/supabase/admin.ts`, `src/app/login/page.tsx`.

**Intervento proposto:** conservare la destinazione interna in modo validato, per tornare all’editor richiesto dopo l’accesso.

### 8. Pulsante «torna su» sopra i contenuti mobile — rifinitura da decidere

Essendo fisso sopra la pagina, il pulsante può sovrapporsi a un testo durante lo scorrimento, come nello screenshot fornito. Non è stato eliminato o spostato automaticamente perché è un comportamento di navigazione già richiesto.

**Intervento proposto:** valutare un ingombro minore sul mobile oppure una visibilità legata alla direzione dello scroll, mantenendo un comando accessibile.

## Ordine suggerito

1. Informative definitive e controllo del flusso candidature.
2. Pulizia dei dati di prova e sostituzione dei segnaposto, con conferma dei numeri aziendali.
3. Regola dei progetti in evidenza.
4. SEO e navigazione dopo il login.
5. Rifinitura del pulsante mobile «torna su».

Questa lista è un elenco di lavoro da valutare punto per punto. Le relative correzioni non sono incluse automaticamente nella modifica di aura, menu, footer e responsive.
