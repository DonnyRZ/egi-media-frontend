import { fetchActiveTeamMembers } from "@/shared/services/team-members.service";

export async function getActiveTeamMembers() {
  return fetchActiveTeamMembers();
}
