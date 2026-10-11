# Editorial layout release — 2026-10-11

## Scope

- Shared public cards and headings use Inter. News photos remain 16:9; article body photos keep their intrinsic proportions.
- Homepage: Headline / Hero / Video + Latest at 1200px; tablet and mobile reorder using CSS grid areas.
- The pure `selectHomepageNews` selector preserves editorial priority, fills from 20 published articles, and deduplicates lead, supporting stories, sidebar Latest and Latest continuation. Small catalogs reserve a Latest item when possible without displacing curated Headline slots.
- Source failures expose retry notices while other content remains available. Selection never writes placements.
- Video iframes mount only after playback is requested. A local poster background remains visible if the remote thumbnail is unavailable.
- CMS shows a placement diagram, explanations, Headline 1–5 controls and a homepage link. Save/upload/status/cache logic and database schema are unchanged.
- Homepage modules import together so delayed hydration cannot render cached data against a loading skeleton from another chunk.

## Local evidence

- Node 24 production build: passed (106 generated pages); TypeScript and ESLint passed.
- `node --test tests/editorial.test.cjs tests/image-upload.test.cjs`: 20 passed.
- Browser homepage: ID, EN, UZ × 320, 390, 768, 1024, 1366, 1920px; no horizontal document overflow, lead photo ratio 1.778. Long lead title, three-line summary and metadata fit the 1366×768 target.
- News/list/detail, categories/topics, series, columns, videos, search, Saved, For You, account, About and Professional checked at small mobile and desktop. Professional header wrapping and Uzbek section action wrapping were corrected.
- In-memory fixtures: 0/1/2/many articles, empty and overlapping placements, multiple Heroes, non-published/future dates, partial/complete API outage, missing photo, absent video. Ordering/exclusion cases have automated tests.
- Browser interactions: mobile menu, keyboard focus, search, second pagination page, save toggle, poster-to-iframe playback, scoped retry recovery, CMS placement selection and successful update feedback.
- Fresh browser tab against production-mode local build: no render errors.

## Reproduce safely

Run `node tests/editorial-fixture-server.cjs` on port 5099, then use `NEXT_PUBLIC_API_URL=http://localhost:5099` and `NEXT_PUBLIC_SITE_URL=http://localhost:3099` for the local app. The fixture holds writes only in memory and never connects to production. `/__fixture` accepts count, curated, videos, imageFailure and fail settings. The optional `EDITORIAL_FIXTURE_IMAGE` selects a local photo. Do not publish this local build; build separately on the VPS with its existing private environment.

## Production release

The user authorized production `main` deployment. The legacy `develop` staging workflow/timer is not used on this production-marked VPS. Fetch a clean fast-forward `main`, build a detached candidate with application Node 24, and back up the prior source revision, full `.next` tree and release metadata. Switch only the frontend service after the candidate build succeeds; retain old static assets. Readiness failures restore the previous revision/build/metadata. Backend, Crawl and production data are not modified. Production browser checks are read-only; upload/publish testing remains with the user.
