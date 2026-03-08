import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTask } from "../api/taskApi";

export const useUpdateTask = (
  teamId: string,
  projectId: string,
  taskId: string,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      title?: string;
      description?: string;
      priority?: string;
      plannedStartDate?: string;
      plannedDueDate?: string;
    }) => updateTask(teamId, projectId, taskId, data),

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
    },
  });
};
