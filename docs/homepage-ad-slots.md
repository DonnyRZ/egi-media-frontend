# Homepage advertisements

Four fixed slots, on `/id`, `/en`, `/uz` only:

| API placement | CMS location | Image | Homepage content |
| --- | --- | --- | --- |
| LEADERBOARD | Above header | 970×250 / 97:25 | Centered up to 970px on a light gray band; label above, aligned right |
| HERO_BELOW | Below main story | 1280×720 / 16:9 | Below the hero metadata, centered inside its desktop column; full width after Featured Video on compact layouts |
| IN_FEED | Latest News | 1080×1080 / 1:1 | Five desktop articles / three compact articles, then ad |
| LATEST_VIDEOS | Latest Videos | 1080×1080 / 1:1 | Five desktop videos / three compact videos, then ad |

White reservations remain when inactive, empty or unavailable. Images use containment, including legacy creatives. Labels are localized. Mobile gutters are the shared symmetrical 12px safe-area gutters. The banner scrolls before the sticky header. Its frame is centered, capped at 970px, with a label above the image aligned right. Existing creatives retain their intrinsic ratio.

The hero placement mounts once, outside the article link, only in the homepage hero. It remains separate from category pages and the two square inventory slots. Desktop uses the same 560px outer maximum and 20px inset as the lead card, with vertical centering in the remaining column space. Compact layouts show Hero → Featured Video → Hero ad, using shared 12px safe-area gutters. When no video is available, the ad follows the hero. Named grid areas reposition a single ad instance; there are no duplicated mobile/desktop campaigns or hidden ad links. An absent hero does not create an orphaned ad. The CMS provides desktop/mobile previews and the normal upload, target URL, active state, cache invalidation, and per-placement tracking.

CMS selects a fixed slot, uploads the original creative (maximum 5 MiB), and saves its target URL and active state. Upload validates dimensions in browser and backend, within 0.5% relative ratio tolerance. Original bytes are preserved. Existing legacy assets remain editable without forcing re-upload. New images require a backend-signed metadata receipt; identical square creatives can be reused across the two content slots. The preview uses the public media component.

Image metadata is optional for legacy records. Normal article uploads retain their existing optimization. Slot refresh is every 60 seconds in an active tab and on focus/reconnect. Impressions require a loaded image, at least 50% visibility for a continuous second, and an active tab; placeholders do not count. The section uses a single ad instance across layout changes. Content ad cards size to their media and label and are centered vertically within their grid row. Equal image gutters and top/bottom padding keep the creative away from the cell edges. Legacy images retain their intrinsic ratio until replaced; newly uploaded content ads must be square.

QA fixtures remain local. The explicitly requested square test creative is provided at `/ads/samples/dummy-square-1080.png`, marked DUMMY / CONTOH, and can be selected through the regular CMS upload flow. Migration 034 initializes the original slots as empty/inactive and retains the legacy Sidebar record. Migration `035_homepage_hero_ad` adds the fourth placement empty/inactive, preserving every existing campaign and counter. Apply it with `node scripts/run-homepage-hero-ad-migration.js --expect-database=<exact database>` after migration 034. Its runner uses the existing checksum, advisory lock, and transaction convention. No sample campaign is seeded into production.
