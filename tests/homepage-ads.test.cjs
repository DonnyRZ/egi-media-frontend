/* eslint-disable @typescript-eslint/no-require-imports, @next/next/no-assign-module-variable */
const test = require('node:test'), assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm'), ts = require('typescript');
function load(file, imports = {}, globals = {}) {
  const source = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
  const compiled = ts.transpileModule(source, { fileName:file, compilerOptions: { jsx:ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } });
  const module = { exports: {} };
  vm.runInNewContext(compiled.outputText, { module, exports: module.exports, URL, ...globals, require(name) { if (!(name in imports)) throw new Error('Unexpected import: '+name); return imports[name]; } });
  return module.exports;
}
const types = load('src/shared/types/ads.types.ts');
test('three placements accept exact and rounded ratios and reject incompatible images', () => {
  assert.equal(types.AD_PLACEMENT_VALUES.length, 3);
  assert.equal(types.isAdPlacement('SIDEBAR_RECTANGLE'), false);
  assert.equal(types.matchesAdRatio('LEADERBOARD',1920,367), true);
  assert.equal(types.matchesAdRatio('LEADERBOARD',970,250), false);
  assert.equal(types.matchesAdRatio('LEADERBOARD',1280,720), false);
  assert.equal(types.matchesAdRatio('IN_FEED',1280,720), true);
  assert.equal(types.matchesAdRatio('LATEST_VIDEOS',1920,1080), true);
  assert.equal(types.matchesAdRatio('IN_FEED',0,720), false);
});

test('banner media uses persisted and intrinsic legacy dimensions without changing content ad ratios', () => {
  const media = load('src/features/ads/components/AdMedia.tsx', {
    react: { useState: () => [null, () => {}] },
    'react/jsx-runtime': { jsx: (type, props) => ({type,props}), jsxs: (type, props) => ({type,props}) },
    '@/shared/types/ads.types': types,
  }).AdMedia;
  assert.equal(media({placement:'LEADERBOARD',imageUrl:'/legacy.png',imageWidth:970,imageHeight:250}).props.style.aspectRatio,'970 / 250');
  assert.equal(media({placement:'LEADERBOARD'}).props.style.aspectRatio,'1920 / 367');
  assert.equal(media({placement:'IN_FEED',imageWidth:970,imageHeight:250}).props.style.aspectRatio,'16 / 9');
});
test('ad preparation preserves exact original file; mismatch and oversized files fail', async () => {
  const file = { type:'image/png',size:1705687 }, banner = { type:'image/png',size:277327 };
  const { prepareAdImage } = load('src/features/cms/utils/prepare-ad-image.ts', {
    '@/shared/types/ads.types': types,
    '@/features/cms/utils/prepare-image': { MAX_IMAGE_UPLOAD_BYTES:5*1024*1024, decodeImage:async value => ({ naturalWidth:value===banner?1920:1280, naturalHeight:value===banner?367:720 }) },
  });
  assert.equal(await prepareAdImage(file,'LATEST_VIDEOS'),file);
  assert.equal(await prepareAdImage(banner,'LEADERBOARD'),banner);
  await assert.rejects(prepareAdImage(file,'LEADERBOARD'),/1280×720/);
  await assert.rejects(prepareAdImage({type:'image/png',size:5*1024*1024+1},'IN_FEED'),/5 MB/);
});
test('viewability requires loaded media, half visible, active tab and a continuous second', () => {
  let effect, intersection, onVisibility, timeout, cleanup, calls=0, observes=0;
  const doc = { hidden:false, addEventListener:(_name,fn)=>onVisibility=fn, removeEventListener:()=>{} };
  class Observer { constructor(fn) { intersection=fn; } observe(){ observes++; } disconnect(){} }
  const { useAdViewability } = load('src/features/ads/hooks/useAdViewability.ts', {
    react:{ useRef:value=>({current:value===null?{}:value}),useEffect:fn=>effect=fn },
    '@/shared/repositories/ads.repository':{recordAdImpression:()=>{ calls++; return Promise.resolve(); }},
  }, { document:doc, IntersectionObserver:Observer,setTimeout:fn=>(timeout=fn,1),clearTimeout:()=>timeout=undefined });
  useAdViewability('ad','image',false); effect(); assert.equal(observes,0);
  useAdViewability('ad','image',true); cleanup=effect();
  intersection([{isIntersecting:true,intersectionRatio:0.49}]); assert.equal(timeout,undefined);
  intersection([{isIntersecting:true,intersectionRatio:0.5}]); assert.equal(calls,0);
  doc.hidden=true; onVisibility(); assert.equal(timeout,undefined);
  doc.hidden=false; onVisibility(); timeout(); assert.equal(calls,1);
  intersection([{isIntersecting:true,intersectionRatio:1}]); assert.equal(timeout,undefined); cleanup();
});
