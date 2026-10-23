# EOS — controllo di sicurezza, 23 ottobre 2026

## Esito

**Correzioni applicate al codice e verifiche locali superate. Il controllo della configurazione cloud resta da completare.** Non sono emerse chiavi segrete nei controlli eseguiti sui file tracciati. Le API anonime rifiutano la lettura delle candidature. Questi risultati non certificano l’intero ambiente Netlify/Supabase e non sostituiscono un penetration test con account di prova.

Sono stati esaminati autenticazione, autorizzazioni delle azioni amministrative, candidature e allegati, upload immagini, redirect, ricerca, intestazioni HTTP, cache, dipendenze, migrazioni RLS e gestione delle chiavi. Non sono stati inviati CV, letti record personali, modificati dati remoti o eseguiti tentativi di sfruttamento delle vulnerabilità del framework.

## Problemi corretti

| Priorità | Riscontro | Intervento |
| --- | --- | --- |
| Alta/critica nelle segnalazioni del fornitore | Next.js 16.3.8 apparteneva agli intervalli interessati da tre avvisi recenti. Il sito usa App Router e Server Actions, interessati dall’avviso DoS. Non sono state trovate funzioni `use cache` con typed array. | Next.js ed eslint-config-next aggiornati e fissati a 16.4.3; sharp installato 0.35.5. Lockfile aggiornato. |
| Alta se esistono vecchie policy permissive | La migrazione candidature non prevedeva un guard restrittivo DELETE per i CV; policies.sql conteneva già una protezione generale, ma potrebbe non essere stato applicato. | Aggiunto `application_documents_delete_guard`, aggiornati SQL iniziale e cumulativi e predisposta migrazione autonoma. **Da eseguire nel cloud; nessuna esposizione/cancellazione remota dimostrata.** |
| Rafforzamento della riservatezza | La protezione della cache delle pagine amministrative dipendeva principalmente dal comportamento dinamico di Next.js. | `/admin/*` e `/login` hanno ora direttive esplicite `private, no-store`, divieti di cache CDN/Netlify e `noindex`. Rendering dinamico esplicito; protezione anche sui redirect di sessione. |
| Rafforzamento delle sessioni | Cookie privi di opzione Secure esplicita in produzione; cookie rinnovati/scaduti persi dal vecchio redirect del proxy. | Configurazione condivisa con Secure in produzione e SameSite=Lax; mantenimento dei cookie aggiornati nei redirect. Il proxy verifica anche il ruolo admin dopo `getUser()`. Restano i controlli in ogni operazione sul server. |
| Rafforzamento della validazione | Credenziali del login convertite con cast, senza controlli di tipo e lunghezza sul server. | Rifiuto di campi binari, input eccessivi, email malformate e byte nulli prima della richiesta di accesso. Messaggio generico, senza confermare l’esistenza di un account. |
| Rafforzamento dei download | Il nome PDF accettava stringhe solo apparentemente simili a UUID. | Percorsi con due soli componenti, cartella uguale alla candidatura e UUID valido per il file PDF. Confermati controllo admin, collegamento al record, scadenza di 60 secondi e download come allegato. |
| Rafforzamento immagini/link | Il caricatore immagini poteva seguire redirect oltre i pattern consentiti. Gli indirizzi email candidati venivano interpolati nel link mailto. | Redirect immagini disabilitati; rifiuto esplicito di SVG/IP locali e query sulle immagini remote. Email codificate nel link per evitare interpretazioni come parametri mailto. |

Gli avvisi sulle dipendenze non dimostrano che il sito sia stato compromesso. La correzione entra in produzione solo con un nuovo deploy che installi questo lockfile.

## Verifiche eseguite

