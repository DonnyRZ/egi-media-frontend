/* eslint-disable @typescript-eslint/no-require-imports, react-hooks/rules-of-hooks */
// Hooks run inside an isolated deterministic React-state harness, not UI components.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const path = require('node:path');

function hook(file, imports) {
  const source=fs.readFileSync(path.join(__dirname,'..',file),'utf8');
  const moduleCopy={exports:{}};
  vm.runInNewContext(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,
    {module:moduleCopy,exports:moduleCopy.exports,require:name=>imports[name],setTimeout,clearTimeout,Date});
  return moduleCopy.exports;
}

function renderer() {
  const slots=[]; let cursor=0;
  return {reset:()=>{cursor=0;},react:{
    useState(initial) { const index=cursor++; if(!slots[index])slots[index]={value:initial}; return [slots[index].value,value=>{slots[index].value=value;}]; },
    useRef(initial) { const index=cursor++; return slots[index]??(slots[index]={current:initial}); },
    useEffect() {},
  }};
}

test('snapshot defers refresh while focused or gesturing and releases latest data afterwards', () => {
  const render=renderer();
  const {useHighlightSnapshot}=hook('src/features/homepage/hooks/useHighlightSnapshot.ts',{react:render.react});
  const a={primary:[{id:'a'}],supporting:[]}, b={primary:[{id:'b'}],supporting:[]};
  const run=data=>{render.reset();let out=useHighlightSnapshot(data);render.reset();out=useHighlightSnapshot(data);return out;};
  let out=run(a);out.setFocused(true);out=run(b);assert.equal(out.snapshot,a);
  out.setFocused(false);out=run(b);assert.equal(out.snapshot,b);
  out.gesture();out=run(a);assert.equal(out.snapshot,b);
  out.endGesture();assert.equal(run(a).snapshot,a);
});

test('first successful response is accepted even when its retry button held focus', () => {
  const render=renderer();
  const {useHighlightSnapshot}=hook('src/features/homepage/hooks/useHighlightSnapshot.ts',{react:render.react});
  render.reset();const initial=useHighlightSnapshot(undefined);initial.setFocused(true);
  const data={primary:[{id:'a'}],supporting:[]};
  render.reset();useHighlightSnapshot(data);render.reset();assert.equal(useHighlightSnapshot(data).snapshot,data);
});

test('carousel retains active ID through reorder and selects newest when removed', () => {
  const render=renderer();
  const {usePrimaryCarousel}=hook('src/features/homepage/hooks/usePrimaryCarousel.ts',{react:render.react});
  const a=[{id:'a'},{id:'b'},{id:'c'}];
  const run=data=>{render.reset();usePrimaryCarousel(data);render.reset();return usePrimaryCarousel(data);};
  let out=run(a);out.move(1);assert.equal(run(a).index,1);
  assert.equal(run([a[1],a[0],a[2]]).index,0);
  assert.equal(run([{id:'new'},a[0],a[2]]).index,0);
  out=run(a);out.move(-1);assert.equal(run(a).index,2);
  out=run(a.slice(0,2));out.move(-1);assert.equal(run(a.slice(0,2)).index,0);
});

test('trackpad accumulates small horizontal deltas and swiping suppresses article navigation', () => {
  const render=renderer(),moves=[];
  const {useCarouselGestures}=hook('src/features/homepage/hooks/useCarouselGestures.ts',{react:render.react});
  const events=useCarouselGestures(direction=>moves.push(direction));
  events.onWheel({deltaX:2,deltaY:20});assert.equal(moves.length,0);
  for(let i=0;i<8;i++)events.onWheel({deltaX:5,deltaY:0});assert.equal(moves[0],1);
  events.onPointerDown({clientX:200,clientY:100});events.onPointerUp({clientX:100,clientY:110});
  assert.equal(moves[1],1);let prevented=false;
  events.onClickCapture({preventDefault:()=>prevented=true,stopPropagation:()=>{}});assert.equal(prevented,true);
  prevented=false;events.onPointerDown({clientX:100,clientY:100});events.onPointerUp({clientX:102,clientY:102});
  events.onClickCapture({preventDefault:()=>prevented=true,stopPropagation:()=>{}});assert.equal(prevented,false);
});

test('query refreshes at 60 seconds, pauses while unfocused, retains data on error and refetches on focus/reconnect', async t => {
  // Query Core evaluates isServer once. This isolated test process models its
  // browser environment, without controlling or modifying a real browser.
  global.window={};
  const {QueryClient,QueryObserver,focusManager,onlineManager}=require('@tanstack/query-core');
  let requests=0,fail=false;
  const service={fetchHomepageHighlights:async()=>{requests++;if(fail)throw new Error('offline');return {primary:[{id:'a'}],supporting:[]};}};
  const {useHomepageHighlights}=hook('src/features/homepage/hooks/useHomepageHighlights.ts',{
    'next-intl':{useLocale:()=> 'id'},'@tanstack/react-query':{useQuery:options=>options},
    '@/shared/constants/query-keys.constants':{QUERY_KEYS:{homepage:{highlights:lang=>['homepage','highlights',lang]}}},
    '@/shared/services/homepage-highlights.service':service,'@/shared/utils/locale':{toContentLocale:value=>value},
  });
  focusManager.setEventListener(()=>undefined);onlineManager.setEventListener(()=>undefined);
  focusManager.setFocused(true);onlineManager.setOnline(true);
  const client=new QueryClient({defaultOptions:{queries:{retry:false,gcTime:Infinity}}});client.mount();
  t.mock.timers.enable({apis:['setTimeout','setInterval','Date']});
  const observer=new QueryObserver(client,useHomepageHighlights());const unsubscribe=observer.subscribe(()=>{});
  const flush=async()=>{for(let i=0;i<12;i++)await Promise.resolve();};
  try {
    await flush();assert.equal(requests,1);
    t.mock.timers.tick(59999);await flush();assert.equal(requests,1);
    t.mock.timers.tick(1);await flush();assert.equal(requests,2);
    focusManager.setFocused(false);t.mock.timers.tick(120000);await flush();assert.equal(requests,2);
    focusManager.setFocused(true);await flush();assert.equal(requests,3);
    fail=true;t.mock.timers.tick(60000);await flush();assert.equal(observer.getCurrentResult().isError,true);
    assert.equal(observer.getCurrentResult().data.primary[0].id,'a');
    fail=false;onlineManager.setOnline(false);onlineManager.setOnline(true);await flush();assert.equal(observer.getCurrentResult().isError,false);
  } finally {unsubscribe();client.unmount();client.clear();t.mock.timers.reset();delete global.window;}
});
