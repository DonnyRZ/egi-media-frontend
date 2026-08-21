# Staging Deploy — EGI Media Frontend

Staging URL: https://staging.egi-media.com/  
VPS path: `/var/www/egi-media/cms/frontend`  
Process: systemd `egi-media-cms-frontend` (Next.js on `127.0.0.1:3012`)

## Git workflow (wajib)

1. Kerja di `feature/*` / `fix/*` / `ci/*` dari `develop` yang sudah di-pull.
2. Jangan commit atau push ke `develop` / `main`.
3. Buka Pull Request ke **`develop`**.
4. Setelah PR di-merge, GitHub Actions **Deploy staging** jalan otomatis.
5. Production (`main`) tidak ikut ter-deploy dari alur ini.

## Apa yang dilakukan CI

Pada setiap push ke `develop`:

1. SSH ke VPS staging (bukan production).
2. `git fetch` + `git checkout develop` + `git pull --ff-only`.
3. `npm ci` + `npm run build`.
4. `systemctl restart egi-media-cms-frontend`.
5. Health check `http://127.0.0.1:3012/`.

Script di VPS: `scripts/deploy-staging.sh`.  
Tidak mengubah `.env`, tidak `git reset --hard`, tidak menyentuh Docker production.

Cadangan: systemd timer `egi-media-cms-frontend-sync` mem-poll `origin/develop` tiap ~60 detik (skip jika sudah up to date).

## GitHub secrets (repo, bukan environment)

| Secret | Isi |
|---|---|
| `STAGING_SSH_HOST` | `212.85.24.238` |
| `STAGING_SSH_USER` | `root` |
| `STAGING_SSH_KEY` | Private key yang public key-nya sudah ada di VPS |

Tanpa `STAGING_SSH_KEY`, job GitHub Actions di-skip. Timer VPS tetap men-deploy.

## Rollback

CI mencetak commit lama. Di VPS:

```bash
cd /var/www/egi-media/cms/frontend
git checkout <commit-sebelumnya>
npm ci
npm run build
systemctl restart egi-media-cms-frontend
```

Lalu perbaiki di branch feature dan PR ke `develop` lagi.

## Manual dispatch

Actions → Deploy staging → Run workflow. Tetap hanya men-deploy branch `develop`.
