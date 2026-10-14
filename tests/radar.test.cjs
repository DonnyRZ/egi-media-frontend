const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const ts=require('typescript');
const React=require('react');
const {renderToStaticMarkup}=require('react-dom/server');
const cache=new Map();let requests=[];let response;
const client={get:async(url,options)=>{requests.push({url,options});return response;}};
function load(name) {
  if(name==='@/shared/lib/axios-client')return {axiosClient:client};
  if(!name.startsWith('@/'))return require(name);
  if(cache.has(name))return cache.get(name);
  const base=path.join(__dirname,'../src',name.slice(2));const file=fs.existsSync(base+'.ts')?base+'.ts':base+'.tsx';
  const output=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022}}).outputText;
  const module={exports:{}};new Function('require','module','exports',output)(load,module,module.exports);cache.set(name,module.exports);return module.exports;
}
test('recommendation service preserves filters, pagination and health metadata',async()=>{
  response={data:{success:true,data:{items:[{id:'radar-test',title:'Full headline',score:72.5,groupCount:3,components:{breadth:.8,momentum:.4,freshness:.9},angles:[],reasons:['3 independent sources']}],page:3,total:45,total_pages:3,meta:{availability:'degraded',asOf:'2026-10-14T12:00:00Z',runId:'42'}}}};
  const service=load('@/features/cms/services/viral-issue.service');requests=[];
  const data=await service.fetchViralIssues(24,{page:3,search:'BNPB',category:'politics',trend:'rising',candidate:true});
  assert.equal(requests[0].url,'/api/v1/news-feed/recommendations');assert.equal(requests[0].options.params.engine,'candidate');assert.equal(requests[0].options.params.search,'BNPB');
  assert.equal(data.total,45);assert.equal(data.totalPages,3);assert.equal(data.meta.availability,'degraded');assert.equal(data.items[0].score,72.5);
});
test('drawer detail pins its snapshot and keeps listing-only evidence',async()=>{
  response={data:{success:true,data:{item:{id:'radar-test',title:'Full headline',articles:[{id:'one',title:'Story',url:'https://news.test/x',evidenceQuality:'listing_only'}]},page:2,total:30,total_pages:2}}};
  const service=load('@/features/cms/services/viral-issue.service');requests=[];
  const data=await service.fetchRadarDetail('radar-test',24,2,'42');assert.equal(requests[0].options.params.run_id,'42');assert.equal(data.item.articles[0].evidenceQuality,'listing_only');
});
test('API failure preserves the actual error message',async()=>{
  response={data:{success:false,message:'Source database unavailable'}};
  await assert.rejects(load('@/features/cms/services/viral-issue.service').fetchViralIssues(),/Source database unavailable/);
});
test('recommendation list renders full headline, ranking offset and evidence context',()=>{
  const {ViralIssuesList}=load('@/features/cms/components/news-feed/ViralIssuesList');
  const title='A very long headline whose final words must remain visible to the editor';
  const html=renderToStaticMarkup(React.createElement(ViralIssuesList,{issues:[{id:'one',title,mediaCount:3,articleCount:4,score:71.3,groupCount:2,reasons:['Evidence reason'],firstSeenAt:'',lastDevelopedAt:'',summary:'',timeline:[],articles:[]}],selectedId:null,onSelect:()=>{},rankOffset:20}));
  assert(html.includes(title));assert(html.includes('21'));assert(html.includes('Evidence reason'));assert(!html.includes('truncate'));
});
