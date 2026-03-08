import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTaskStatus } from "../api/taskApi";
import type { PageResponse } from "../../../common/types/pageResponse";
import type { Task } from "../types/taskTypes";
import type { TaskStatus } from "../utils/taskStatus";

interface Params {
  taskId: string;
  status: TaskStatus;
}

export const useUpdateTaskStatus = (teamId: string, projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, status }: Params) =>
      updateTaskStatus(teamId, projectId, taskId, status),

    // ------------------------------
    // OPTIMISTIC UPDATE
    // ------------------------------
    onMutate: async ({ taskId, status }) => {
      await queryClient.cancelQueries({
        queryKey: ["tasks", teamId, projectId],
      });

      const previousTasks = queryClient.getQueryData<PageResponse<Task>>([
        "tasks",
        teamId,
        projectId,
      ]);

      queryClient.setQueryData<PageResponse<Task>>(
        ["tasks", teamId, projectId],
        (old) => {
          if (!old) return old;

          return {
            ...old,
            content: old.content.map((task) =>
              task.id === taskId ? { ...task, status } : task,
            ),
          };
        },
      );

      return { previousTasks };
    },

    // ------------------------------
    // REVERT IF ERROR
    // ------------------------------
    onError: (_err, _variables, context) => {
      queryClient.setQueryData(
        ["tasks", teamId, projectId],
        context?.previousTasks,
      );
    },

    // ------------------------------
    // FINAL SYNC
    // ------------------------------
    onSettled: (_, __, variables) => {
      const { taskId } = variables;

      queryClient.invalidateQueries({
        queryKey: ["tasks", teamId, projectId],
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
