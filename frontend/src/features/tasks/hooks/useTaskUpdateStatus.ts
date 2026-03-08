import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTaskStatus } from "../api/taskApi";

interface Params {
  taskId: string;
  status: string;
}

export const useUpdateTaskStatus = (teamId: string, projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, status }: Params) =>
      updateTaskStatus(teamId, projectId, taskId, status),

    onSuccess: (_, variables) => {
      const { taskId } = variables;

      queryClient.invalidateQueries({
        queryKey: ["task", teamId, projectId, taskId],
      });

      queryClient.invalidateQueries({
        queryKey: ["tasks", teamId, projectId],
      });

      queryClient.invalidateQueries({
        queryKey: ["taskUpdates", teamId, projectId, taskId],
      });
    },
  });
};
