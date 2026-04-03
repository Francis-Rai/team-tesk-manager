import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { PageResponse } from "../../../common/types/pageResponse.types";
import { getTasks } from "../api/taskApi";
import type { DeletedFilter } from "../../../common/types/deletedFilter.types";
import type { Task } from "../types/taskTypes";

export const useTasks = (
  teamId: string,
  projectId: string,
  params: {
    page: number;
    search?: string;
    status?: string;
    sort?: string;
    deletedFilter: DeletedFilter;
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
      params.deletedFilter,
    ],

    queryFn: () =>
      getTasks(teamId, projectId, {
        page: params.page,
        size: 10,
        search: params.search,
        status: params.status,
        sort: params.sort,
        deletedFilter: params.deletedFilter,
      }),
    placeholderData: keepPreviousData,
  });
};
