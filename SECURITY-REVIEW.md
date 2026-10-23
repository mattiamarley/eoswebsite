> Aggiornamento 23 ottobre 2026: vedere il [controllo di sicurezza corrente](docs/VERIFICA-SICUREZZA-2026-10-23.md). Le verifiche seguenti sono storiche e non descrivono necessariamente lo stato attuale.

> Aggiornamento 21 ottobre 2026: vedere [verifica corrente](docs/VERIFICA-2026-10-21.md). Il testo seguente documenta il controllo precedente.

# Verifica EOS — 3 ottobre 2026

Esito: versione di sviluppo migliorata, non ancora approvata per pubblicazione con dati reali. Questa verifica non è un penetration test né una certificazione di conformità.

## Verificato e corretto
- Next.js aggiornato da 16.2.9 a 16.3.8 con lockfile aggiornato. npm audit --omit=dev: zero vulnerabilità note dopo l'aggiornamento. Restano cinque segnalazioni alte nella catena di sviluppo ESLint/fast-glob/micromatch/braces; npm propone un downgrade incompatibile, non applicato. Non usare input di lint non fidati; ricontrollare prima del rilascio.
- Tutte le azioni amministrative esaminate richiedono autenticazione e app_metadata.role=admin sul server. user_metadata non concede privilegi. Redirect login limitato alle rotte admin.
- Nessun file .env tracciato da Git. Service role assente nell'ambiente locale e raccolta candidature disattivata.
- Candidature: limite dimensione/numero PDF, controllo intestazione, nomi casuali, link firmati brevi. La verifica di intestazione non sostituisce la scansione antimalware.
- Immagini: controllo intestazione JPEG/PNG/WebP oltre al MIME e ai 5 MB. Pulizia immagini limitata all'origine Supabase configurata, con rifiuto di percorsi ambigui.
- Google Maps carica solo dopo il pulsante dell'utente; l'embed non contatta Google all'apertura della pagina.
- Intestazioni anti-framing e nosniff presenti, HSTS aggiunto per la produzione, X-Powered-By disabilitato. CSP parziale: non equivale a una policy completa contro XSS.
- Supabase raggiungibile. projects.tags assente; lettura pubblica compatibile con lo schema precedente. Salvataggio etichette resta subordinato alla migrazione.

## Bloccanti prima della pubblicazione
1. Eseguire supabase/security-audit.sql (sola lettura), verificare RLS/grant e bucket CV privato. Il probe anonimo limit=0 sulle candidature restituisce 200 e nessun record: non dimostra né una fuga di dati né la sicurezza delle policy. Non sono stati scaricati CV o dati dei candidati. Nessuna migrazione cloud eseguita.
2. Provisionare il ruolo amministratore e verificare supabase/policies.sql in staging; testare visitatore, utente ordinario e admin. Verificare anche scritture dirette API, non soltanto le pagine protette. Usare account e record di test, senza cancellare dati reali.
3. Applicare supabase/migrations/20261001_project_tags.sql; verificare creazione/modifica progetti e filtri.
4. Verificare MFA, signup, rate limit login, backup con prova di ripristino, regione dati e accordi con i fornitori. Non sono verificabili dalle sole chiavi pubbliche disponibili.
5. Completare le informative privacy/cookie e candidature con il titolare: finalità, base giuridica, destinatari, tempi di conservazione, diritti e contatti. I testi attuali sono placeholder. Definire cancellazione CV, scansione documenti e limiti per IP all'hosting prima di attivare APPLICATIONS_ENABLED.
6. Confermare dati societari, sedi e contatti; numeri 32+, 353 m², 60%, 45+, 125.000 m² sono copiati dal design, non validati. Confermare autorizzazione all'uso di foto, loghi clienti, nomi e progetti; eliminare dati di test e lorem ipsum prima del lancio. La foto Studio deriva dal riferimento grafico fornito, non è stata verificata come foto dello studio reale.
7. Pubblicare solo su HTTPS con ambiente di produzione; non esporre il server di sviluppo. Verificare dominio definitivo, indicizzazione, monitoraggio errori e test mobile/tastiera/contrasto sul sito distribuito.

Riferimenti: https://supabase.com/docs/guides/deployment/going-into-prod ; https://www.garanteprivacy.it/faq/cookie

## Esito verifiche locali finali
- Lint superato; 11 test superati; build di produzione e TypeScript superati su Next.js 16.3.8.
- Portfolio e Contatti HTTP 200 in produzione locale; Portfolio legge i progetti reali senza errore tags.
- /admin e /admin/candidature senza sessione: redirect 307 al login.
- HSTS e X-Frame-Options presenti; HTML Contatti privo di iframe prima dell'attivazione.
- Anteprima sulla porta 3001 ora esegue la build di produzione: per ulteriori modifiche ripristinare npm run dev, evitando build simultanee.
