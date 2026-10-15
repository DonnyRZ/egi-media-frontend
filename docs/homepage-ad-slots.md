# Homepage advertisements

Three fixed slots, on `/id`, `/en`, `/uz` only:

| API placement | CMS location | Image | Homepage content |
| --- | --- | --- | --- |
| LEADERBOARD | Above header | 970×250 / 97:25 | Centered up to 970px on a light gray band; label above, aligned right |
| IN_FEED | Latest News | 1080×1080 / 1:1 | Five desktop articles / three compact articles, then ad |
| LATEST_VIDEOS | Latest Videos | 1080×1080 / 1:1 | Five desktop videos / three compact videos, then ad |

The three white reservations remain when inactive, empty or unavailable. Images use containment, including legacy creatives. Labels are localized. Mobile gutters are the shared symmetrical 12px safe-area gutters. The banner scrolls before the sticky header. Its frame is centered, capped at 970px, with a label above the image aligned right. Mobile uses the shared symmetric 12px safe-area gutters. Existing creatives retain their intrinsic ratio.

CMS selects a fixed slot, uploads the original creative (maximum 5 MiB), and saves its target URL and active state. Upload validates dimensions in browser and backend, within 0.5% relative ratio tolerance. Original bytes are preserved. Existing legacy assets remain editable without forcing re-upload. New images require a backend-signed metadata receipt; identical square creatives can be reused across the two content slots. The preview uses the public media component.

Image metadata is optional for legacy records. Normal article uploads retain their existing optimization. Slot refresh is every 60 seconds in an active tab and on focus/reconnect. Impressions require a loaded image, at least 50% visibility for a continuous second, and an active tab; placeholders do not count. The section uses a single ad instance across layout changes. Content ad cards size to their media and label and are centered vertically within their grid row. Equal image gutters and top/bottom padding keep the creative away from the cell edges. Legacy images retain their intrinsic ratio until replaced; newly uploaded content ads must be square.

QA fixtures remain local. The explicitly requested square test creative is provided at `/ads/samples/dummy-square-1080.png`, marked DUMMY / CONTOH, and can be selected through the regular CMS upload flow. Migration 034 initializes any missing fixed slot as empty/inactive and retains the legacy Sidebar record. CMS removal of the topbar New article shortcut is included in this release.
