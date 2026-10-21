@AGENTS.md
# Istruzioni di Progetto per Claude

## Stack Tecnologico
- Framework: Next.js (App Router)
- Styling: Tailwind CSS
- Animazioni: Framer Motion
- Database/Auth: Supabase
- Linguaggio: TypeScript

## Convenzioni
- Usa i Server Components di default. Aggiungi "use client" solo se necessario (es. interattività, hooks di React, Framer Motion).
- Usa `@supabase/ssr` per le chiamate al database lato server.
- Il sito contiene un'area pubblica (portfolio, contatti) e una Dashboard Admin privata per la gestione dei contenuti.

# Istruzioni di Progetto per Claude Code

## Stack Tecnologico Base
- Framework: Next.js (App Router)
- Styling: Tailwind CSS
- Animazioni: Framer Motion
- Database/Auth: Supabase (@supabase/ssr)
- Linguaggio: TypeScript rigoroso

## Direttive Architetturali (Skills)
1. **Server-First:** Usa i Server Components di default per massimizzare le performance. Aggiungi la direttiva `"use client"` solo nei componenti "foglia" quando serve interattività (React hooks, onClick, Framer Motion).
2. **Data Fetching & Mutations:** Usa rigorosamente le **Server Actions** di Next.js per i form e la modifica dei dati. Evita di creare Route Handlers (`/api`) a meno che non servano per webhook esterni.
3. **Sicurezza Admin:** Qualsiasi Server Action che inserisce, modifica o elimina dati DEVE sempre verificare l'autenticazione tramite `getUser()` di Supabase prima di eseguire l'operazione sul database.
4. **UI e Feedback:** Scrivi codice Tailwind pulito e moderno (Mobile-First). Assicurati che i form abbiano una gestione degli errori chiara (try/catch) e usa `revalidatePath` per aggiornare le interfacce dopo una mutazione.
5. **SEO & Performance:** Ottimizza sempre le immagini con `next/image` e mantieni il codice HTML semantico.
6. **Gestione Immagini:** Usa Supabase Storage (bucket pubblico `website-images`) per le immagini. Nelle Server Actions, carica prima il file tramite `supabase.storage.from('website-images').upload()`, ottieni la `publicUrl` e salva solo questo link testuale nella tabella del database corrispondente. Lato frontend, usa sempre il componente `next/image` per renderizzarle.
**Documenti (Candidature):** Usa il bucket `applications-docs` per i file PDF/Portfolio. Nella Server Action, accetta file multipli, caricali nel bucket con un ciclo, recupera gli URL e salva l'array di link nella colonna `documents` (tipo testuale) della tabella `applications`.


## Standard Professionali e Sicurezza
- Scrivi codice "production-ready": modulare, pulito e facilmente manutenibile da terzi.
- Tutte le rotte API e la Dashboard Admin devono essere rigorosamente protette verificando la sessione utente.
- Il database Supabase deve avere le policy RLS (Row Level Security) attive e configurate correttamente.
- Implementa una gestione degli errori robusta (try/catch, feedback visivi per l'utente, error boundaries).
- Mantieni un'architettura scalabile, separando chiaramente la logica di accesso ai dati (database) dalla UI.

## Struttura del Database (Supabase)
Fai riferimento a questo schema per tutte le query e le Server Actions:

| Tabella      | Colonna     | Tipo di Dato             | Valore Default               |
| ------------ | ----------- | ------------------------ | ---------------------------- |
| jobs         | id          | uuid                     | gen_random_uuid()            |
| jobs         | title       | text                     | null                         |
| jobs         | category    | text                     | null                         |
| jobs         | location    | text                     | null                         |
| jobs         | description | text                     | null                         |
| jobs         | created_at  | timestamp with time zone | 
timezone('utc'::text, now()) |
| jobs         | is_open     | boolean                  | true                         |
| projects     | id          | uuid                     | gen_random_uuid()            |
| projects     | title       | text                     | null                         |
| projects     | description | text                     | null                         |
| projects     | images      | ARRAY                    | '{}'::text[]                 |
| projects     | created_at  | timestamp with time zone | timezone('utc'::text, now()) |
| team_members | id          | uuid                     | gen_random_uuid()            |
| team_members | full_name   | text                     | null                         |
| team_members | description | text                     | null                         |
| team_members | image_url   | text                     | null                         |
| team_members | job_tag     | text                     | null                         |
| team_members | created_at  | timestamp with time zone | timezone('utc'::text, now()) |
| applications | id             | uuid                     | gen_random_uuid()            |
| applications | job_id         | uuid                     | null                         |
| applications | applicant_name | text                     | null                         |
| applications | email          | text                     | null                         |
| applications | phone          | text                     | null                         |
| applications | documents      | ARRAY                    | '{}'::text[]                 |
| applications | status         | text                     | 'nuova'                      |
| applications | created_at     | timestamp with time zone | timezone('utc'::text, now()) |
| applications | is_favorite    | boolean                  | false                        |

# 7 Design / UI
Per qualsiasi lavoro su interfaccia segui rigorosamente il design system: @design-system.md

