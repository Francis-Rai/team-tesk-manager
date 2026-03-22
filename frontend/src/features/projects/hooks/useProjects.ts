import { useQuery } from "@tanstack/react-query";
import { getProjects } from "../api/projectApi";

export const useProjects = (teamId: string) => {
  return useQuery({
    queryKey: ["projects", teamId],
    queryFn: () => getProjects(teamId),
  });
};
