/** Only this additive missing-column error permits legacy reads. Never bypass authorization errors. */
export function missingApplicationType(error:{code?:string;message?:string}|null):boolean {
  return !!error&&['42703','PGRST204'].includes(error.code??'')&&/\bapplication_type\b/.test(error.message??'')
}
export function applicationLoadMessage(error:{code?:string}|null):string {
  if(error?.code==='42501'||error?.code==='PGRST301')return 'Il tuo account non dispone dei permessi necessari per leggere le candidature. Verifica il ruolo amministratore e le policy Supabase.'
  if(error?.code==='42703'||error?.code==='PGRST204'||error?.code==='42P01'||error?.code==='PGRST205')return 'Il database candidature non è ancora aggiornato. Applica la migrazione candidature nell’SQL Editor di Supabase.'
  return 'Impossibile caricare le candidature. Riprova tra poco o verifica la connessione a Supabase.'
}
