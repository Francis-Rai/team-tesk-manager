import { useMutation, useQueryClient } from "@tanstack/react-query";
import { inviteMember } from "../api/teamApi";

export const useInviteMember = (teamId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { userId: string; role: "ADMIN" | "MEMBER" }) =>
      inviteMember(teamId, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teamMembers", teamId],
      });
    },
  });
};