- `npm audit --json` e `npm audit --omit=dev --json`: **zero vulnerabilità note** al momento del controllo, incluse le dipendenze di sviluppo.
- `npm run lint`: superato.
- `node --experimental-strip-types --test tests/*.test.mjs`: **33 test superati**, inclusi campi di accesso manipolati, redirect esterni, autorizzazione tramite metadati modificabili dall’utente, percorsi CV, immagini camuffate e validazione candidature.
- `npm run build`: compilazione di produzione e TypeScript superati con Next.js 16.4.3.
- Migrazione di protezione DELETE verificata in PostgreSQL isolato (PGlite), con una vecchia policy permissiva simulata: anonimi, utenti ordinari e falso ruolo in user_metadata non cancellano i CV; admin e servizio autorizzato mantengono i propri permessi; gli altri bucket conservano il comportamento precedente. Applicazione ripetuta senza errori. Tutte le cancellazioni di prova sono annullate tramite rollback; nessuna operazione sul cloud. Anche le otto query dello script di audit SQL risultano eseguibili nel database isolato.
- Build locale di produzione: Home, Portfolio, Studio, About, Jobs, Contatti e Login rispondono 200. Header anti-framing, nosniff, HSTS e CSP presenti; X-Powered-By assente.
- `/admin`, `/admin/candidature`, `/admin/contenuti/about` e un URL di download CV senza sessione: redirect al login, senza cache condivisa.
- Cookie con JWT falsificato e ruolo admin dichiarato dal client: accesso rifiutato. Non è stato verificato il login di un vero amministratore in assenza di credenziali di prova.
- Invio alla Server Action del login da un’origine esterna: Next.js interrompe l’azione. Il log conferma `Invalid Server Actions request` per mancata corrispondenza dell’origine; la risposta 500 di questo test è il rifiuto del framework.
- Ricerca di pattern di chiavi private, token GitHub, chiavi segrete Supabase e JWT service_role nei file tracciati: nessuna corrispondenza. Ricerca di alcuni pattern anche nella cronologia Git; fra i file ambiente/chiavi risulta tracciato soltanto `.env.example`, privo di valori. Non è una garanzia di rilevamento di ogni possibile formato di segreto.

### Riscontro Supabase, sola lettura

Richieste REST con la chiave pubblica e `limit=0`, senza restituzione di record:

| Oggetto | Risposta anonima | Interpretazione |
| --- | --- | --- |
| applications, inclusi dati di contatto, documenti e application_type | 401 / 42501 | Lettura anonima negata per i campi controllati. `application_type` ora risulta riconosciuto. |
| application_rate_limits | 401 / 42501 | Contatori non leggibili anonimamente. |
| projects, team_members, jobs, site_galleries | 200 | Coerente con contenuti pubblici. Il test non dimostra quali righe siano visibili né l’assenza di permessi di scrittura. |
| Metadati bucket applications-docs / website-images | 400 | Metadati non ottenuti tramite queste credenziali. **Non verifica che il bucket CV sia privato.** |

Nessuna migrazione cloud eseguita. In locale non è configurata la chiave service_role e l’invio candidature è disattivato. Non è stato possibile verificare lo stato delle variabili Netlify né completare upload/download reali, rinnovo cookie con sessione valida o test con account ordinario/admin.

## SQL di sicurezza da applicare

Per chi ha già installato le migrazioni candidature: eseguire [20261023_application_documents_delete_guard.sql](../supabase/migrations/20261023_application_documents_delete_guard.sql) nel SQL Editor del progetto corretto, dopo verifica in staging. Aggiunge soltanto il blocco di cancellazione dei CV per utenti non amministratori, anche in presenza di vecchie policy permissive. Non cancella né legge candidature o file. Gli SQL cumulativi sono stati aggiornati con la stessa protezione. La migrazione non è stata eseguita in remoto durante questo controllo.

## Controlli ancora necessari prima dei CV reali

