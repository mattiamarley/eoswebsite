# Candidature — attivazione e collaudo

## Percorso implementato

- Da ogni posizione aperta: nome, cognome, email e CV PDF obbligatori; telefono, presentazione e portfolio facoltativi.
- I dati, la posizione (ID e titolo al momento dell’invio) e i documenti sono salvati in una singola candidatura. Il primo documento è sempre il CV.
- PDF fino a 3 MB ciascuno, al massimo due e 4 MB complessivi per compatibilità Netlify; firma PDF verificata sul server. La firma non sostituisce un controllo antivirus.
- Upload in bucket privato, URL non pubblici. I download passano sempre dal controllo amministratore e generano link di 60 secondi.
- Hub amministrativo: ricerca per nome/email, filtri posizione/nuove/preferite, paginazione di 25, contatti, presentazione, documenti e stato. Errori di caricamento e salvataggio visibili.
- Le posizioni con candidature non vengono eliminate dal pannello: si chiudono conservando lo storico.
- Invio limitato a 3 tentativi per email in 24 ore e 50 complessivi per ora, con contatori atomici su database e honeypot. È una protezione di base, non un sistema completo contro attacchi distribuiti.

## Configurazione necessaria

1. Applicare `supabase/migrations/20261023_applications_intake.sql` nell’SQL Editor del progetto Supabase corretto. Conserva i record esistenti e aggiunge i nuovi campi, bucket privato, autorizzazioni e contatori.
2. Configurare sul server di hosting `SUPABASE_SERVICE_ROLE_KEY` (chiave segreta del progetto, mai con prefisso NEXT_PUBLIC, mai nel repository). Non inviarla in chat. URL pubblico e chiave anonima restano quelli già configurati.
3. Completare l’informativa sul trattamento delle candidature nella pagina `/privacy-policy`, indicando titolare, finalità, base giuridica, durata, fornitori e diritti con lo studio. Il sito contiene tuttora un segnaposto: non presentarlo come informativa definitiva. Aggiornare `privacy_version` quando cambia il testo pubblicato.
4. Solo dopo collaudo e informativa definitiva, impostare `APPLICATIONS_ENABLED=true` e ridistribuire il sito. Fino ad allora rimane il contatto email.

## Collaudo prima dell’apertura

- Usare dati e PDF di prova, non CV reali. Controllare candidato, email, posizione, CV e portfolio nella stessa scheda; scaricare entrambi dopo oltre cinque minuti dalla visita all’hub.
- Controllare nome/cognome mancanti, email non valida, CV assente, formato diverso e file oltre 3 MB. Nessuna riga deve essere creata.
- Chiudere una posizione prima di inviare: l’invio deve essere rifiutato.
- Visitare hub e URL documento senza login e con account senza ruolo amministratore: accesso negato.
- Provare ricerca, filtri, preferiti e modifica stato; chiudere una posizione mantenendo consultabili le candidature.
- Definire una procedura di cancellazione per scadenza del periodo di conservazione e richieste degli interessati: questa modifica non introduce cancellazione automatica.

## Limiti della verifica locale

Lint, compilazione TypeScript/produzione e test di validazione/documenti eseguiti. Non disponibili chiave server né sessione amministrativa Supabase: migrazione e upload/download reali non collaudati sul progetto remoto. Nessun dato personale reale inviato e nessuna policy remota modificata.

## RAL e livello

`docs/SUPABASE-CANDIDATURE-E-RAL.sql` riunisce le migrazioni candidature e retribuzione in una sola transazione, eseguibile anche dopo la precedente migrazione candidature. In alternativa applicare solo `supabase/migrations/20261023_job_compensation.sql` se quella candidature è già installata.

Backend → Contenuti → Lavoro: livello facoltativo, RAL annua in euro e massimo facoltativo per una fascia. Gli importi sono numeri interi positivi; un unico importo viene presentato come RAL fissa. I dati esistenti non ricevono valori dimostrativi. Le nuove schede blu e i dettagli mostrano gli stessi dati.
