import { apiClient } from "../../../api/apiClients";

export interface AddMemberInput {
  userId: string;
  role: "ADMIN" | "MEMBER";
}

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

export const getAvailableUsers = async (
  teamId: string,
  params: {
    search?: string;
  },
) => {
  const response = await apiClient.get(`/teams/${teamId}/available-users`, {
    params,
  });
  return response.data;
};

export const addMember = async (teamId: string, data: AddMemberInput) => {
  const res = await apiClient.post(`/teams/${teamId}/members`, data);

  return res.data;
};

export const removeMember = async (teamId: string, memberId: string) => {
  await apiClient.delete(`/teams/${teamId}/members/${memberId}`);
};

export const updateMemberRole = async (
  teamId: string,
  memberId: string,
  role: "ADMIN" | "MEMBER",
) => {
  const res = await apiClient.patch(
    `/teams/${teamId}/members/${memberId}/role`,
    { role },
  );

  return res.data;
};
