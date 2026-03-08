import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTaskUpdate } from "../api/taskApi";

export const useCreateTaskUpdate = (
  teamId: string,
  projectId: string,
  taskId: string,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (message: string) =>
      createTaskUpdate(teamId, projectId, taskId, message),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["taskUpdates", teamId, projectId, taskId],
      });
    },
  });
};
