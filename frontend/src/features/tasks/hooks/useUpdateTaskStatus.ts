import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTaskStatus } from "../api/taskApi";

import type { PageResponse } from "../../../common/types/pageResponse";
import type { Task } from "../types/taskTypes";
import type { TaskStatus } from "../utils/taskStatus";

interface Params {
  taskId: string;
  status: TaskStatus;
}

interface MutationContext {
  previousTasks?: PageResponse<Task>;
}

export const useUpdateTaskStatus = (teamId: string, projectId: string) => {
  const queryClient = useQueryClient();

  const tasksQueryKey = ["tasks", teamId, projectId];

  return useMutation({
    mutationFn: ({ taskId, status }: Params) =>
      updateTaskStatus(teamId, projectId, taskId, status),

    // ------------------------------
    // OPTIMISTIC UPDATE
    // ------------------------------
    onMutate: async ({ taskId, status }): Promise<MutationContext> => {
      await queryClient.cancelQueries({
        queryKey: tasksQueryKey,
      });

      const previousTasks =
        queryClient.getQueryData<PageResponse<Task>>(tasksQueryKey);

      queryClient.setQueryData<PageResponse<Task>>(tasksQueryKey, (old) => {
        if (!old) return old;

        return {
          ...old,
          content: old.content.map((task) =>
            task.id === taskId ? { ...task, status } : task,
          ),
        };
      });

      return { previousTasks };
    },

    // ------------------------------
    // ROLLBACK IF ERROR
    // ------------------------------
    onError: (_err, _variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(tasksQueryKey, context.previousTasks);
      }
    },

    // ------------------------------
    // FINAL SYNC
    // ------------------------------
    onSettled: (_, __, variables) => {
      const { taskId } = variables;

      queryClient.invalidateQueries({
        queryKey: tasksQueryKey,
      });

      queryClient.invalidateQueries({
        queryKey: ["task", teamId, projectId, taskId],
      });

      queryClient.invalidateQueries({
        queryKey: ["taskUpdates", teamId, projectId, taskId],
      });
    },
  });
};
