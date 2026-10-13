"use client";

import { useState } from "react";
import { ArticleHeader } from "@/features/article/components/ArticleHeader";
import { ArticleHero } from "@/features/article/components/ArticleHero";
import { ArticleBody } from "@/features/article/components/ArticleBody";
import { ArticleShareBar } from "@/features/article/components/ArticleShareBar";
import { ArticleActionIcon } from "@/features/article/components/ArticleActionIcon";
import { previewArticles } from "@/features/editorial-preview/fixtures";

const paragraphs = [
  "Bagi kamu wanita karir berhijab dengan mobilitas tinggi, memilih warna busana harian bukan sekadar urusan estetika, melainkan juga kunci untuk memancarkan aura profesional dan percaya diri. Memakai warna-warna timeless atau tak lekang oleh waktu adalah pilihan cerdas untuk mempermudah padu padan tanpa perlu bingung setiap pagi di depan lemari.",
  "Untuk menciptakan tampilan yang effortless namun tetap berkelas, kamu bisa mengandalkan tiga warna utama yang wajib ada di koleksi pakaianmu.",
  "Palet warna ini sangat fleksibel untuk dipakai dari rapat penting pagi hari hingga acara santai selepas jam kerja. Pilih pakaian yang nyaman dan sesuaikan dengan kebutuhan aktivitas harian.",
];

export function MobileReadingPreview({ plain = false, brokenImage = false, longMeta = false, short = false, pasted = false }: { plain?: boolean; brokenImage?: boolean; longMeta?: boolean; short?: boolean; pasted?: boolean }) {
  const [saved, setSaved] = useState(false);
  const copy = short ? [
    "Warna hitam, beige, dan navy mudah dipadukan untuk busana kerja. Ketiganya memberi kesan rapi tanpa membuat pilihan pakaian terasa rumit.",
    "Padukan hijab dengan atasan netral dan bahan yang nyaman. Pilih potongan sesuai aktivitas, baik saat rapat maupun perjalanan ke kantor.",
    "Tambahkan aksesori sederhana sebagai pelengkap. Kenyamanan dan kecocokan pakaian tetap menjadi pertimbangan utama.",
  ] : paragraphs;
  const article = {
    ...previewArticles[1],
    title: short ? "Warna Timeless untuk Busana Kerja" : previewArticles[1].title,
    readingTimeMinutes: short ? 1 : previewArticles[1].readingTimeMinutes,
    author: { id: "preview", fullName: longMeta ? "Donny Santosa dan Tim Redaksi EGI Media Indonesia" : "Donny Santosa" },
    category: { id: "preview", name: "Hiburan" },
    featuredImage: brokenImage ? "/images/missing-preview-photo.png" : previewArticles[1].featuredImage,
    content: plain ? copy.join("\n\n") : `${copy.map(p => `<p${pasted ? ' style="font-size:28px;line-height:2;text-align:justify;font-family:serif"' : ''}><span${pasted ? ' style="font-size:32px;font-family:serif"' : ''}>${p}</span></p>`).join("")}${short ? "" : `<h2>Warna yang mudah dipadukan</h2><ul><li>Monochrome classic</li><li>Earthy beige dan nude</li><li>Navy blue</li></ul><h3>Sesuaikan dengan aktivitas</h3><blockquote>Busana yang nyaman membantu kamu tetap percaya diri.</blockquote><p>Referensi: https://example.com/${"referensi-panjang-".repeat(12)}</p><table><tbody><tr><th>Warna</th><th>Catatan dengan judul kolom yang panjang</th></tr><tr><td>Navy</td><td>${"pilihanwarna".repeat(20)}</td></tr></tbody></table>`}`,
  };
  return <>
    <section className="editorial-opening bg-white px-4 py-5 md:p-5 lg:p-8">
      <div className="mx-auto max-w-[1040px]">
        <ArticleHeader article={article} />
        <div className="editorial-actions-offset mt-4">
          <div className="editorial-actions border-y border-neutral-200 py-3">
            <ArticleShareBar articleId={article.id} title={article.title} shareUrl="https://example.com/reading-preview" onShareRecorded={() => undefined}
              leadingAction={<div className="editorial-save-action"><button aria-label="Simpan contoh lokal" aria-pressed={saved} className="inline-flex h-11 w-11 items-center justify-center border border-neutral-300" onClick={() => setSaved(!saved)}><ArticleActionIcon name="bookmark" /></button></div>} />
          </div>
        </div>
        <div className="editorial-photo-offset mx-auto mt-5 max-w-[768px]"><ArticleHero article={article} /></div>
      </div>
    </section>
    <section className="editorial-gutter editorial-reading-module bg-white px-4 py-5 md:p-5 lg:p-8">
      <div className="editorial-reading-width mx-auto max-w-3xl"><ArticleBody content={article.content} /></div>
    </section>
  </>;
}
