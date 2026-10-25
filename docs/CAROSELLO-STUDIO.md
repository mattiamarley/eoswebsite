# Caroselli Studio e About

I caroselli pubblici cambiano foto ogni 5 secondi senza pulsanti o indicatori. Restano lo swipe e la navigazione con tastiera. L’avanzamento si interrompe con scheda nascosta, carosello fuori schermo, apertura del dettaglio progetto o preferenza di sistema per movimento ridotto.

## Attivazione Studio

Eseguire `supabase/migrations/20261025_studio_gallery.sql` nel SQL Editor del progetto Supabase configurato. È riapplicabile, mantiene le foto About e aggiunge la selezione Studio. Aggiorna i permessi admin delle due cartelle mantenendole distinte. Il push su GitHub non esegue questa migrazione; non è stata applicata al cloud in questa sessione.

Nel backend: Contenuti → Carosello Studio (`/admin/contenuti/studio`). Aggiungere fino a 8 foto, compilare il testo alternativo, riordinare e premere Salva carosello. La pagina Studio legge soltanto questa selezione. Finché non si salva, mantiene la foto iniziale; per vedere l’alternanza occorrono almeno due foto. Il salvataggio esplicito senza foto nasconde il carosello.

Stesse protezioni di About: controlli amministrativi sul server e database, convalida firma immagini, isolamento delle cartelle, limite 3 MB/foto e 4 MB complessivi per richiesta, revisione contro salvataggi concorrenti. Upload e download remoti richiedono una sessione amministrativa per il collaudo; nessuna foto cloud è stata modificata durante l’implementazione.
