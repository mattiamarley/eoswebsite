# Variante 01 — edificio blueprint
Salvata il 29 settembre 2026 prima della variante con la scritta EOS isometrica.

- Hero.tsx.snapshot: componente originale della landing con edificio a tre fasi.
- Blueprint.tsx.snapshot: geometria SVG dell'edificio.
- globals.css.snapshot: stili completi al momento del salvataggio, incluso liquid glass.

Per tornare all'edificio, copiare Hero.tsx.snapshot in src/components/Hero.tsx. Il componente src/components/site/Blueprint.tsx resta disponibile e invariato, poiché viene usato anche nel portfolio. Se necessario ripristinarlo dalla sua snapshot.
La variante EOS usa classi aggiuntive dedicate: ripristinando il vecchio Hero, queste diventano inattive. Non sostituire l'intero globals.css: così si conservano le modifiche successive al resto del sito.
