import { useQuery } from "@tanstack/react-query";
import { getTeamMembers } from "../api/memberApi";

export const useTeamMembers = (teamId: string) => {
  return useQuery({
    queryKey: ["teamMembers", teamId],
    queryFn: () => getTeamMembers(teamId),
  });
};
