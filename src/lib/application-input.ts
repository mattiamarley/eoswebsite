import { validRecordId } from './security.ts'
export function applicationInput(form:FormData) {
  const text=(key:string,max:number)=>{const v=form.get(key)??'';return typeof v==='string'&&v.length<=max&&!v.includes('\0')?v.trim():null}
  const first=text('first_name',80),last=text('last_name',80),email=text('email',254)?.toLowerCase(),phone=text('phone',30),message=text('message',3000),job=text('job_id',36)
  if(!first||!last||!email||!/^[$A-Z0-9.!#%&'*+\/=?^_`{|}~-]+@[A-Z0-9](?:[A-Z0-9-]*[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]*[A-Z0-9])?)+$/i.test(email)||phone===null||message===null||!validRecordId(job)||form.get('privacy')!=='on'||form.get('website'))return null
  return {first_name:first,last_name:last,applicant_name:`${first} ${last}`,email,phone:phone||null,message:message||null,job_id:job}
}
export function applicationDocumentPath(value:string,id:string):string|null {
  return validRecordId(id)&&new RegExp(`^${id}/[0-9a-f-]{36}\\.pdf$`,'i').test(value)?value:null
}
