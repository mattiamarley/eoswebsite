import type { ProjectSchema } from '@/src/lib/project-schema'
import { PROJECT_TAGS } from '@/src/lib/project-tags'
import { ProjectImages } from '../../_components/ProjectImages'

const inputClass =
  'w-full px-3.5 py-2.5 text-sm text-ink placeholder-muted bg-white/70 border border-white/50 rounded-lg outline-none transition focus:ring-2 focus:ring-lavender focus:border-transparent shadow-sm'

export type ProjectValues = {
  title: string
  description: string | null
  images: string[] | null
  is_featured?: boolean
  tags?: string[] | null
}

export function ProjectFields({ values, dark = false, schema={tags:true,is_featured:true} }: { values?: ProjectValues; dark?: boolean; schema?:ProjectSchema }) {
  const labelCls = `block text-sm font-medium mb-1.5 ${dark ? 'text-white' : 'text-ink-soft'}`

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
          placeholder="Nome del progetto"
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
          placeholder="Breve descrizione del progetto…"
          className={`${inputClass} resize-none`}
        />
      </div>

      <label className={labelCls}><input disabled={!schema.is_featured} type="checkbox" name="is_featured" defaultChecked={values?.is_featured??false}/> ★ In evidenza nel carosello Portfolio</label>
      <fieldset disabled={!schema.tags} className={!schema.tags?'opacity-50':undefined}>
        <legend className={labelCls}>Etichette del progetto</legend>
        <p className="text-xs text-muted mb-3">Seleziona una o più etichette: saranno utilizzate nei filtri del Portfolio. Senza etichette il progetto resta visibile in Tutti.</p>
        <div className="flex flex-wrap gap-2">
          {PROJECT_TAGS.map(tag=><label key={tag} className="inline-flex items-center gap-2 rounded-lg border border-haze bg-white/70 px-3 py-2 text-sm text-ink cursor-pointer">
            <input type="checkbox" name="tags" value={tag} defaultChecked={values?.tags?.includes(tag)??false}/>{tag}
          </label>)}
        </div>
      </fieldset>
      <ProjectImages
        initialImages={values?.images ?? []}
        labelClassName={`block text-sm font-medium ${dark ? 'text-white' : 'text-ink-soft'}`}
      />
    </>
  )
}
