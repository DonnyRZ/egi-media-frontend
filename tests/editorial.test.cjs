/* eslint-disable @typescript-eslint/no-require-imports, @next/next/no-assign-module-variable */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

function load(file, imports = {}) {
  const source = fs.readFileSync(path.join(__dirname, "..", file), "utf8");
  const compiled = ts.transpileModule(source, { compilerOptions: {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX,
  } });
  const module = { exports: {} };
  vm.runInNewContext(compiled.outputText, { module, exports: module.exports, Date, Set, Map, URL,
    require(name) { if (!(name in imports)) throw new Error("Unexpected import: " + name); return imports[name]; },
  });
  return module.exports;
}
const { selectHomepageNews, selectTrendingNews } = load("src/shared/utils/homepage-selection.ts");
const { selectCategoryPackage } = load("src/shared/utils/category-selection.ts");
const { extractYoutubeId } = load("src/shared/utils/format.ts");
const { optionalNumber } = load("src/features/cms/utils/optional-number.ts");
const {safeImageSource}=load("src/shared/utils/safe-image.ts",{"@/shared/constants/site.constants":{FALLBACK_ARTICLE_IMAGE:"/fallback.svg"}});
test("broken and unsupported image sources have a safe local fallback",()=>{
  for(const src of [null,"ftp://example.invalid/photo.png","javascript:alert(1)","not a URL","https://user:pass@example.invalid/a.png"])assert.equal(safeImageSource(src),"/fallback.svg");
  for(const src of ["/images/photo.png","https://example.invalid/a.png","http://example.invalid/a.png"])assert.equal(safeImageSource(src),src);
});
test("empty optional video fields stay null and entered numbers remain numeric", () => {
  for(const value of ["",null,undefined]) assert.equal(optionalNumber(value),null);
  assert.equal(optionalNumber("45"),45);assert.equal(optionalNumber(1),1);
});
test("category selection fills failed pins, keeps scope and never mutates the pool", () => {
  const pool=Array.from({length:20},(_,i)=>make(i,{category:{id:"desk"}}));
  const before=JSON.stringify(pool);
  const config={lead_id:"missing",supporting_ids:["missing","2","2"],editor_ids:["3","3"]};
  const selected=[make(24,{category:{id:"wrong"}}),make(25,{category:{id:"desk"},status:"draft"})];
  const out=selectCategoryPackage("desk",pool,selected,config);
  assert.equal(out.lead.id,"0");assert.equal(out.supporting.length,5);
  assert.equal(out.supporting[0].id,"2");assert.equal(out.editors.length,1);
  assert.deepEqual(out.latest.map(a=>a.id),["0","1","2","3","4","5"]);
  assert.equal(out.rest.length,14);
  assert.equal(JSON.stringify(pool),before);
});
test("frontend YouTube parser accepts supported URL forms and rejects spoofed hosts", () => {
  for(const url of ["https://youtu.be/dQw4w9WgXcQ?t=1","https://youtube.com/watch?feature=share&v=dQw4w9WgXcQ","https://youtube.com/shorts/dQw4w9WgXcQ","https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"])assert.equal(extractYoutubeId(url),"dQw4w9WgXcQ");
  for(const url of ["https://youtube.com.evil.invalid/watch?v=dQw4w9WgXcQ","javascript:alert(1)","https://user:pass@youtube.com/watch?v=dQw4w9WgXcQ"])assert.equal(extractYoutubeId(url),null);
});
const { HOMEPAGE_LIMITS, HOMEPAGE_PLACEMENTS } = load("src/shared/constants/homepage.constants.ts");
const make = (id, extra = {}) => ({ id: String(id), title: "Story " + id,
  publishedAt: new Date(Date.UTC(2026, 0, 1) - id * 1000).toISOString(), ...extra });
const select = (extra = {}) => selectHomepageNews({ heroes: [], headlines: [], latest: [], pool: [], ...extra });
const openingPackage = (result) => [result.hero.featured, ...result.hero.headlines, ...result.hero.latest].filter(Boolean);

for (const count of [0, 1, 2, 3, 5, 20]) {
  test("fallback with " + count + " published articles keeps the opening package unique and fills Latest News", () => {
    const pool = Array.from({ length: count }, (_, i) => make(i));
    const before = JSON.stringify(pool);
    const result = select({ pool });
    const opening = openingPackage(result);
    assert.equal(new Set(opening.map(a => a.id)).size, opening.length);
    assert.equal(opening.length, Math.min(count, 12));
    assert.equal(result.latest.length, Math.min(count, 6));
    assert.equal(new Set(result.latest.map(a => a.id)).size, result.latest.length);
    if (count) assert.equal(result.latest[0].id, result.hero.featured.id);
    assert.ok(result.hero.headlines.length <= 5);
    assert.ok(result.hero.latest.length <= 6);
    if (count >= 3) assert.ok(result.hero.headlines.length && result.hero.latest.length);
    assert.equal(JSON.stringify(pool), before);
  });
}
test("editorial Hero and Headline order win while Latest News stays chronological", () => {
  const oldHero = make(100);
  const newHero = make(50);
  const first = make(80, { headlinePosition: 1 });
  const second = make(81, { headlinePosition: 2 });
  const result = select({ heroes: [oldHero, newHero], headlines: [second, newHero, first],
    latest: [first, second, newHero, make(90)], pool: Array.from({ length: 20 }, (_, i) => make(i)) });
  assert.equal(result.hero.featured.id, newHero.id);
  assert.equal(result.hero.headlines[0].id, first.id);
  assert.equal(result.hero.headlines[1].id, second.id);
  assert.equal(result.hero.latest[0].id, "90");
  assert.equal(result.latest.map(a => a.id).join(","), "0,1,2,3,4,5");
  assert.equal(new Set(openingPackage(result).map(a => a.id)).size, openingPackage(result).length);
});
test("non-published, missing dates and future dates never enter fallback", () => {
  const invalid = ["draft", "review", "scheduled", "archived"].map((status, i) => make(i, { status }));
  invalid.push(make(5, { publishedAt: null }), make(6, { publishedAt: "bad-date" }),
    make(7, { publishedAt: new Date(Date.now() + 100000).toISOString() }));
  const result = select({ pool: invalid });
  assert.equal(openingPackage(result).length, 0);
  assert.equal(result.latest.length, 0);
});

