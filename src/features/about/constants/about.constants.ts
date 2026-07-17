import type { CoverageTopic, TeamMember } from "@/features/about/types/about.types";

const TEAM_IMAGE_BASE = "/images/tim_egi-media";

export const ABOUT_KICKER = "Tentang Kami";
export const ABOUT_HEADLINE =
  "Ruang diskusi yang jujur, menjembatani konten visual dan literasi yang tajam.";
export const ABOUT_LEDE =
  "EGI Media lahir dari semangat menciptakan wadah kolaborasi untuk mengolah beragam sudut pandang tanpa kesan menggurui.";

export const ABOUT_PARAGRAPHS: readonly string[] = [
  "Berawal dari semangat untuk menciptakan ruang diskusi yang jujur, media ini menjadi wadah kolaborasi untuk mengolah berbagai sudut pandang tanpa kesan menggurui. Fokus utamanya adalah menjembatani antara konten visual yang dinamis dengan literasi yang tajam.",
  "Kanal YouTube menjadi mesin utama melalui program Podcast yang mengupas beragam topik secara mendalam. Tak hanya berhenti pada tayangan audio visual, setiap poin penting dan detail menarik dikembangkan kembali melalui artikel di website. Cakupan bahasannya luas dan relevan dengan gaya hidup masa kini, mulai dari dinamika Politik, perkembangan Teknologi, sportivitas dalam Sport, ulasan Hiburan, hingga eksplorasi Wisata.",
  "EGI Media mengedepankan objektivitas dan kreativitas dalam setiap konten yang dihasilkan. Tujuannya sederhana: menjadi referensi yang informatif namun tetap asik untuk diikuti. Di tengah arus informasi yang serba cepat, integritas dan akurasi tetap menjadi landasan utama, sembari terus beradaptasi dengan tren yang ada. Setiap gagasan yang tersiar dan setiap kata yang tertulis diharapkan mampu memberi warna baru serta menjadi pemantik bagi lahirnya ide segar lainnya.",
];

export const ABOUT_PULL_QUOTE =
  "Objektivitas dan kreativitas dalam setiap konten — informatif, namun tetap asik untuk diikuti.";

export const COVERAGE_TOPICS: readonly CoverageTopic[] = [
  { label: "Politik", description: "Mengurai dinamika dan kebijakan terkini." },
  { label: "Teknologi", description: "Menyorot perkembangan dan inovasi digital." },
  { label: "Sport", description: "Merayakan sportivitas di dalam dan luar lapangan." },
  { label: "Hiburan", description: "Ulasan tren budaya populer dan tontonan." },
  { label: "Wisata", description: "Eksplorasi destinasi dan gaya hidup masa kini." },
];

export const LEADERSHIP: readonly TeamMember[] = [
  {
    name: "Iwel Sastra",
    role: "Chief Executive Officer & Editorial Board",
    image: `${TEAM_IMAGE_BASE}/Iwel_sastra.webp`,
  },
  {
    name: "Budimulyanto",
    role: "Chief Operating Officer & Editorial Board",
    image: `${TEAM_IMAGE_BASE}/Budimulyanto.webp`,
  },
];

export const TEAM_MEMBERS: readonly TeamMember[] = [
  {
    name: "Nemo Gusti Dwi Pasopati",
    role: "Senior Multimedia & Digital Marketing Specialist",
    image: `${TEAM_IMAGE_BASE}/Nemo_gusti_dwi_pasopati.webp`,
  },
  {
    name: "Amelia Diah Puspita",
    role: "Creative Research & Event Specialist",
    image: `${TEAM_IMAGE_BASE}/Amelia_diah_puspita.webp`,
  },
  {
    name: "Ahmad Zidan Ghozali",
    role: "Podcast & Multimedia Specialist",
    image: `${TEAM_IMAGE_BASE}/Ahmad_zidan_ghozali.webp`,
  },
  {
    name: "Rio Pramana Putra",
    role: "Production & Editor",
    image: `${TEAM_IMAGE_BASE}/Rio_pramana_putra.webp`,
  },
  {
    name: "Ananda Dewa Nur W.",
    role: "Production & Multimedia",
    image: `${TEAM_IMAGE_BASE}/Ananda_dewa_nur_w.webp`,
  },
];
