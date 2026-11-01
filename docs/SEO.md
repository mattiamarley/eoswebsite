# SEO e anteprime social EOS

## Risorse attive

- `/sitemap.xml`: XML generato da Next.js con le sei pagine principali: Home, About, Portfolio, Ufficio (`/studio`), Jobs e Contatti.
- `/robots.txt`: consente l’esplorazione del sito pubblico, esclude admin/login e indica la sitemap.
- Metadati delle pagine: titolo e descrizione specifici, canonical, Open Graph e Twitter Card di tipo `summary_large_image`.
- Immagine social: `/images/eos-social-v2.png`, PNG da 1200×630 px. La grafica riprende la scritta eos con profondità e linee di costruzione della landing. Il sorgente modificabile è `public/images/eos-social-v2.svg`.

Non vengono inventate pagine dei singoli progetti o delle posizioni: al momento si aprono in finestre modali, non hanno URL di pagina dedicati nella sitemap. Le informative ancora provvisorie sono escluse dalla sitemap e marcate `noindex`; quando verranno pubblicati i testi definitivi, aggiornare descrizione e `index` in `src/lib/site-seo.ts`.

## Dominio e ambienti

Il dominio predefinito è `https://eoswebsite.vercel.app`: per questo dominio non serve aggiungere variabili. La variabile server facoltativa `SITE_URL` permette di sostituirlo con il dominio HTTPS definitivo, senza percorsi o parametri, per esempio `https://dominio-approvato.it`.

Impostare `SITE_URL` nell’ambiente Production dell’hosting quando viene collegato il dominio definitivo e avviare un nuovo deploy. Canonical, sitemap e URL dell’immagine social useranno automaticamente quel dominio. Anche i deploy Preview usano il dominio canonico di produzione: non usare l’URL temporaneo di ogni build come dominio canonico.

Nei deploy Vercel con `VERCEL_ENV=preview`, robots disabilita l’esplorazione e i metadati dichiarano `noindex`. `VERCEL_ENV` è fornita da Vercel. Le restrizioni delle pagine admin e login rimangono anche negli header HTTP già configurati.

## Collaudo eseguito

Verificata la build di produzione locale, con richieste HTTP e user agent `facebookexternalhit/1.1`:

- robots.txt: status 200 e Content-Type `text/plain`, con regole e riferimento alla sitemap.
- sitemap.xml: status 200, Content-Type XML e documento valido contenente esattamente i sei URL pubblici previsti.
- Sei pagine: canonical, Open Graph, immagine e Twitter Card nel `<head>` consegnato al crawler; sei descrizioni distinte.
- Immagine social: status 200, Content-Type `image/png`, dimensioni 1200×630.
- Informative provvisorie: `noindex` presente.
- Area protetta: `/admin/contenuti/progetti` reindirizza con status 307 a `/login?redirectTo=%2Fadmin%2Fcontenuti%2Fprogetti`.
- Lint e build di produzione superati.

Le piattaforme di condivisione possono conservare una vecchia anteprima in cache. Dopo un cambio dell’immagine usare un nuovo nome versione e aggiornare `SOCIAL_IMAGE` in `src/lib/site-seo.ts`.
