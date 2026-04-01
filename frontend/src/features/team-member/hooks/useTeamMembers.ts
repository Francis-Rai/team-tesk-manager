import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { PageResponse } from "../../../common/types/pageResponse";
import type { TeamMember } from "../types/memberTypes";
import { getTeamMembers } from "../api/teamMemberApi";

interface Params {
  page: number;
  search?: string;
  status?: string;
  sort?: string;
}

export const useTeamMembers = (teamId: string, params?: Params) => {
  return useQuery<PageResponse<TeamMember>>({
    queryKey: [
      "teamMembers",
      teamId,
      params?.page,
      params?.search,
      params?.status,
      params?.sort,
    ],
    queryFn: () =>
      getTeamMembers(teamId, {
        page: params?.page,
        size: 10,
        search: params?.search,
        status: params?.status,
        sort: params?.sort,
      }),
    placeholderData: keepPreviousData,
  });
};
