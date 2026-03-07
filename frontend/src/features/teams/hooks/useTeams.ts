import { useQuery } from "@tanstack/react-query";
import { getTeams } from "../api/teamApi";

export const useTeams = () => {
  return useQuery({
    queryKey: ["teams"],
    queryFn: getTeams,
  });
};
