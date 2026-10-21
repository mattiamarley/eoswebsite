import { ToggleSwitch } from '../../_components/ToggleSwitch'

const inputClass =
  'w-full px-3.5 py-2.5 text-sm text-ink placeholder-muted bg-white/70 border border-white/50 rounded-lg outline-none transition focus:ring-2 focus:ring-lavender focus:border-transparent shadow-sm'

export type JobValues = {
  title: string
  category: string | null
  location: string | null
  description: string | null
  is_open: boolean | null
}

export function JobFields({ values, dark = false }: { values?: JobValues; dark?: boolean }) {
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
          type="text"
          required
          defaultValue={values?.title ?? ''}
          placeholder="Es. Frontend Developer"
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
          type="text"
          defaultValue={values?.category ?? ''}
          placeholder="Es. Engineering, Design…"
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
          rows={4}
          defaultValue={values?.description ?? ''}
          placeholder="Breve descrizione della posizione…"
          className={`${inputClass} resize-none`}
        />
      </div>

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
