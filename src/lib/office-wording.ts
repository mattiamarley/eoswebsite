/** Update legacy gallery copy while keeping stored captions and URLs intact. */
export function officeWording(text:string):string {
  return text
    .replace(/\bdello studio\b/gi, 'dell’ufficio')
    .replace(/\ballo studio\b/gi, 'all’ufficio')
    .replace(/\bdallo studio\b/gi, 'dall’ufficio')
    .replace(/\buno studio\b/gi, 'un ufficio')
    .replace(/\blo studio\b/gi, match=>match[0]==='L'?'L’ufficio':'l’ufficio')
    .replace(/\bstudio\b/gi, match=>match==='STUDIO'?'UFFICIO':match[0]==='S'?'Ufficio':'ufficio')
}
