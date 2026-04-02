import { apiClient } from "../../../api/apiClients";
import type { DeletedFilter } from "../../../common/utils/deletedFilter";
import type { Team } from "../types/teamTypes";

export const getTeams = async (params: {
  page?: number;
  size?: number;
  search?: string;
  status?: string;
  sort?: string;
  deletedFilter: DeletedFilter;
}) => {
  const response = await apiClient.get(`/teams`, { params });
  return response.data;
};

export const getAllTeams = async (params: {
  page?: number;
  size?: number;
  deletedFilter: DeletedFilter;
}) => {
  const response = await apiClient.get(`/teams`, { params });
  return response.data.content;
};

export const createTeam = async (data: {
  name: string;
  description?: string;
}): Promise<Team> => {
  const response = await apiClient.post("/teams", data);
  return response.data;
};

export interface TeamMeResponse {
  userId: string;
  role: "OWNER" | "ADMIN" | "MEMBER" | null;
}

export const getTeamMe = async (teamId: string) => {
  const res = await apiClient.get(`/teams/${teamId}/me`);
  return res.data as TeamMeResponse;
};

export const getTeam = async (teamId: string): Promise<Team> => {
  const response = await apiClient.get(`/teams/${teamId}`);

  return response.data;
};

export const updateTeam = async (
  teamId: string,
  data: {
    name?: string;
    description?: string;
  },
): Promise<Team> => {
  const response = await apiClient.patch(`/teams/${teamId}`, data);
  return response.data;
};

export const deleteTeam = async (teamId: string) => {
  await apiClient.delete(`/teams/${teamId}`);
};

export const transferTeam = async (teamId: string, userId: string) => {
  await apiClient.patch(`/teams/${teamId}/transfer/${userId}`);
};
