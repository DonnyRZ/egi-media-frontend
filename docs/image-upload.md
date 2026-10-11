# CMS image upload

Production releases use `main`; the public staging hostname currently serves production. The staging deploy script refuses to run when `/etc/egi-media/production` exists. Preserve production environment files, uploads and systemd restrictions when releasing.

## Upload behavior

- JPG, PNG, WebP and AVIF photos are optimized in the browser before upload. Large photos become WebP, with a maximum dimension of 1920 pixels and target size of 512 KiB. Smaller photos are preserved when already within these limits. The original local file is never changed.
- Source images are limited to 20 MiB and 40 megapixels. GIF animation and SVG vector content are preserved with a 5 MiB upload limit.
- Upload requests have a separate 120-second timeout; ordinary API requests retain their existing timeout.
- One automatic retry is allowed for transport timeouts, network errors and HTTP 502/503/504. The prepared payload is reused. The backend hashes file content so retries return the same object URL.
- Progress, cancellation and a manual retry are available. Closing the picker cancels pending work. Insert is disabled until a URL exists and no upload is pending. New URLs clear old validation errors.
- Network outages can still prevent a transfer. Failure is bounded and actionable; the selected image remains available for retry while the picker stays open.

## Verification

Run `npm ci`, `npm run test:upload`, and `npx tsc --noEmit`. Build with the production environment using `npm run build` before switching the running release. Verify the original 4,279,624-byte photo in a browser, the optimized file size, a public preview, cancellation and Insert state. Confirm backend upload and validation checks using its `npm run test:upload` script.

The focused automated suite covers optimization limits, progress, timeout mapping, cancellation, one bounded retry, validation failures and picker guards. Browser verification is also required because the tests use simulated canvas encoding.
