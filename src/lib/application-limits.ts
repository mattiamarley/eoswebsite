// Leaves room for multipart/base64 overhead in Netlify's buffered function requests.
export const APPLICATION_FILE_MAX_BYTES=3*1024*1024
export const APPLICATION_TOTAL_MAX_BYTES=4*1024*1024
export function applicationSizeError(files:{size:number}[]):string|null {
  if(files.some(file=>file.size>APPLICATION_FILE_MAX_BYTES))return 'Ogni PDF può pesare al massimo 3 MB.'
  if(files.reduce((sum,file)=>sum+file.size,0)>APPLICATION_TOTAL_MAX_BYTES)return 'CV e portfolio insieme possono pesare al massimo 4 MB.'
  return null
}
