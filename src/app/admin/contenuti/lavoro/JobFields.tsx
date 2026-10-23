import { JOB_LEVELS } from '@/src/lib/job-compensation'
import { ToggleSwitch } from '../../_components/ToggleSwitch'

const inputClass =
  'w-full px-3.5 py-2.5 text-sm text-ink placeholder-muted bg-white/70 border border-white/50 rounded-lg outline-none transition focus:ring-2 focus:ring-lavender focus:border-transparent shadow-sm'

export type JobValues = {
  title: string
  category: string | null
  location: string | null
  description: string | null
  seniority?: string | null
  salary_min?: number | null
  salary_max?: number | null
  is_open: boolean | null
}

export function JobFields({ values, dark = false, compensationEnabled=true }: { values?: JobValues; dark?: boolean; compensationEnabled?:boolean }) {
  const labelCls = `block text-sm font-medium mb-1.5 ${dark ? 'text-white' : 'text-ink-soft'}`
  const toggleLabelCls = `text-sm font-medium ${dark ? 'text-white' : 'text-ink-soft'}`

  return (
    <>
      <div>
        <label htmlFor="title" className={labelCls}>
          Titolo <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          name="title"
          maxLength={180}
          type="text"
          required
          defaultValue={values?.title ?? ''}
          placeholder="Es. Ingegnere civile"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="category" className={labelCls}>
          Categoria
        </label>
        <input
          id="category"
          name="category"
          maxLength={120}
          type="text"
          defaultValue={values?.category ?? ''}
          placeholder="Es. Progettazione civile, BIM…"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="location" className={labelCls}>
          Sede
        </label>
        <input
          id="location"
          name="location"
          maxLength={180}
          type="text"
          defaultValue={values?.location ?? ''}
          placeholder="Es. Milano, Remoto…"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="description" className={labelCls}>
          Descrizione
        </label>
        <textarea
          id="description"
          name="description"
          maxLength={20000}
          rows={4}
          defaultValue={values?.description ?? ''}
          placeholder="Breve descrizione della posizione…"
          className={`${inputClass} resize-none`}
        />
      </div>

      <fieldset disabled={!compensationEnabled} className="space-y-4 disabled:opacity-50">
        <legend className={labelCls}>Livello e retribuzione</legend>
        <div><label htmlFor="seniority" className={labelCls}>Livello (facoltativo)</label><select id="seniority" name="seniority" className={inputClass} defaultValue={values?.seniority??''}><option value="">Non specificato</option>{JOB_LEVELS.map(level=><option key={level} value={level}>{level}</option>)}</select></div>
        <p id="salary-help" className="text-xs text-muted">RAL annua lorda in euro. Inserisci 35000 per mostrare 35K €. Per una fascia compila anche il secondo importo; lascia vuoto per non pubblicarla.</p>
        <div className="grid grid-cols-2 gap-3"><div><label htmlFor="salary_min" className={labelCls}>RAL / da (€)</label><input id="salary_min" name="salary_min" type="number" min={1} max={5000000} step={1} defaultValue={values?.salary_min??''} placeholder="35000" aria-describedby="salary-help" className={inputClass}/></div><div><label htmlFor="salary_max" className={labelCls}>Fino a (€)</label><input id="salary_max" name="salary_max" type="number" min={1} max={5000000} step={1} defaultValue={values?.salary_max??''} placeholder="45000" aria-describedby="salary-help" className={inputClass}/></div></div>
      </fieldset>
      <div className="pt-1">
        <ToggleSwitch
          name="is_open"
          defaultChecked={values?.is_open ?? true}
          label="Posizione aperta"
          labelClassName={toggleLabelCls}
        />
        <p className="mt-1.5 text-xs text-muted">
          Le posizioni aperte sono visibili sul sito e ricevono candidature.
        </p>
      </div>
    </>
  )
}
