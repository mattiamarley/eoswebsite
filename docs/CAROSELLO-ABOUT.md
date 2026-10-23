# Carosello About

Percorso: **Backend → Contenuti → Carosello About** (`/admin/contenuti/about`).

- Fino a 8 fotografie dedicate, separate dalle foto dei progetti.
- Caricamento JPEG, PNG o WebP con ottimizzazione e anteprima.
- Testo alternativo obbligatorio, modificabile per ogni foto.
- Trascinamento e frecce per l’ordine; rimozione dalla bozza; annullamento.
- “Salva carosello” pubblica la selezione e aggiorna About. Salvando vuoto, il carosello viene nascosto. Finché non viene salvato, resta la selezione automatica precedente.
- Se un altro amministratore salva prima, il controllo di revisione impedisce di sovrascriverlo: ricaricare prima di proseguire.
- 3 MB per nuova foto e 4 MB complessivi per richiesta, per compatibilità Netlify. Per molte fotografie grandi, aggiungerne alcune, salvare, poi aggiungere le altre.

## Attivazione

Eseguire `supabase/migrations/20261023_about_gallery.sql` nell’SQL Editor Supabase. In alternativa il file `docs/SUPABASE-AGGIORNAMENTO-COMPLETO.sql` include anche le migrazioni candidature, RAL e spontanee.

La tabella `site_galleries` contiene soltanto immagini pubbliche, testo alternativo e revisione; soltanto gli amministratori possono modificarla. Le immagini sono nello Storage pubblico già usato dal sito, sotto `website-images/about/`. La rimozione può ripulire esclusivamente file di quella cartella appartenenti alla selezione salvata: nessuna foto di team o portfolio viene eliminata.

Migrazione e operazioni autenticate non eseguite sul database remoto: mancano le credenziali amministrative. Compilazione e validazione sono verificate localmente.

## Verifiche

Build di produzione e TypeScript superati; lint e 26 test superati (validazione della galleria, proprietà delle immagini, limiti upload e distinzione delle candidature spontanee inclusi). L’accesso anonimo alla nuova route amministrativa reindirizza al login. Le prove non sostituiscono un collaudo autenticato del salvataggio su Supabase dopo la migrazione.
