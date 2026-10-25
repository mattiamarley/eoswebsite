# Caroselli Studio e About

I caroselli About e Studio cambiano foto ogni 5 secondi senza pulsanti di navigazione, con una piccola barra glass stondata blu e lilla che indica il tempo al cambio foto. I caroselli dei progetti (Home, Portfolio e dettagli) conservano i comandi di navigazione e il cambio automatico ogni 5 secondi. Restano lo swipe e la navigazione con tastiera. L’avanzamento si interrompe con scheda nascosta, carosello fuori schermo, apertura del dettaglio progetto o preferenza di sistema per movimento ridotto.

## Attivazione Studio

Eseguire `supabase/migrations/20261025_studio_gallery.sql` nel SQL Editor del progetto Supabase configurato. È riapplicabile, mantiene le foto About e aggiunge la selezione Studio. Aggiorna i permessi admin delle due cartelle mantenendole distinte. Il push su GitHub non esegue questa migrazione; non è stata applicata al cloud in questa sessione.

Nel backend: Contenuti → Modifica caroselli (`/admin/contenuti/caroselli`), area Studio. Aggiungere fino a 8 foto, compilare il testo alternativo, riordinare e premere Salva carosello. About e Studio sono gestibili nella stessa pagina, con due editor e salvataggi indipendenti. I vecchi collegamenti di gestione reindirizzano alla sezione corrispondente. La pagina Studio legge soltanto questa selezione. Finché non si salva, mantiene la foto iniziale; per vedere l’alternanza occorrono almeno due foto. Il salvataggio esplicito senza foto nasconde il carosello.

Stesse protezioni di About: controlli amministrativi sul server e database, convalida firma immagini, isolamento delle cartelle, limite 3 MB/foto e 4 MB complessivi per richiesta, revisione contro salvataggi concorrenti. Upload e download remoti richiedono una sessione amministrativa per il collaudo; nessuna foto cloud è stata modificata durante l’implementazione.

La barra usa lo stesso timer di avanzamento: dura 5 secondi, riparte al cambio manuale e si interrompe insieme al carosello quando non è visibile. Viene mostrata soltanto con almeno due foto e rispetta la preferenza di movimento ridotto. È presente anche nei caroselli dei progetti, mantenendo i loro comandi.
