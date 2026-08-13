import { API_ENDPOINTS } from "@/shared/constants/api.constants";
import { axiosClient } from "@/shared/lib/axios-client";

export interface PublicTeamMember {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  image: string;
  sortOrder: number;
}

interface TeamMemberDto {
  id: string;
  name: string;
  role: string;
  bio?: string | null;
  photo_url: string;
  sort_order?: number;
}

function mapMember(dto: TeamMemberDto): PublicTeamMember {
  return {
    id: dto.id,
    name: dto.name,
    role: dto.role,
    bio: dto.bio ?? null,
    image: dto.photo_url,
    sortOrder: dto.sort_order ?? 0,
  };
}

/** Active team members for the public About page. */
export async function fetchActiveTeamMembers(): Promise<PublicTeamMember[]> {
  const response = await axiosClient.get<{ data: TeamMemberDto[] }>(
    API_ENDPOINTS.teamMembers,
    {
      params: {
        page: 1,
        limit: 100,
        active: true,
      },
    },
  );

  return (response.data?.data ?? []).map(mapMember);
}
