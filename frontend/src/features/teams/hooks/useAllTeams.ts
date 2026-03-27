import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { Team } from "../types/TeamTypes";
import { getAllTeams } from "../api/teamApi";

export const useAllTeams = () => {
  return useQuery<Team[]>({
    queryKey: ["teams", "all"],

    queryFn: async () =>
      getAllTeams({
        page: 0,
        size: 1000,
        deletedFilter: "ACTIVE",
      }),
    placeholderData: keepPreviousData,
  });
};
