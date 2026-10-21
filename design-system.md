# Design System — Guida per Claude Code

Fonte di verità per lo stile del progetto. Da referenziare in `CLAUDE.md`. Regola generale: usa solo i token e gli effetti qui definiti, niente valori arbitrari.

---

## 1. Identità

Duotone navy + lavanda su fondo bianco, tipografia Inter, geometrie molto arrotondate (pill e card), vetro smerigliato (glass) come effetto firma su overlay e KPI. Pagine centrate, ritmo verticale ampio, header con affermazione decisa seguita da un qualificatore leggero, chiusura con footer navy a tutta larghezza. Tono diretto e leggermente ironico. La boldness sta nel glass e nel contrasto navy/imagery: tutto il resto resta quieto.

---

## 2. Colore

Palette ristretta. Navy = testo e struttura. Lavanda = solo accento (fill, highlight, icone), mai testo lungo.

| Token | Hex | Uso |
|---|---|---|
| `ink` | `#1A2B5E` | navy primario: titoli, struttura, chip |
| `ink-deep` | `#142348` | footer e card a massimo contrasto |
| `ink-soft` | `#3A4A7A` | testo secondario su chiaro |
| `lavender` | `#B5AFE2` | accento: bottoni pieni, forme, icone |
| `lavender-light` | `#D8D5F1` | tinte chiare, hover |
| `lavender-dark` | `#9A90D4` | hover/pressed, cerchio icona |
| `mist` | `#F4F5FA` | sfondo molto chiaro |
| `haze` | `#E9EAF2` | bordi sottili, divisori |
| `muted` | `#6B7490` | testo corpo attenuato |

Contrasto: la lavanda su bianco non è leggibile come testo. Testo lungo sempre `ink`/`ink-soft` su chiaro, bianco su navy, `white/70` per l'attenuato su navy.

---

## 3. Tipografia

Font unico Inter. Pesi: Light 300, Regular 400, Bold 700 (600 opzionale per i bottoni).

Ruoli: Bold per display e titoli (navy); Light per i qualificatori e i sottotitoli grandi; Regular per il corpo; piccolo 400/600 per label e chip.

Header firma: un'affermazione in Bold con subito sotto una riga più piccola e leggera che ne smorza il tono (es. titolo Bold + qualificatore Light). Centrato nelle sezioni, allineato a sinistra in cima alla pagina.

Scala indicativa (mobile→desktop con `clamp`): display `clamp(3rem,8vw,6rem)`; titolo sezione `clamp(2.25rem,5vw,4rem)`; titolo card `text-2xl/3xl`; corpo `text-base/lg`; caption e chip `text-xs/sm`.

---

## 4. Forma: radius e ombre

Tutto arrotondato, niente angoli vivi salvo immagini a bordo schermo.

`rounded-full` per bottoni, chip, icone e barre decorative. `rounded-card` (1.5rem) per le card. `rounded-panel` (1.25rem) per pannelli glass e card espanse.

Ombre morbide e diffuse, mai dure: `shadow-soft` per le card, `shadow-lift` per elementi flottanti e hover.

---

## 5. Setup (token ed effetti)

Font Inter: con Next.js via `next/font/google` (pesi 300/400/600/700, `variable: "--font-inter"`); altrimenti `@fontsource/inter`.

Tailwind v4, in `app/globals.css`:

```css
@import "tailwindcss";

@theme {
  --color-ink: #1a2b5e;
  --color-ink-deep: #142348;
  --color-ink-soft: #3a4a7a;
  --color-lavender: #b5afe2;
  --color-lavender-light: #d8d5f1;
  --color-lavender-dark: #9a90d4;
  --color-mist: #f4f5fa;
  --color-haze: #e9eaf2;
  --color-muted: #6b7490;

  --font-sans: var(--font-inter, "Inter"), ui-sans-serif, system-ui, sans-serif;

  --radius-card: 1.5rem;
  --radius-panel: 1.25rem;

  --shadow-soft: 0 10px 40px -12px rgb(26 43 94 / 0.18);
  --shadow-lift: 0 20px 60px -20px rgb(26 43 94 / 0.28);
}
```

Genera automaticamente `bg-ink`, `text-ink`, `bg-ink-deep`, `bg-lavender`, `rounded-card`, `rounded-panel`, `shadow-soft`, `shadow-lift`, ecc. Nessun plugin Tailwind obbligatorio; serve solo `lucide-react` per le icone. (Per v3: stessi valori in `tailwind.config.js`, classi effetto invariate.)

---

## 6. Effetti firma

Glass e scrollbar in `@layer components`:

