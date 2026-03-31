import { apiClient } from "../../../api/apiClients";

export interface InviteMemberInput {
  userId: string;
  role: "ADMIN" | "MEMBER";
}

export const inviteMember = async (teamId: string, data: InviteMemberInput) => {
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
