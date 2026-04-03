import { apiClient } from "../../../api/apiClients";
import type { BaseQueryParams } from "../../../common/types/baseQuery.types";
import type { PageResponse } from "../../../common/types/pageResponse.types";
import type { User } from "../../users/types/userType";
import type { AddMemberInput, TeamMember } from "../types/team.type";

export const getTeamMembers = async (
  teamId: string,
  params: BaseQueryParams,
): Promise<PageResponse<TeamMember>> => {
  const response = await apiClient.get(`/teams/${teamId}/members`, { params });
  return response.data;
};

export const getAvailableUsers = async (
  teamId: string,
  params: Pick<BaseQueryParams, "search" | "size">,
): Promise<PageResponse<User>> => {
  const response = await apiClient.get(`/teams/${teamId}/available-users`, {
    params,
  });
  return response.data;
};

export const addMember = async (
  teamId: string,
  data: AddMemberInput,
): Promise<TeamMember> => {
  const res = await apiClient.post(`/teams/${teamId}/members`, data);

  return res.data;
};

export const removeMember = async (
  teamId: string,
  userId: string,
): Promise<void> => {
  await apiClient.delete(`/teams/${teamId}/members/${userId}`);
};

export const updateMemberRole = async (
  teamId: string,
  userId: string,
  role: "ADMIN" | "MEMBER",
): Promise<TeamMember> => {
  const res = await apiClient.patch(`/teams/${teamId}/members/${userId}/role`, {
    role,
  });

  return res.data;
};
