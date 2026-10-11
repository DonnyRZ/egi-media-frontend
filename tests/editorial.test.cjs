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
  vm.runInNewContext(compiled.outputText, { module, exports: module.exports, Date, Set,
    require(name) { if (!(name in imports)) throw new Error("Unexpected import: " + name); return imports[name]; },
  });
  return module.exports;
}
const { selectHomepageNews } = load("src/shared/utils/homepage-selection.ts");
const { HOMEPAGE_LIMITS, HOMEPAGE_PLACEMENTS } = load("src/shared/constants/homepage.constants.ts");
const make = (id, extra = {}) => ({ id: String(id), title: "Story " + id,
  publishedAt: new Date(Date.UTC(2026, 0, 1) - id * 1000).toISOString(), ...extra });
const select = (extra = {}) => selectHomepageNews({ heroes: [], headlines: [], latest: [], pool: [], ...extra });
const all = (result) => [result.hero.featured, ...result.hero.headlines, ...result.hero.latest, ...result.latest].filter(Boolean);

for (const count of [0, 1, 2, 3, 20]) {
  test("fallback with " + count + " published articles is bounded and unique", () => {
    const pool = Array.from({ length: count }, (_, i) => make(i));
    const before = JSON.stringify(pool);
    const result = select({ pool });
    const items = all(result);
    assert.equal(new Set(items.map(a => a.id)).size, items.length);
    assert.equal(items.length, Math.min(count, 18));
    assert.ok(result.hero.headlines.length <= 5);
    assert.ok(result.hero.latest.length <= 6);
    if (count >= 3) assert.ok(result.hero.headlines.length && result.hero.latest.length);
    assert.equal(JSON.stringify(pool), before);
  });
}
test("editorial Hero and Headline order win; overlapping tags never repeat", () => {
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
  assert.equal(new Set(all(result).map(a => a.id)).size, all(result).length);
});
test("non-published, missing dates and future dates never enter fallback", () => {
  const invalid = ["draft", "review", "scheduled", "archived"].map((status, i) => make(i, { status }));
  invalid.push(make(5, { publishedAt: null }), make(6, { publishedAt: "bad-date" }),
    make(7, { publishedAt: new Date(Date.now() + 100000).toISOString() }));
  assert.equal(all(select({ pool: invalid })).length, 0);
});

function repository(fetchArticles, fetchCategories = async () => ({ items: [] })) {
  return load("src/shared/repositories/homepage.repository.ts", {
    "@/shared/constants/homepage.constants": { HOMEPAGE_LIMITS, HOMEPAGE_PLACEMENTS },
    "@/shared/services/article.service": { fetchArticles },
    "@/shared/services/category.service": { fetchCategories },
    "@/shared/services/topic.service": { fetchTopics: async () => ({ items: [] }) },
    "@/shared/utils/unique-articles": { takeUniqueArticles: (items) => items },
    "@/shared/utils/homepage-selection": { selectHomepageNews },
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
test("video mounts as a poster; iframe is created only for requested playback", () => {
  const React = require("react");
  const { renderToStaticMarkup } = require("react-dom/server");
  const { VideoPoster } = load("src/features/videos/components/VideoPoster.tsx", {
    react: React, "react/jsx-runtime": require("react/jsx-runtime"),
    "next/image": { default: (props) => React.createElement("img", { src: props.src, alt: props.alt }) },
    "@/shared/constants/site.constants": { FALLBACK_VIDEO_THUMBNAIL: "/images/fallback-video.svg" },
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
