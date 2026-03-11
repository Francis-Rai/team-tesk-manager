import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getTask, getTasks } from "../api/taskApi";
import type { PageResponse } from "../../../common/types/pageResponse";
import type { Task } from "../types/taskTypes";

export const useTasks = (
  teamId: string,
  projectId: string,
  params: {
    page: number;
    search?: string;
    status?: string;
    sort?: string;
  },
) => {
  return useQuery<PageResponse<Task>>({
    queryKey: [
      "tasks",
      teamId,
      projectId,
      params.page,
      params.search,
      params.status,
      params.sort,
    ],

    queryFn: () =>
      getTasks(teamId, projectId, {
        page: params.page,
        size: 10,
        search: params.search,
        status: params.status,
        sort: params.sort,
      }),
    placeholderData: keepPreviousData,
  });
};

export const useTask = (teamId: string, projectId: string, taskId: string) => {
  return useQuery({
    queryKey: ["task", teamId, projectId, taskId],
    queryFn: () => getTask(teamId, projectId, taskId),
  });
};
