import test from 'node:test'
import assert from 'node:assert/strict'
import {galleryDraft,validGalleryImage,retainedGallerySlide,galleryUploadError} from '../src/lib/about-gallery.ts'
const id='12345678-1234-1234-1234-123456789abc'
const origin='https://example.supabase.co'
const src=`${origin}/storage/v1/object/public/website-images/about/${id}.jpg`
const slide={id,src,alt:' Vista della facciata '}
test('gallery draft preserves order, allows explicit empty selection and normalizes captions',()=>{
 assert.deepEqual(galleryDraft([]),[])
 assert.equal(galleryDraft([slide])[0].alt,'Vista della facciata')
 assert.equal(galleryDraft([slide])[0].src,src)
})
test('rejects duplicate IDs, missing captions, binary values and more than eight slides',()=>{
 for(const value of [null,{},[slide,slide],[{...slide,alt:''}],[{...slide,alt:'x'.repeat(161)}],[{...slide,id:'not-id'}],[{...slide,alt:'bad\0text'}],Array(9).fill(slide)])assert.equal(galleryDraft(value),null)
})
test('only retains images owned by this gallery and in its isolated storage folder',()=>{
 assert.equal(validGalleryImage(src,origin),true)
 assert.equal(retainedGallerySlide(slide,[slide],origin),true)
 assert.equal(retainedGallerySlide({...slide,id:'22345678-1234-1234-1234-123456789abc'},[slide],origin),false)
 for(const value of [src.replace('/about/','/'),src.replace('example.supabase.co','evil.test'),src+'?query=1',src.replace('.jpg','.svg'),'blob:local'])assert.equal(validGalleryImage(value,origin),false)
 assert.equal(retainedGallerySlide({...slide,src:src.replace('.jpg','.png')},[slide],origin),false)
})
test('limits uploads per image and per Netlify request',()=>{
 assert.equal(galleryUploadError([{size:3*1024*1024},{size:1024*1024}]),null)
 assert.ok(galleryUploadError([{size:4*1024*1024}]))
 assert.ok(galleryUploadError([{size:3*1024*1024},{size:2*1024*1024}]))
})

test('Studio and About cannot retain or delete each other’s images',()=>{
 const studioSrc=src.replace('/about/','/studio/')
 const studio={...slide,src:studioSrc}
 assert.equal(validGalleryImage(studioSrc,origin,'studio'),true)
 assert.equal(validGalleryImage(src,origin,'studio'),false)
 assert.equal(validGalleryImage(studioSrc,origin,'about'),false)
 assert.equal(retainedGallerySlide(studio,[studio],origin,'studio'),true)
 assert.equal(retainedGallerySlide(slide,[slide],origin,'studio'),false)
 assert.equal(retainedGallerySlide(studio,[studio],origin,'about'),false)
 assert.equal(validGalleryImage(studioSrc.replace(id,'-'.repeat(36)),origin,'studio'),false)
})
