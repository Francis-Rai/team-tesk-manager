import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { PageResponse } from "../../../common/types/pageResponse.types";
import { getTeamMembers } from "../api/teamMemberApi";
import type { TeamMember } from "../types/team.type";

interface Params {
  page: number;
  search?: string;
  sort?: string;
}

export const useTeamMembers = (teamId: string, params?: Params) => {
  return useQuery<PageResponse<TeamMember>>({
    queryKey: [
      "teamMembers",
      teamId,
      params?.page,
      params?.search,
      params?.sort,
    ],
    queryFn: () =>
      getTeamMembers(teamId, {
        page: params?.page,
        size: 10,
        search: params?.search,
        sort: params?.sort,
      }),
    placeholderData: keepPreviousData,
  });
};
