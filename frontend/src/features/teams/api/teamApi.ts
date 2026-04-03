import { apiClient } from "../../../api/apiClients";
import type { BaseQueryParams } from "../../../common/types/baseQueryParams";
import type { PageResponse } from "../../../common/types/pageResponse";
import type { DeletedFilter } from "../../../common/utils/deletedFilter";
import type { Team, TeamMe, TeamMember } from "../types/team.type";

export const getTeams = async (params: {
  baseParams: BaseQueryParams;
  deletedFilter: DeletedFilter;
}): Promise<PageResponse<Team>> => {
  const response = await apiClient.get(`/teams`, { params });
  return response.data;
};

export const getAllTeams = async (params: {
  baseParams: Pick<BaseQueryParams, "page" | "size">;
  deletedFilter: DeletedFilter;
}): Promise<Team[]> => {
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

export const getTeamMe = async (teamId: string): Promise<TeamMe> => {
  const response = await apiClient.get(`/teams/${teamId}/me`);
  return response.data;
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

export const deleteTeam = async (teamId: string): Promise<void> => {
  await apiClient.delete(`/teams/${teamId}`);
};

export const transferTeam = async (
  teamId: string,
  userId: string,
): Promise<TeamMember> => {
  const response = await apiClient.patch(`/teams/${teamId}/transfer/${userId}`);
  return response.data;
};
