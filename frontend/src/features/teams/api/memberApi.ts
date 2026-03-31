import { apiClient } from "../../../api/apiClients";

export const getTeamMembers = async (
  teamId: string,
  params: {
    page?: number;
    size?: number;
    search?: string;
    status?: string;
    sort?: string;
  },
) => {
  const response = await apiClient.get(`/teams/${teamId}/members`, { params });
  return response.data;
};
