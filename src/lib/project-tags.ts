export const PROJECT_TAGS = ['Architettura', 'Strutture', 'Impianti', 'Ambiente', 'Sicurezza', 'Antincendio', 'Project management', 'Valutazioni immobiliari', 'Geologia e rilievi', 'Acustica'] as const

export function parseProjectTags(values: unknown[]): string[] {
  if(values.some(value=>typeof value!=='string'||!(PROJECT_TAGS as readonly string[]).includes(value))) throw new Error('invalid_tags')
  return PROJECT_TAGS.filter(tag=>values.includes(tag))
}

export function projectLabels(item:{tags?:string[];category:string}):string[] {
  return item.tags === undefined ? [item.category] : item.tags
}
