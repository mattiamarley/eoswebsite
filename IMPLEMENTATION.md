# EOS — stato della nuova versione

## Interfaccia
- Home: blueprint SVG originale, costruzione a scroll in tre fasi, nessun motivo del punto.
- Palette navy/lavanda, Inter, glass, pagine About, Portfolio, Studio, Lavoro e Contatti.
- Schede native dialog: sfondo sfocato, focus contenuto, Escape, ritorno browser, link diretto tramite hash.
- Menu mobile e breakpoint per telefono/tablet/desktop. Preferenza movimento ridotto rispettata.
- I testi descrittivi pubblici sono temporaneamente lorem ipsum, come richiesto. Il database conserva i testi originali.

## Collegamento al CMS esistente
Il CMS resta in `/admin`. Portfolio legge `projects`, Studio legge `team_members`, Lavoro legge solo `jobs.is_open = true`. Le modifiche CMS invalidano anche le pagine pubbliche. I progetti non hanno uno stato bozza nello schema esistente: tutti sono considerati pubblicabili, così come tutti i membri del team.

Il progetto Supabase è nuovamente raggiungibile (verificato il 3 ottobre 2026). Vedere SECURITY-REVIEW.md per lo stato aggiornato dei controlli. Non sono stati modificati dati, utenti o permessi cloud. In sviluppo, se il database non è raggiungibile, solo il portfolio mostra schede illustrative esplicitamente indicate; in produzione viene mostrato lo stato di indisponibilità. Nessuna offerta o persona fittizia viene pubblicata come dato reale.

## Attivazione sicura
1. Ripristinare/verificare URL e chiave pubblica del progetto Supabase nelle variabili d'ambiente.
2. Prima di aggiornare l'app in produzione, assegnare agli amministratori autorizzati `app_metadata.role = "admin"` tramite dashboard/API amministrativa Supabase. Non usare `user_metadata`. Senza questo ruolo l'accesso è negato, anche agli account precedentemente autenticati.
3. Applicare e verificare `supabase/policies.sql` prima in staging. Include RLS, guardie restrittive contro vecchie policy permissive, bucket immagini pubblico e documenti candidature privato. La migrazione NON è stata eseguita sul database remoto.
4. Verificare permessi con visitatore, utente ordinario e amministratore: solo admin può leggere candidature, firmare documenti o modificare contenuti. Il visitatore può leggere i progetti/team e solo le offerte aperte. Le regole SQL non hanno ancora una verifica contro un database disponibile.
5. Completare l'informativa privacy/cookie e definire tempi di conservazione delle candidature, MFA degli amministratori, restrizioni signup, backup e limitazione richieste al servizio di hosting.
6. Aggiungere `SUPABASE_SERVICE_ROLE_KEY` solo nell'ambiente server. La chiave non è mai esposta al client. Impostare `APPLICATIONS_ENABLED=true` solo dopo la verifica di informativa, bucket privato, regole e invio in staging.
7. Il form invia fino a 2 PDF da 3 MB; verifica tipo, dimensioni e intestazione, usa nomi casuali e registra percorsi privati. L'amministrazione genera URL firmati validi 5 minuti; per rinnovarli ricaricare la pagina. Il controllo PDF non è una scansione antimalware.
8. Il limite atomico di invio (3 per email/24 ore, 50 complessive/ora) è nel database. Aggiungere al servizio di hosting un limite per IP e, se necessario, protezione anti-bot prima dell'apertura pubblica. Il limite per email da solo non impedisce attacchi distribuiti.

## Verifica locale
`npm run dev -- --hostname 127.0.0.1 --port 3001`
`npm run lint`
`npm run build`

Il nuovo controllo di ruolo si applica a ogni pagina/azione amministrativa oltre che al layout; il redirect del login è limitato alle rotte admin. Intestazioni anti-framing, nosniff, policy permessi e CSP di base sono aggiunte. La CSP non è ancora una policy completa con nonce sugli script. Non considerare la versione pronta per produzione senza le verifiche del database e del flusso candidature sopra.

## Risultati verificati
- Compilazione di produzione completata; lint e TypeScript senza errori.
- Cinque test locali superati: redirect interni, blocco redirect esterni/ambigui, rifiuto utenti non admin, impossibilità di elevare privilegi con user_metadata, ruolo admin valido.
- Pagine pubbliche e login rispondono HTTP 200; rotte admin senza sessione rispondono 307 verso login; intestazioni di sicurezza presenti.
- Controllo visivo a 1440×960, 820×1180, 390×844 e 320×740. Nessun overflow orizzontale nei layout verificati.
- Verificati filtro portfolio, apertura dettaglio, Escape, ritorno browser e ripristino focus sul pulsante originale.
- Non verificabili senza Supabase funzionante: login admin reale, CRUD, invio candidature, permessi RLS e accesso ai documenti privati. Nessuna migrazione remota applicata.


## Etichette progetti — 1 ottobre 2026
Selezione multipla condivisa fra modulo admin, azioni server e filtri pubblici. Le etichette ammesse sono in `src/lib/project-tags.ts`; modificandole va aggiornata anche la constraint SQL. Le card mostrano la prima etichetta e il numero delle ulteriori; il dettaglio le mostra tutte. Senza etichette il progetto resta in Tutti. Il salvataggio invalida homepage e portfolio.

Applicare `supabase/migrations/20261001_project_tags.sql` prima di distribuire questa versione. Aggiunge `projects.tags` con default vuoto, senza alterare progetti o immagini e senza cambiare RLS. La migrazione non è stata applicata: il database risponde ma projects.tags è ancora assente. Nessuna verifica end-to-end del salvataggio remoto eseguita. Controlli locali: lint, TypeScript e quattro test sulle etichette superati.

## Carosello progetti in evidenza — 3 ottobre
FeaturedProjects mostra i progetti con is_featured=true; in assenza mostra tre concept stock esplicitamente etichettati come mockup. Autoplay 5,5 secondi, pausa su hover/focus/dialog, scheda nascosta e preferenza movimento ridotto; frecce e selettori manuali. Checkbox admin In evidenza aggiunta alle azioni create/update e lettura. Applicare prima la migrazione etichette, poi supabase/migrations/20261003_featured_projects.sql. Nessuna modifica remota eseguita. Foto e fonti in public/images/FEATURED-STOCK-SOURCES.md. Rimuovere mockup prima del rilascio.
