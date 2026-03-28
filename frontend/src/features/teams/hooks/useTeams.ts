import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getTeams } from "../api/teamApi";
import type { DeletedFilter } from "../../../common/utils/deletedFilter";
import type { Team } from "../types/teamTypes";
import type { PageResponse } from "../../../common/types/pageResponse";

export const useTeams = (params: {
  page: number;
  search?: string;
  status?: string;
  sort?: string;
  deletedFilter: DeletedFilter;
}) => {
  return useQuery<PageResponse<Team>>({
    queryKey: [
      "teams",
      params.page,
      params.search,
      params.status,
      params.sort,
      params.deletedFilter,
    ],
    queryFn: () =>
      getTeams({
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
