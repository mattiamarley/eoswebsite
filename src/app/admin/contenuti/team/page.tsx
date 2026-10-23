import { requireAdmin } from '@/src/utils/supabase/admin'
import Link from 'next/link'
import Image from 'next/image'
import { addMember, updateMember, deleteMember } from './actions'
import { SearchBox } from '../../_components/SearchBox'
import { Modal } from '../../_components/Modal'
import { TeamOrder } from './TeamOrder'
import { MemberFields } from './MemberFields'

type Member = {
  id: string
  full_name: string
  job_tag: string | null
  image_url: string | null
  description: string | null
  created_at: string
}

type Props = {
  searchParams: Promise<{ error?: string; edit?: string; q?: string }>
}

const ERROR_MESSAGES: Record<string, string> = {
  invalid_input: 'Dati non validi o troppo lunghi. Controlla i campi e riprova.',
  missing_name: 'Il nome è obbligatorio.',
  missing_fields: 'Nome, ruolo e descrizione sono obbligatori. La foto è facoltativa.',
  insert_failed: 'Errore durante l\'inserimento. Riprova.',
  update_failed: 'Errore durante la modifica. Riprova.',
  delete_failed: 'Errore durante l\'eliminazione. Riprova.',
}

export default async function TeamPage({ searchParams }: Props) {
  const { supabase } = await requireAdmin()

  const { error: errorParam, edit: editId, q: qParam } = await searchParams
  const q = (qParam ?? '').trim()

  let query = supabase
    .from('team_members')
    .select('id, full_name, job_tag, image_url, description, created_at')
  if (q) {
    const safe = q.replace(/[,()%]/g, ' ').trim()
    query = query.or(
      `full_name.ilike.%${safe}%,job_tag.ilike.%${safe}%,description.ilike.%${safe}%`
    )
  }
  const { data: members } = await query.order('created_at', { ascending: false })

  const orderedResponse = await supabase.from('team_members').select('id,full_name,job_tag,image_url').order('sort_order',{ascending:true,nullsFirst:false}).order('created_at',{ascending:false}).order('id')
  const orderMissing = ['42703','PGRST204'].includes(orderedResponse.error?.code ?? '') && (orderedResponse.error?.message ?? '').includes('sort_order')
  const preview = orderMissing ? await supabase.from('team_members').select('id,full_name,job_tag,image_url').order('created_at',{ascending:false}).order('id') : orderedResponse
  const editing = editId ? members?.find((m) => m.id === editId) ?? null : null

  return (
    <div className="min-h-screen">
      <header className="glass border-b border-white/50 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center gap-2 text-sm">
          <Link href="/admin" className="text-muted hover:text-ink transition">Dashboard</Link>
          <span className="text-haze">/</span>
          <Link href="/admin/contenuti" className="text-muted hover:text-ink transition">Contenuti</Link>
          <span className="text-haze">/</span>
          <span className="font-semibold text-ink">Team</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {errorParam && ERROR_MESSAGES[errorParam] && (
          <div className="mb-6 px-4 py-3 rounded-panel bg-red-50 border border-red-200 text-sm text-red-700">
            {ERROR_MESSAGES[errorParam]}
          </div>
        )}

        <TeamOrder key={JSON.stringify(preview.data)} members={preview.data ?? []} enabled={!preview.error && !orderMissing} error={preview.error ? 'Impossibile caricare l’anteprima del team.' : orderMissing ? 'Per salvare l’ordine occorre applicare la migrazione 20261023_team_order.sql su Supabase.' : undefined}/>
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 items-start">

          <div className="glass rounded-card shadow-soft p-6 lg:sticky lg:top-6">
            <h2 className="text-base font-bold text-ink mb-5">Nuovo membro</h2>
            <form action={addMember} className="space-y-4">
              <MemberFields />
              <button
                type="submit"
                className="w-full py-2.5 bg-lavender text-ink text-sm font-semibold rounded-full shadow-soft transition hover:bg-lavender-dark hover:text-white active:scale-[0.98]"
              >
                Aggiungi membro
              </button>
            </form>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-ink">Team</h2>
              <span className="text-sm text-muted">{members?.length ?? 0} totali</span>
            </div>
            <div className="mb-4">
              <SearchBox action="/admin/contenuti/team" defaultValue={q} placeholder="Cerca per nome, ruolo…" />
            </div>

            {!members || members.length === 0 ? (
              <div className="glass rounded-card shadow-soft px-6 py-12 text-center">
                <p className="text-sm text-muted">
                  {q ? `Nessun risultato per «${q}».` : 'Nessun membro ancora. Aggiungine uno con il form.'}
                </p>
              </div>
            ) : (
              <ul className="space-y-3">
                {members.map((member: Member) => (
                  <li
                    key={member.id}
                    className={`glass rounded-card shadow-soft px-6 py-5 flex items-start justify-between gap-4 transition hover:shadow-lift ${
                      editing?.id === member.id ? 'ring-2 ring-lavender' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4 min-w-0">
                      {member.image_url ? (
                        <Image
                          src={member.image_url}
                          alt={member.full_name}
                          width={48}
                          height={48}
                          unoptimized
                          className="w-12 h-12 rounded-full object-cover bg-haze shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-lavender-light text-lavender-dark flex items-center justify-center text-sm font-bold shrink-0">
                          {member.full_name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-ink">{member.full_name}</p>
                        {member.job_tag && (
                          <span className="mt-1 inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full bg-ink text-white">
                            {member.job_tag}
                          </span>
                        )}
                        {member.description && (
                          <p className="mt-1.5 text-sm text-muted line-clamp-2 leading-relaxed">
                            {member.description}
                          </p>
                        )}
                        <p className="mt-2 text-xs text-muted">
                          {new Date(member.created_at).toLocaleDateString('it-IT', {
                            day: '2-digit', month: 'long', year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <Link
                        href={`/admin/contenuti/team?edit=${member.id}`}
                        className="text-sm font-semibold text-lavender-dark border border-lavender/40 px-4 py-1.5 rounded-full transition hover:bg-lavender-light"
                      >
                        Modifica
                      </Link>
                      <form action={deleteMember}>
                        <input type="hidden" name="id" value={member.id} />
                        <button
                          type="submit"
                          className="text-sm font-medium text-red-500 border border-red-200 px-4 py-1.5 rounded-full transition hover:bg-red-50"
                        >
                          Elimina
                        </button>
                      </form>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>

      {editing && (
        <Modal title="Modifica membro" closeHref="/admin/contenuti/team">
          <form action={updateMember} className="space-y-4">
            <input type="hidden" name="id" value={editing.id} />
            <MemberFields values={editing} />
            <div className="flex items-center gap-3 pt-1">
              <Link
                href="/admin/contenuti/team"
                className="flex-1 py-2.5 text-center text-sm font-medium text-muted border border-haze rounded-full transition hover:bg-mist"
              >
                Annulla
              </Link>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-lavender text-ink text-sm font-semibold rounded-full shadow-soft transition hover:bg-lavender-dark hover:text-white active:scale-[0.98]"
              >
                Salva modifiche
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
