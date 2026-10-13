/* eslint-disable @typescript-eslint/no-require-imports */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const ts = require('typescript');
const source = fs.readFileSync(path.join(__dirname,'../src/features/homepage/utils/highlight-packages.ts'),'utf8');
const moduleCopy = {exports:{}};
vm.runInNewContext(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText, {module:moduleCopy,exports:moduleCopy.exports});
const {buildHighlightPackages} = moduleCopy.exports;
const data = (p,s) => ({primary:Array.from({length:p},(_,i)=>({id:'p'+i})),supporting:Array.from({length:s},(_,i)=>({id:'s'+i}))});

test('every sparse combination preserves all supporting stories, order and uniqueness', () => {
  for(let p=0;p<=3;p++)for(let s=0;s<=9;s++) {
    const input=data(p,s),result=buildHighlightPackages(input);
    assert.equal(result.packages.length,p);
    const all=[...result.packages.flatMap(pack=>pack.supporting),...result.remaining].map(item=>item.id);
    assert.equal(JSON.stringify(all),JSON.stringify(input.supporting.map(item=>item.id)));
    assert.equal(new Set(all).size,s);
    for(const pack of result.packages)assert.ok(pack.supporting.length<=3);
    const counts=result.packages.map(pack=>pack.supporting.length);
    if(counts.length)assert.ok(Math.max(...counts)-Math.min(...counts)<=1);
  }
});
test('three primary and four supporting become 2–1–1; complete data becomes 3–3–3', () => {
  assert.equal(JSON.stringify(buildHighlightPackages(data(3,4)).packages.map(pack=>pack.supporting.length)), '[2,1,1]');
  assert.equal(JSON.stringify(buildHighlightPackages(data(3,9)).packages.map(pack=>pack.supporting.length)), '[3,3,3]');
  assert.equal(buildHighlightPackages(data(1,9)).remaining.length,6);
});
test('query keys, refresh policy and page integration remain independent of the original feed', () => {
  const read=file=>fs.readFileSync(path.join(__dirname,'..',file),'utf8');
  const hook=read('src/features/homepage/hooks/useHomepageHighlights.ts');
  assert.match(hook,/refetchInterval: 60_000/); assert.match(hook,/refetchIntervalInBackground: false/);
  assert.match(hook,/refetchOnWindowFocus: "always"/); assert.match(hook,/refetchOnReconnect: "always"/);
  const page=read('src/app/[locale]/page.tsx');
  assert.match(page,/<LatestNewsSection\s*\/>\s*<HomepageHighlightsSection\s*\/>\s*<FeaturedVideosSection\s*\/>/);
});