```css
@layer components {
  /* Glass: overlay, KPI, card espanse, bottone secondario */
  .glass {
    background: linear-gradient(135deg, rgb(255 255 255 / 0.55), rgb(255 255 255 / 0.25));
    backdrop-filter: blur(20px) saturate(140%);
    -webkit-backdrop-filter: blur(20px) saturate(140%);
    border: 1px solid rgb(255 255 255 / 0.5);
    box-shadow: 0 10px 40px -12px rgb(26 43 94 / 0.18), inset 0 1px 0 0 rgb(255 255 255 / 0.6);
  }

  /* Glass con macchia lavanda sfumata: banner, hero */
  .glass-accent {
    background:
      radial-gradient(120% 140% at 18% 0%, rgb(181 175 226 / 0.45), transparent 55%),
      linear-gradient(135deg, rgb(255 255 255 / 0.55), rgb(255 255 255 / 0.30));
    backdrop-filter: blur(24px) saturate(140%);
    -webkit-backdrop-filter: blur(24px) saturate(140%);
    border: 1px solid rgb(255 255 255 / 0.5);
    box-shadow: 0 12px 48px -14px rgb(26 43 94 / 0.22), inset 0 1px 0 0 rgb(255 255 255 / 0.6);
  }

  /* Scrollbar sottile per testi lunghi */
  .scroll-soft { scrollbar-width: thin; scrollbar-color: rgb(26 43 94 / 0.25) transparent; }
  .scroll-soft::-webkit-scrollbar { width: 6px; }
  .scroll-soft::-webkit-scrollbar-thumb { background: rgb(26 43 94 / 0.25); border-radius: 9999px; }
  .scroll-soft::-webkit-scrollbar-track { background: transparent; }
}
```

Il glass è riservato a elementi flottanti/overlay. Rende al massimo sopra imagery o fasce colorate; su bianco funziona come pannello smerigliato leggero (sfoca ciò che sta dietro). Non usarlo come riempimento generico. Hover su elementi glass: passa a `shadow-lift`.

---

## 7. Linee generali per i componenti

Descrizione di anatomia, token ed effetti. Le implementazioni si derivano da qui.

**Bottoni.** Forma pill (`rounded-full`), padding generoso, peso 600. Primario: fondo `lavender`, testo `ink`, `shadow-soft`; in hover vira a `lavender-dark` con testo bianco. Secondario: effetto `glass`, testo `ink`. Etichetta sempre con verbo attivo. Focus tastiera visibile.

**Bottoni icona.** Cerchio (`rounded-full`), ~44px, icona lucide centrata. Azione/apertura in lavanda (freccia `ArrowUpRight`); chiusura (`X`) e torna-su (`ArrowUp`) in glass. Sempre `aria-label`.

**Chip metadato.** Pill navy pieno (`bg-ink`), testo bianco piccolo, larghezza minima uniforme, in riga con gap ridotto. Per dati come ruolo, RAL, stato. Mai lavanda per i chip.

**Card.** `rounded-card`, fondo bianco, `shadow-soft`, padding ampio. Varianti: navy feature (`bg-ink-deep`, testo bianco, numero grande Bold con qualificatore Light); stat card (chip eyebrow in alto, numero grande, caption muted, bottone freccia in basso a destra).

**Card di listing.** Card bianca a due colonne: a sinistra titolo, luogo (muted), riga di chip e CTA; a destra la descrizione muted. Bottone freccia di apertura in basso a destra. Su mobile le colonne si impilano.

**Overlay / dettaglio espanso.** Pannello `glass` `rounded-panel` con `shadow-lift`, sovrapposto alle card sottostanti. Testo lungo in area con `max-h` e `scroll-soft`. Pulsante di chiusura glass in alto a destra, CTA lavanda in basso. Transizione morbida di apertura/chiusura, `prefers-reduced-motion` rispettato.

**KPI / callout numerico.** Numero grande Bold (bianco su glass o su navy), unità tipo `%` più piccola in apice. Da usare in glass sopra imagery.

**Banner / pannello glass.** `glass` o `glass-accent` (con macchia lavanda), `rounded-panel`, testo muted spesso centrato. Solo come overlay.

**Header di sezione.** Affermazione in Bold con qualificatore Light subito sotto; centrato nelle sezioni, a sinistra in cima.

**Footer.** Fascia `ink-deep` a tutta larghezza. Colonne con intestazione Bold bianca e righe secondarie `white/70`. Wordmark grande in basso a sinistra, back-to-top in glass in basso a destra.

**Motivo decorativo.** Pill verticali alternate tra outline navy, navy pieno e lavanda. Segno grafico da usare con parsimonia.

---

## 8. Layout

Contenitore `mx-auto max-w-6xl px-6`, ritmo verticale ampio tra le sezioni. Pagine centrate: header in cima a sinistra, paragrafo introduttivo a larghezza media e centrato, sezioni con header centrato e lista di card. Footer in fascia full-bleed (il contenuto interno torna nel `max-w-6xl`). Sfondo bianco o `mist`; profondità con ombre morbide e, dove serve, imagery a tutta altezza con KPI in glass sopra. Le immagini a bordo schermo possono avere angoli vivi; contenitori e card restano arrotondati.

---

## 9. Regole di coerenza

Solo i token di §2–§4. Lavanda come accento, mai testo lungo su bianco; attenuato su navy con `white/70`. Inter ovunque: Bold per titoli, Light per i qualificatori, Regular per il corpo. Tutto arrotondato. Metadati sempre come chip navy. Glass solo per overlay, KPI e card espanse. Ombre morbide, mai dure. Footer sempre navy full-bleed. Numeri marcatori solo per sequenze reali. Quality floor: responsive fino a mobile, focus visibile, reduced-motion, contrasto verificato.
