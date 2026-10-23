export const JOB_LEVELS = ['Stage', 'Junior', 'Middle', 'Senior', 'Lead'] as const
export type JobCompensation = {seniority:string|null;salary_min:number|null;salary_max:number|null}
export function parseCompensation(form:FormData):JobCompensation|null {
  const level=form.get('seniority')??''
  if(typeof level!=='string'||(level!==''&&!JOB_LEVELS.includes(level as typeof JOB_LEVELS[number])))return null
  const amount=(key:string)=>{const value=form.get(key)??'';if(typeof value!=='string')return NaN;if(!value.trim())return null;return /^\d{1,7}$/.test(value)&&Number(value)>0&&Number(value)<=5000000?Number(value):NaN}
  const min=amount('salary_min'),max=amount('salary_max')
  if(Number.isNaN(min)||Number.isNaN(max)||(max!==null&&(min===null||max<min)))return null
  return {seniority:level||null,salary_min:min,salary_max:max}
}
export function formatSalary({salary_min: min,salary_max:max}:Pick<JobCompensation,'salary_min'|'salary_max'>):string {
  if(min===null||!Number.isFinite(min)||min<=0)return ''
  const format=(value:number)=>value%1000===0?`${value/1000}K`:new Intl.NumberFormat('it-IT').format(value)
  return `RAL ${format(min)}${max!==null&&max>min?`–${format(max)}`:''} €`
}
