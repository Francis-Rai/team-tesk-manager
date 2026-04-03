import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addMember } from "../api/teamMemberApi";

export const useAddMember = (teamId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { userId: string; role: "ADMIN" | "MEMBER" }) =>
      addMember(teamId, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teamMembers", teamId],
      });
    },
  });
};
