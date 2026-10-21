export type ProjectSchema = {tags:boolean;is_featured:boolean}
export function missingProjectColumn(error:{code?:string;message?:string}|null):keyof ProjectSchema|null {
  if(!error || !['42703','PGRST204'].includes(error.code??''))return null
  return /\btags\b/.test(error.message??'')?'tags':/\bis_featured\b/.test(error.message??'')?'is_featured':null
}