| Priorità | Attività | Risultato richiesto |
| --- | --- | --- |
| Alta | Eseguire `supabase/security-audit.sql` nel progetto corretto, poi collaudare con visitatore, utente ordinario e amministratore usando dati di prova. | RLS attivo, nessun privilegio anonimo/ordinario sui candidati; nessuna scrittura non amministrativa su contenuti e immagini; jobs chiusi non esposti ai visitatori; galleria modificabile soltanto da admin. Verificare anche API dirette e RPC. |
| Alta | Controllare Storage e permessi RPC. | applications-docs privato, PDF con limite 3 MB; nessun upload anonimo diretto; download solo admin. allow_application_submission eseguibile soltanto da service_role; reorder_team non utilizzabile da utenti ordinari; funzioni SECURITY DEFINER con search_path sicuro. |
| Alta | Verificare il deploy Netlify successivo al push. | Build da questo commit/lockfile, runtime Node supportato, HTTPS e header no-store reali anche su risposte autenticate e rinnovi sessione. Chiave service_role solo nelle variabili server necessarie alle Functions, mai NEXT_PUBLIC o frontend. Proteggere anche le anteprime con dati reali. |
| Alta | Completare la gestione sicura dei candidati. | Informativa definitiva al posto del segnaposto, versione registrata coerente, tempi e procedura di cancellazione di record e file, accessi limitati agli incaricati. L’app non implementa ancora cancellazione automatica dei CV. |
| Alta prima dell’apertura pubblica dei caricamenti | Protezione contro abusi e documenti malevoli. | Integrare scansione antivirus/quarantena e limitazione per IP verificata all’hosting, eventualmente CAPTCHA. Firma PDF e limiti attuali non rilevano malware; il solo limite per email/globale può essere aggirato o saturato. Non usare un header IP arbitrario del client come identità affidabile. |
| Alta operativa | Verificare gli account cloud e il ripristino. | MFA sugli account Netlify/Supabase/GitHub, accessi personali minimi, registrazione pubblica disabilitata se non necessaria, protezioni login e piano di backup/ripristino provato anche per i documenti Storage. L’area admin del sito oggi usa password e ruolo, senza una sfida MFA applicativa. |
| Media | Rafforzare la Content Security Policy. | La CSP attuale blocca framing, oggetti, basi e form esterni; manca una policy completa con nonce per gli script. Nessun punto di inserimento HTML non filtrato è stato trovato, ma la CSP resta una difesa parziale. |
| Media | Definire monitoraggio e manutenzione. | Controllo periodico dipendenze, errori di invio/download e tentativi di accesso; evitare log di CV, credenziali e dati personali non necessari. Stabilire contatti e procedura di rotazione chiavi/risposta agli incidenti. |

Lo script SQL aggiornato è di sola lettura e comprende tutte le tabelle pubbliche, policy, privilegi effettivi anche ereditati da PUBLIC, colonne, funzioni/RPC, ruoli, bucket e trigger. Non modifica autorizzazioni in produzione.

## Note tecniche

- I cookie mantengono la compatibilità con Supabase SSR: non è stato imposto HttpOnly al browser client, che deve poter rinnovare la sessione secondo l’architettura documentata. Il server non si fida del ruolo letto dal cookie: verifica l’utente con Supabase e usa `app_metadata`, non `user_metadata`.
- Le migrazioni presenti impostano RLS, bucket CV privato e controlli amministrativi; la presenza dei file non prova che ogni policy sia già installata nel cloud.
- I PDF hanno nomi casuali e percorsi specifici per candidatura. I link firmati sono temporanei ma chi li possiede può usarli finché sono validi: non condividerli nei log o in pagine pubbliche.
- La mappa Google viene caricata automaticamente, come richiesto. L’informativa definitiva deve descrivere correttamente il collegamento al servizio; il comportamento non è più quello del vecchio pulsante di attivazione.
- Il limite totale degli allegati resta 4 MB per compatibilità Netlify, oltre al limite individuale di 3 MB. Nessun aumento dei limiti di upload è stato introdotto durante questo controllo.

## Fonti consultate

- [Next.js — avviso ottimizzazione immagini, correzione da 16.4.1 / sharp 0.35.5](https://github.com/advisories/GHSA-2464-fhr4-w9xw).
- [Next.js — DoS tramite Server Actions, correzione da 16.4.1](https://github.com/advisories/GHSA-p3m5-59mp-jv5r).
- [Next.js — use cache e typed array, correzione da 16.4.1](https://github.com/advisories/GHSA-673q-mjm6-r5xr).
- [Supabase — sessioni SSR, cookie e rischi della cache CDN](https://supabase.com/docs/guides/auth/server-side/advanced-guide).
- [Supabase — preparazione della produzione](https://supabase.com/docs/guides/deployment/going-into-prod).
- [Supabase — limiti di autenticazione](https://supabase.com/docs/guides/auth/rate-limits).
- [PostgreSQL — combinazione di policy permissive e restrittive](https://www.postgresql.org/docs/current/ddl-rowsecurity.html).
