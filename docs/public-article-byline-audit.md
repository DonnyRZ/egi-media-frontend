# Audit byline artikel publik — 15 Oktober 2026

## Kebijakan sementara

Nama penulis semua artikel berita di website adalah **Tim Redaksi**, persis sama dalam ID, EN, dan UZ. Aturan berlaku pada artikel lama maupun baru tanpa memperbarui record artikel atau mengganti nama akun CMS.

Sumber kebijakan tunggal: `src/shared/constants/article.constants.ts` → `PUBLIC_ARTICLE_AUTHOR_NAME`.

## Titik yang diperbaiki

| Titik | Penerapan |
|---|---|
| Mapper artikel publik | `mapArticleDto` menetapkan byline publik; `mapArticleDetailDto` dan `mapArticleListDto` mewarisinya. ID pemilik tetap dipertahankan. |
| Metadata kartu berita | `ArticleMeta` memakai konstanta, termasuk bila model lama masih ada di cache atau data berasal langsung dari preview. |
| Kartu horizontal | `HorizontalArticleCard` memakai konstanta untuk metadata mobile dan daftar horizontal lainnya. |
| Detail artikel | `ArticleHeader` memakai konstanta untuk byline di bawah judul. |
| Pilihan Editor/ranked item | `EditorsPickSection` memakai konstanta pada nama yang sebelumnya dirender langsung. |
| Preview horizontal lama | `BaselineCard` memakai konstanta agar preview tidak membocorkan nama fixture sebagai byline artikel. |
| Metadata SEO detail | `generateMetadata` mengisi `authors` dengan Tim Redaksi. Tidak ditemukan implementasi RSS atau JSON-LD artikel terpisah yang menampilkan nama penulis. |

## Cakupan yang memakai titik bersama tersebut

- Homepage: hero, Berita Utama Lainnya, Trending, Berita Terbaru, Berita Lainnya/carousel dan paket pendamping, Pilihan Editor, artikel per kategori/topik, serta Untuk Anda.
- Kategori: lead, pendamping, Berita Terbaru, pilihan editor, bagian topik, dan timeline.
- Latest, Topik, Seri, serta detail Seri yang menyertakan daftar artikel.
- Search: hasil artikel memakai timeline tanpa nama penulis; sumber datanya tetap dinormalisasi oleh mapper publik.
- Saved: `SavedArticleCard` memakai `ArticleCard`; mapper saved juga menggunakan `mapArticleDto`.
- For You: listing dan section homepage memakai `ArticleCard` dan mapper publik.
- Bacaan terkait: `RelatedArticles` memakai kartu artikel bersama.
- Detail artikel berdasarkan ID maupun slug, dalam seluruh locale.
- Editorial preview yang memakai kartu/header artikel bersama.

## Pemisahan data

CMS menggunakan mapper dan data penulis tersendiri; nama akun, ID penulis, kepemilikan, hak edit, serta audit log dipertahankan. Tidak ada migrasi, rename akun, atau penulisan ulang artikel. Identitas akun, komentar pembaca, kredit foto, dan penulis Kolom/opini merupakan identitas terpisah dari byline artikel berita.

## Pemeriksaan source

Pencarian menyeluruh `author`, `fullName`, `full_name`, `byline`, `authors`, dan `authorName` ditelusuri hingga mapper, service, repository, renderer, dan metadata. Tidak tersisa render `article.author.fullName` pada komponen publik artikel. Komponen metadata generik tidak ditimpa secara global, agar identitas di luar artikel berita tetap sesuai datanya.

- TypeScript `--noEmit --incremental false`: lulus.
- ESLint pada seluruh file implementasi yang diubah: lulus.
- Pemeriksaan whitespace diff: lulus.
- Tidak menjalankan test suite atau pemeriksaan perangkat fisik pada perubahan ini.

Status: perubahan lokal; belum commit, push, atau deploy.
