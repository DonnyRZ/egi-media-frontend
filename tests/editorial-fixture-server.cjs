/* eslint-disable @typescript-eslint/no-require-imports */
// Local-only, in-memory QA API. Never forwards requests or connects to a database.
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const state = { count: 20, fail: "", videos: true, curated: true, imageFailure: false, writes: [] };
const origin = "http://localhost:5099";
const date = "2026-01-01T12:00:00Z";
const user = { id: "qa-user", email: "qa@example.test", full_name: "Local QA", role: "superadmin", email_verified_at: date };
const category = { id: "qa-category", name: "Bisnis", slug: "business", description: "Liputan bisnis dan ekonomi.", available_locales: ["id", "en", "uz"] };
const topic = { id: "qa-topic", name: "Teknologi", slug: "technology", category_id: category.id, category, description: "Analisis teknologi.", available_locales: ["id", "en", "uz"] };
const series = { id: "qa-series", name: "Ekonomi Masa Depan", slug: "future-economy", description: "Liputan mendalam ekonomi.", image: origin + "/fixture.png", article_count: 20, created_at: date, topic_id: topic.id, topic };
const headlines = {
  id: ["Sentuhan Techno Craft dan Regenerasi Kriya: INACRAFT October 2026 Resmi Dibuka di JICC", "Indonesia Memperkuat Industri Kreatif dan Peluang Ekspor", "Teknologi Membuka Akses Baru bagi Pelaku Usaha", "Pasar Asia Menimbang Prospek Pertumbuhan Ekonomi"],
  en: ["Techno Craft and a New Generation: INACRAFT October 2026 Opens at JICC", "Indonesia Strengthens Creative Industries and Export Opportunities", "Technology Opens New Opportunities for Local Businesses", "Asian Markets Assess the Outlook for Economic Growth"],
  uz: ["Techno Craft va yangi avlod: INACRAFT October 2026 JICC markazida ochildi", "Indoneziya ijodiy sanoat va eksport imkoniyatlarini kengaytirmoqda", "Texnologiyalar mahalliy tadbirkorlar uchun yangi imkoniyatlar yaratadi", "Osiyo bozorlari iqtisodiy o‘sish istiqbollarini baholamoqda"],
};
function articles(lang = "id") {
  return Array.from({ length: state.count }, (_, index) => ({
    id: "qa-" + index, title: headlines[lang][index % 4] + (index > 3 ? " · " + index : ""),
    slug: "story-" + index, summary: { id: "Pameran mempertemukan kerajinan tradisional, teknologi, dan kreativitas generasi muda. Pelaku industri melihat peluang baru untuk memperluas pasar Indonesia.", en: "The exhibition brings together traditional crafts, technology, and a new generation of creative entrepreneurs, opening fresh opportunities in global markets.", uz: "Ko‘rgazma an’anaviy hunarmandchilik, texnologiya va yosh avlod ijodkorligini birlashtiradi. Tadbirkorlar yangi bozorlarga chiqish imkoniyatlarini ko‘rmoqda." }[lang],
    content: "<p>Konten lokal untuk pemeriksaan desain. Tidak disimpan ke production.</p><h2>Konteks dan analisis</h2><p>Paragraf kedua untuk memeriksa tata baca, tautan, dan layout artikel.</p>",
    featured_image: state.imageFailure ? origin + "/missing.png" : origin + "/fixture.png",
    published_at: new Date(Date.parse(date) - index * 60000).toISOString(),
    created_at: date, author: user, category, series, topics: [topic], tags: [],
    status: "published", translation_status: "ready", locale: lang,
    available_locales: ["id", "en", "uz"], headline_position: index > 0 && index < 6 ? index : null,
    placements: state.curated ? index === 0 ? ["homepage_hero", "latest_news"] : index < 6 ? ["headline", "latest_news"] : ["latest_news", "trending"] : [],
    view_count: 1, share_count: 0,
  }));
}
function respond(res, data, meta) {
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ success: true, code: 200, data, ...(meta ? { meta } : {}) }));
}
function paged(items, params) {
  const page = Number(params.get("page") || 1), limit = Number(params.get("limit") || 12);
  return { items: items.slice((page - 1) * limit, page * limit),
    meta: { total: items.length, page, limit, total_pages: Math.ceil(items.length / limit) } };
}
function handleGet(url, res) {
  const route = url.pathname;
  const params = url.searchParams;
  const lang = ["id", "en", "uz"].includes(params.get("lang")) ? params.get("lang") : "id";
  const list = articles(lang);
  if (route === "/__fixture") {
    for (const key of ["count", "fail", "videos", "curated", "imageFailure"]) {
      if (params.has(key)) state[key] = key === "count" ? Number(params.get(key)) : key === "fail" ? params.get(key) : params.get(key) === "true";
    }
    return respond(res, state);
  }
  if (route === "/fixture.png") {
    const photo = process.env.EDITORIAL_FIXTURE_IMAGE;
    res.setHeader("Content-Type", photo ? "image/png" : "image/svg+xml");
    return res.end(fs.readFileSync(photo || path.join(__dirname, "../public/images/fallback-article.svg")));
  }
  if (state.fail && (state.fail === "all" || params.get("placement") === state.fail)) {
    res.statusCode = 503; return res.end(JSON.stringify({ success: false, message: "Local fixture unavailable" }));
  }
  if (route.endsWith("/articles/saved")) return respond(res, paged(list.slice(0, 4), params));
  if (route.endsWith("/articles") || route.endsWith("/articles/manage") || route.endsWith("/articles/me") || route.endsWith("/articles/personalized")) {
    const placement = params.get("placement");
    return respond(res, paged(placement ? list.filter(item => item.placements.includes(placement)) : list, params));
  }
  if (route.includes("/articles/") && !route.endsWith("/saved")) {
    return respond(res, list.find(item => route.endsWith(item.id) || route.endsWith(item.slug)) || list[0]);
  }
  if (route.includes("/categories")) return route.endsWith("/categories") ? respond(res, [category], { total: 1 }) : respond(res, { ...category, locale: lang });
  if (route.includes("/topics") && !route.includes("/users")) return route.endsWith("/topics") || route.endsWith("/catalog") ? respond(res, [topic], { total: 1 }) : respond(res, { ...topic, locale: lang });
  if (route.includes("/series")) return route.endsWith("/series") ? respond(res, [series], { total: 1 }) : respond(res, { ...series, articles: list });
  if (route.includes("/youtube-videos")) {
    const videos = paged(state.videos ? [{ id: "qa-video", title: "Industri Kreatif Membuka Peluang Baru", description: "Video fixture", url: "https://www.youtube.com/watch?v=jfKfPfyJRdk", duration: "8:26", created_at: date }] : [], params);
    return respond(res, videos.items, videos.meta);
  }
  if (route.includes("/columns") && !route.endsWith("/comments")) return route.endsWith("/columns") || route.endsWith("/saved") || route.endsWith("/me") ? respond(res, paged(list.slice(0, 5), params)) : respond(res, list[0]);
  if (route.includes("/auth/me") || route.includes("/users/me")) return respond(res, user);
  if (route.includes("/saved-articles")) return respond(res, paged(list.slice(0, 4), params));
  if (route.includes("/unread-count")) return respond(res, { unread_count: 0 });
  return respond(res, [], { total: 0 });
}
http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3099");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  if (req.method === "OPTIONS") return res.end();
  const url = new URL(req.url, origin);
  if (req.method === "GET") return handleGet(url, res);
  let body = "";
  req.on("data", chunk => body += chunk);
  req.on("end", () => {
    state.writes.push({ path: url.pathname, method: req.method, body });
    if (url.pathname.endsWith("/login")) return respond(res, { access_token: "local-fixture-access", refresh_token: "local-fixture-refresh", token_type: "Bearer", expires_in: 3600 });
    respond(res, { id: "qa-0", view_count: 1, share_count: 0 });
  });
}).listen(5099, "127.0.0.1", () => console.log("Local fixture API on 5099"));
