# Homepage highlights

Utama/Pendamping are internal component names, without public headings. The section sits immediately between Latest News and Latest Videos. Desktop (1024px+, excluding the existing short-landscape compact rule) uses a manual center/peek carousel and an eight-item 2×4 photo/headline grid. Compact view uses up to three photo-above primary cards, each followed by up to three existing horizontal supporting cards. Unallocated supporting stories remain visible; empty primary does not hide supporting.

Data comes exclusively from `GET /api/v1/articles/homepage-highlights?lang=id|en|uz`; no filtering of the original homepage article pool. The backend selects Politics OR manual Trending for primary, and neither for supporting, by publication date. The service maps existing article DTOs to `HomepageHighlightsData`.

Query key: `['homepage','highlights',lang]`. Existing CMS homepage invalidation includes it. Polling is 60 seconds only while focused, with focus/reconnect refetch. Refresh errors retain cached articles and expose a local retry. Display snapshot updates are deferred during focus/gestures; carousel selection is stored by article ID. First successful load is accepted even while retry has focus, and a removed retry button cannot permanently lock updates.

Components reuse ArticleCard, HorizontalArticleCard, media metadata, FrameModule/FrameHeading and Skeleton/ErrorState. PrimaryCarousel and its manual gesture controller are separate from Video/Series scrollers. Decorative side copies are inert/aria-hidden. Mobile package allocation is pure and does not mutate fetched data.

Development-only visual route: `/id/editorial-preview?template=highlights`. Options: `primaryCount=0..3`, `supportingCount=0..9`, `textScale=1.25|1.5|2`, `longMeta=1`, `brokenImage=1`, `spacing=1`. EN/UZ routes use the same fixtures and labels.

Regression commands:

```powershell
node --test tests/homepage-highlights.test.cjs tests/highlights-refresh.test.cjs tests/editorial.test.cjs tests/mobile-reading.test.cjs tests/horizontal-media.test.cjs tests/image-upload.test.cjs
npx eslint src next.config.ts tests/homepage-highlights.test.cjs tests/highlights-refresh.test.cjs
npx tsc --noEmit
```

Local screenshot/check report is under `C:\IT\egi-media\ops\design-audit\homepage-highlights-20261013`. Release status is recorded in the production release report.
