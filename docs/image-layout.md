# Image layout

Article, column, series and Crawl feed cards use `aspect-[16/9]`.
Their loading skeletons use the same ratio to reserve the final image space.
In-feed ads also use 16:9; the CMS guideline recommends 800×450 pixels.

The article hero has no maximum height that overrides its aspect ratio.
The series detail cover uses `self-start` so a longer adjacent text column
cannot stretch its image container. In-feed ad image containers use `shrink-0`
to preserve their ratio within the card's flex layout.

CMS featured image and media previews use 16:9 to match publication.
News, column, series, Crawl card and video thumbnail images do not zoom on
hover, so a 16:9 source keeps its full frame in a 16:9 container.

News images use containment: sources with other proportions retain their
complete frame. Upload optimization preserves source proportions.
Horizontal article thumbnails use a 16:9 grid cell with a separate text cell.
Portraits and the leaderboard/sidebar ad formats have separate dimensions.

No image files or stored article records are changed by this layout release.

## Horizontal media rows

`HorizontalMediaRow` owns the two columns used by category supporting stories,
related articles, topic news, timeline/search rows, opinion rows and video playlists.
Media and all text have separate grid tracks; headlines never flow beneath media.
Compact headlines are 0.8125rem (13px at normal settings), with 0.625rem (10px)
metadata. The compact scale applies below 1024px and short landscape viewports,
and to narrow desktop rails below 480px. There is no article-specific sizing,
clamping, word-count breakpoint or auto-shrinking font.

`useBalancedMediaRow` compares a bounded set of image widths against the height
of the rendered copy. Short copy can use a slightly wider photo; longer copy
uses the candidate with the least height imbalance. Resize, translated content,
font loading and enlarged user text trigger a fresh measurement. CSS provides
a safe two-column layout before hydration or without JavaScript. Extreme titles
and enlarged text remain complete even when the row naturally becomes taller.

Existing image-right timelines/opinion rows retain their direction. Featured
stories retain their separate lead hierarchy. Program posters remain 2:3 and
Shorts remain 9:16. Public styling does not affect the CMS editor.

`ContentMetadata` keeps each author/date/duration item together with its separator.
Unknown reading time from older API responses is omitted; the updated backend
provides optional `reading_time_minutes` from the complete localized content,
never from a card summary. No schema or content migration is required.

Development preview: `/id/editorial-preview?template=horizontal` (also EN/UZ).
Append `baseline=1` for the former layout with identical fixture data, or
`textScale=1.25|1.5|2` and `spacing=1` for accessibility checks. This route is
unavailable in production. Fixtures contain no production writes.
