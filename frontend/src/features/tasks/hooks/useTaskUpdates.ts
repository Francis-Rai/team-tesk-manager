import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getTaskUpdates } from "../api/taskApi";

import type { PageResponse } from "../../../common/types/pageResponse.types";
import type { TaskUpdate } from "../types/taskUpdatesTypes";

interface Params {
  page?: number;
  size?: number;
}

export const useTaskUpdates = (
  teamId: string,
  projectId: string,
  taskId: string,
  params: Params = {},
) => {
  const { page = 0, size = 10 } = params;

  return useQuery<PageResponse<TaskUpdate>>({
    queryKey: ["taskUpdates", teamId, projectId, taskId, page, size],

    queryFn: () =>
      getTaskUpdates(teamId, projectId, taskId, {
        page,
        size,
      }),

    placeholderData: keepPreviousData,
  });
};