function repository(fetchArticles, fetchCategories = async () => ({ items: [] })) {
  return load("src/shared/repositories/homepage.repository.ts", {
    "@/shared/constants/homepage.constants": { HOMEPAGE_LIMITS, HOMEPAGE_PLACEMENTS },
    "@/shared/services/article.service": { fetchArticles },
    "@/shared/services/category.service": { fetchCategories },
    "@/shared/services/topic.service": { fetchTopics: async () => ({ items: [] }) },
    "@/shared/utils/unique-articles": { takeUniqueArticles: (items) => items },
    "@/shared/utils/homepage-selection": { selectHomepageNews, selectTrendingNews },
  });
}
test("partial API failures retain fallback and expose retry, without writes", async () => {
  const calls = [];
  const { getHomepageNews } = repository(async (params) => {
    calls.push(params);
    if (params.placement) throw new Error("offline");
    return { items: Array.from({ length: 20 }, (_, i) => make(i)), total: 20 };
  }, async () => { throw new Error("taxonomy offline"); });
  const result = await getHomepageNews("uz");
  assert.ok(result.hero.featured);
  assert.ok(result.failedSections.includes("hero"));
  assert.ok(result.failedSections.includes("latest"));
  assert.ok(result.failedSections.includes("categories"));
  assert.ok(calls.every(call => call.lang === "uz"));
  assert.ok(calls.some(call => !call.placement && call.sort === "latest" && call.limit === 20));
});
test("complete article API outage is distinguishable from an empty catalog", async () => {
  const failed = await repository(async () => { throw new Error("offline"); }).getHomepageNews();
  const empty = await repository(async () => ({ items: [], total: 0 })).getHomepageNews();
  assert.equal(failed.hero.featured, null);
  assert.ok(failed.failedSections.length);
  assert.equal(empty.failedSections.length, 0);
});
test("Trending is manual, chronological, unique and excludes non-published stories", async () => {
  const tagged = [make(8), make(2), make(2), make(1, { status: "draft" }), make(4)];
  const before = JSON.stringify(tagged);
  assert.equal(selectTrendingNews(tagged).map(a => a.id).join(","), "2,4,8");
  assert.equal(JSON.stringify(tagged), before);
  const calls = [];
  const result = await repository(async params => {
    calls.push(params);
    return { items: params.placement === "trending" ? tagged : [make(0)], total: 1 };
  }).getHomepageNews();
  assert.equal(result.breaking.map(a => a.id).join(","), "2,4,8");
  assert.ok(!calls.some(params => params.sort === "popular"));
});
test("empty Trending never borrows from latest published articles", async () => {
  const result = await repository(async params => ({
    items: params.placement === "trending" ? [] : [make(0)], total: 1,
  })).getHomepageNews();
  assert.equal(result.breaking.length, 0);
  assert.equal(result.latest.length, 1);
});
test("video mounts as a poster; iframe is created only for requested playback", () => {
  const React = require("react");
  const { renderToStaticMarkup } = require("react-dom/server");
  const { VideoPoster } = load("src/features/videos/components/VideoPoster.tsx", {
    react: React, "react/jsx-runtime": require("react/jsx-runtime"),
    "next/image": { default: (props) => React.createElement("img", { src: props.src, alt: props.alt }) },
    "@/shared/constants/site.constants": { FALLBACK_VIDEO_THUMBNAIL: "/images/fallback-video.svg" },
    "@/features/videos/components/VideoThumbnail": { VideoThumbnail: ({ video, alt }) => React.createElement("img", { src: video.thumbnailUrl || "/images/fallback-video.svg", alt }) },
    "@/shared/lib/cn": { cn: (...values) => values.filter(Boolean).join(" ") },
  });
  const { VideoEmbed } = load("src/features/videos/components/VideoEmbed.tsx", {
    react: React, "react/jsx-runtime": require("react/jsx-runtime"),
    "next-intl": { useTranslations: () => key => key },
    "@/features/videos/components/VideoPoster": { VideoPoster },
    "@/shared/utils/format": { getYoutubeEmbedUrl: () => "https://www.youtube.com/embed/test" },
    "@/shared/lib/cn": { cn: (...values) => values.filter(Boolean).join(" ") },
  });
  const video = { id: "v1", title: "Video", url: "https://www.youtube.com/watch?v=test", thumbnailUrl: null };
  const poster = renderToStaticMarkup(React.createElement(VideoEmbed, { video }));
  assert.match(poster, /<button/);
  assert.doesNotMatch(poster, /<iframe/);
  const playing = renderToStaticMarkup(React.createElement(VideoEmbed, { video, autoplay: true }));
  assert.match(playing, /<iframe/);
  assert.match(playing, /autoplay=1/);
});
