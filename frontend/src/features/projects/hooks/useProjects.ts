import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getProjects } from "../api/projectApi";
import type { Project } from "../types/projectTypes";
import type { PageResponse } from "../../../common/types/pageResponse.types";
import type { DeletedFilter } from "../../../common/types/deletedFilter.types";

export const useProjects = (
  teamId: string,
  params: {
    page: number;
    size: number;
    search?: string;
    status?: string;
    sort?: string;
    deletedFilter: DeletedFilter;
  },
) => {
  return useQuery<PageResponse<Project>>({
    queryKey: [
      "projects",
      teamId,
      params.page,
      params.size,
      params.search,
      params.status,
      params.sort,
      params.deletedFilter,
    ],
    queryFn: () =>
      getProjects(teamId, {
        page: params.page,
        size: params.size,
        search: params.search,
        status: params.status,
        sort: params.sort,
        deletedFilter: params.deletedFilter,
      }),
    placeholderData: keepPreviousData,
  });
};
