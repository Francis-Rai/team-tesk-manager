import { useQuery } from "@tanstack/react-query";
import { getTask, getTasks } from "../api/taskApi";
import type { PageResponse } from "../../../common/types/pageResponse";
import type { Task } from "../types/taskTypes";

export const useTasks = (
  teamId: string,
  projectId: string,
  filters: {
    page: number;
    search?: string;
    status?: string;
    assigneeId?: string;
  },
) => {
  return useQuery<PageResponse<Task>>({
    queryKey: [
      "tasks",
      teamId,
      projectId,
      filters.page,
      filters.search,
      filters.status,
      filters.assigneeId,
    ],

    queryFn: () =>
      getTasks(teamId, projectId, {
        page: filters.page,
        size: 10,
        search: filters.search,
        status: filters.status,
        assigneeId: filters.assigneeId,
      }),
  });
};

export const useTask = (teamId: string, projectId: string, taskId: string) => {
  return useQuery({
    queryKey: ["task", teamId, projectId, taskId],
    queryFn: () => getTask(teamId, projectId, taskId),
  });
};
