import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assignSupportUser } from "../api/taskApi";

export const useAssignSupportUser = (
  teamId: string,
  projectId: string,
  taskId: string,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) =>
      assignSupportUser(teamId, projectId, taskId, userId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["task", teamId, projectId, taskId],
      });

      queryClient.invalidateQueries({
        queryKey: ["tasks", teamId, projectId],
      });

      queryClient.invalidateQueries({
        queryKey: ["taskUpdates", teamId, projectId, taskId],
      });

      queryClient.invalidateQueries({
        queryKey: ["projectActivity", teamId, projectId],
      });
    },
  });
};
