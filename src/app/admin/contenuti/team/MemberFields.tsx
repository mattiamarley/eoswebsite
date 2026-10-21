import Image from 'next/image'
import { ImageInput } from '../../_components/ImageInput'

const inputClass =
  'w-full px-3.5 py-2.5 text-sm text-ink placeholder-muted bg-white/70 border border-white/50 rounded-lg outline-none transition focus:ring-2 focus:ring-lavender focus:border-transparent shadow-sm'

const fileClass =
  'w-full text-sm text-ink-soft file:mr-3 file:py-2 file:px-3.5 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-lavender file:text-ink hover:file:bg-lavender-dark hover:file:text-white file:cursor-pointer'

export type MemberValues = {
  full_name: string
  job_tag: string | null
  image_url: string | null
  description: string | null
}

export function MemberFields({ values, dark = false }: { values?: MemberValues; dark?: boolean }) {
  const labelCls = `block text-sm font-medium mb-1.5 ${dark ? 'text-white' : 'text-ink-soft'}`

  return (
    <>
      {values?.image_url && (
        <input type="hidden" name="current_image_url" value={values.image_url} />
      )}

      <div>
        <label htmlFor="name" className={labelCls}>
          Nome <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          name="name"
          maxLength={120}
          type="text"
          required
          defaultValue={values?.full_name ?? ''}
          placeholder="Nome del membro"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="role" className={labelCls}>
          Ruolo
        </label>
        <input
          id="role"
          name="role"
          maxLength={180}
          type="text"
          defaultValue={values?.job_tag ?? ''}
          placeholder="Es. Designer, Sviluppatore…"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="image" className={labelCls}>
          Foto
        </label>
        {values?.image_url && (
          <div className="mb-2 flex items-center gap-2">
            <Image
              src={values.image_url}
              alt={values.full_name}
              width={40}
              height={40}
              unoptimized
              className="w-10 h-10 rounded-full object-cover bg-haze"
            />
            <span className="text-xs text-muted">Foto attuale — carica un file per sostituirla</span>
          </div>
        )}
        <ImageInput name="image" className={fileClass} />
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
          placeholder="Breve bio del membro…"
          className={`${inputClass} resize-none`}
        />
      </div>
    </>
  )
}
