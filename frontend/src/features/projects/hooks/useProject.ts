import { useQuery } from "@tanstack/react-query";
import { getProject, getProjects } from "../api/projectApi";

export const useProjects = (teamId: string) => {
  return useQuery({
    queryKey: ["projects", teamId],
    queryFn: () => getProjects(teamId),
  });
};

export const useProject = (teamId: string, projectId: string) => {
  return useQuery({
    queryKey: ["project", teamId, projectId],
    queryFn: () => getProject(teamId, projectId),
  });
};

// /*
//  * Custom hook to fetch a project by ID.
//  */
// export const useProjectById = (projectId: number) => {
//   return useQuery({
//     queryKey: ["project", projectId],
//     queryFn: () => getProjectById(projectId),
//     enabled: !!projectId,
//   });
// };
