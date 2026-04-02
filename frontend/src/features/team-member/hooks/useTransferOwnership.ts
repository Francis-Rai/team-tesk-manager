import { useMutation, useQueryClient } from "@tanstack/react-query";
import { transferTeam } from "../../teams/api/teamApi";

export function useTransferOwnership(teamId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => transferTeam(teamId, userId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teamMembers"],
      });

      queryClient.invalidateQueries({
        queryKey: ["team"],
      });
    },
  });
}
