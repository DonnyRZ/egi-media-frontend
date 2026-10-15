# Audit deskripsi heading publik — 15 Oktober 2026

## Hasil

Audit source seluruh route publik, fitur, serta komponen bersama menemukan **57 pemasangan deskripsi pengantar**. Semua pemasangan tersebut dihapus. Perubahan mencakup 62 file source dan berlaku untuk desktop/mobile dalam ID, EN, dan UZ.

| Area | Titik yang dibersihkan |
|---|---|
| Homepage | Trending, Berita Terbaru, Video Terbaru, Pilihan Editor, Berdasarkan Kategori, Topik, Seri, Untuk Anda |
| Kategori | Pengantar halaman kategori, pengantar Berita Terbaru kategori, deskripsi kelompok kategori homepage |
| Topik | Pengantar detail, kartu unggulan/biasa, kelompok Topik homepage, pilihan preferensi topik |
| Seri | Pengantar detail, kartu unggulan/biasa, heading Seri homepage |
| Video | Pengantar listing lama dan program video; hub/Shorts lainnya sudah tanpa pengantar heading |
| Utilitas | Notifikasi, preferensi topik, Profil, pengantar form nama/password |
| Akun | Pengantar shell login/register/lupa/reset password/check-email/verifikasi/callback Google dan subtitle form |
| Kolom | Pengantar halaman tulis/edit dan blok form utama |
| Perusahaan/informasi | Tentang, Cakupan, Tim, Kontak/Peta, Profesional, pembuka Privasi/Ketentuan/Pedoman Media Siber |
| Preview | Heading Trending dan Berita Terbaru pada editorial preview |

Latest, Search, Saved, For You, Kolom, dan beberapa hero listing lainnya sudah tanpa deskripsi pengantar pada source rilis sebelumnya. Semuanya turut diaudit. Sembilan label jumlah hasil pada listing dipertahankan sebagai `countLabel`, di samping judul ketika ruang memungkinkan.

## Perubahan komponen

- `FrameHeading`: properti `subtitle` dihapus; jumlah hasil memakai `countLabel`.
- `SectionHeading`: properti dan render `subtitle` dihapus.
- `FramePageHero`: properti dan render `lede` dihapus.
- `AuthShell`: properti dan render `subtitle` dihapus.
- Deskripsi yang dirender langsung di halaman/kartu taksonomi dihapus dari JSX, bukan disembunyikan dengan CSS.

Konten tersimpan, field CMS, terjemahan, dan metadata SEO tetap tersedia. Paragraf isi artikel, ringkasan berita/video, isi kebijakan, jabatan penulis/tim, alamat, kredit foto, statistik/jumlah hasil, petunjuk operasional, pesan login/error/empty/success tetap merupakan konten atau informasi fungsional.

## Cakupan pemeriksaan

Pencarian source menyeluruh mencakup `subtitle`, `lede`, `description`, heading dan paragraf langsung/bersyarat. Sisa paragraf setelah heading diperiksa lagi melalui AST; yang tersisa adalah isi berita/video, isi kebijakan, metadata, alamat, dan pesan status fungsional.

- TypeScript `--noEmit --incremental false`: lulus.
- ESLint `src --quiet`: lulus.
- Pemeriksaan whitespace diff: lulus.
- Tidak menambahkan atau menjalankan test suite, production build, maupun pemeriksaan browser/perangkat pada perubahan ini.

Status: kandidat lokal pada branch `feature/remove-public-heading-descriptions`; belum commit, push, atau deploy.
