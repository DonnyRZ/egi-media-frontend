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

Images still use `object-cover`: sources with other proportions are cropped
to fit their container. Upload optimization preserves source proportions.
Existing horizontal article thumbnails have their own 112×80 layout.
Portraits and the leaderboard/sidebar ad formats have separate dimensions.

No image files or stored article records are changed by this layout release.
