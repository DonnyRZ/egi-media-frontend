import type { TeamMember } from "@/features/about/types/about.types";

const TEAM_IMAGE_BASE = "/images/tim_egi-media";

export const LEADERSHIP: readonly TeamMember[] = [
  { id: "iwel", name: "Iwel Sastra", image: `${TEAM_IMAGE_BASE}/Iwel_sastra.webp` },
  { id: "budi", name: "Budimulyanto", image: `${TEAM_IMAGE_BASE}/Budimulyanto.webp` },
];

export const TEAM_MEMBERS: readonly TeamMember[] = [
  {
    id: "nemo",
    name: "Nemo Gusti Dwi Pasopati",
    image: `${TEAM_IMAGE_BASE}/Nemo_gusti_dwi_pasopati.webp`,
  },
  {
    id: "amelia",
    name: "Amelia Diah Puspita",
    image: `${TEAM_IMAGE_BASE}/Amelia_diah_puspita.webp`,
  },
  {
    id: "zidan",
    name: "Ahmad Zidan Ghozali",
    image: `${TEAM_IMAGE_BASE}/Ahmad_zidan_ghozali.webp`,
  },
  {
    id: "rio",
    name: "Rio Pramana Putra",
    image: `${TEAM_IMAGE_BASE}/Rio_pramana_putra.webp`,
  },
  {
    id: "ananda",
    name: "Ananda Dewa Nur W.",
    image: `${TEAM_IMAGE_BASE}/Ananda_dewa_nur_w.webp`,
  },
];
