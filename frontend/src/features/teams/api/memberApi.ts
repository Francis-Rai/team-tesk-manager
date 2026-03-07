import { apiClient } from "../../../api/apiClients";
import type { TeamMember } from "../types/memberTypes";

export const getTeamMembers = async (teamId: string): Promise<TeamMember[]> => {
  const response = await apiClient.get(`/teams/${teamId}/members`);

  return response.data;
};
