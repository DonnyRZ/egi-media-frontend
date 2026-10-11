# Browser tab icon

The public locale layout and CMS root layout both declare `SITE_ICONS` through
Next.js metadata. These are separate HTML roots, so both must include the icon.

The asset is an unchanged copy of EGI Media Brief's 512×512 PNG brand mark:
`egi-media-brief/frontend/assets/brand/egi-media-mark.png`.

- Frontend asset: `public/images/egi-media-mark.png`.
- SHA-256: D39AA1619F0E25247B90CCBA07DB0CBAA8D9B22848E2DC157F103E9B355B9242.
- Browser URL: `/images/egi-media-mark.png?v=d39aa161`.

Both icon and shortcut icon links use this root-relative, versioned URL so nested
article/CMS routes resolve the asset and a revised asset can refresh browser
favicon caches. Update the version suffix when replacing the brand mark.
