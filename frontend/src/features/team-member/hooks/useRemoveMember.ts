import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeMember } from "../api/teamMemberApi";

export const useRemoveMember = (teamId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memberId: string) => removeMember(teamId, memberId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teamMembers", teamId],
      });
    },
  });
};
