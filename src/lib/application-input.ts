import { validRecordId } from './security.ts'
export function applicationInput(form:FormData) {
  const text=(key:string,max:number)=>{const v=form.get(key)??'';return typeof v==='string'&&v.length<=max&&!v.includes('\0')?v.trim():null}
  const first=text('first_name',80),last=text('last_name',80),email=text('email',254)?.toLowerCase(),phone=text('phone',30),message=text('message',3000),job=text('job_id',36)
  const parsedType=text('application_type',20)
  if(parsedType===null)return null
  const type=parsedType||'position'
  if(!['position','spontaneous'].includes(type)||(type==='position'?!validRecordId(job):job!==''))return null
  if(!first||!last||!email||!/^[$A-Z0-9.!#%&'*+\/=?^_`{|}~-]+@[A-Z0-9](?:[A-Z0-9-]*[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]*[A-Z0-9])?)+$/i.test(email)||phone===null||message===null||form.get('privacy')!=='on'||form.get('website'))return null
  return {first_name:first,last_name:last,applicant_name:`${first} ${last}`,email,phone:phone||null,message:message||null,job_id:type==='spontaneous'?null:job,application_type:type}
}
export function applicationDocumentPath(value:string,id:string):string|null {
  if(!validRecordId(id) || typeof value!=='string') return null
  const parts=value.split('/')
  if(parts.length!==2 || parts[0]!==id || !parts[1].endsWith('.pdf') || !validRecordId(parts[1].slice(0,-4))) return null
  return value
}
