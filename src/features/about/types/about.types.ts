export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio?: string | null;
  image: string;
  sortOrder?: number;
}

export interface CoverageTopic {
  label: string;
  description: string;
}
