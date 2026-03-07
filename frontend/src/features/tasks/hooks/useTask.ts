import { useQuery } from "@tanstack/react-query";
import { getTask, getTasks } from "../api/taskApi";

export const useTasks = (teamId: string, projectId: string) => {
  return useQuery({
    queryKey: ["tasks", teamId, projectId],
    queryFn: () => getTasks(teamId, projectId),
  });
};

export const useTask = (teamId: string, projectId: string, taskId: string) => {
  return useQuery({
    queryKey: ["task", teamId, projectId, taskId],
    queryFn: () => getTask(teamId, projectId, taskId),
  });
};

// import { useQuery } from "@tanstack/react-query";
// import { getTasksByProject } from "./api/taskApi";

// /*
//  * Custom hook to fetch tasks for a specific project.
//  */
// export const useTasks = (projectId: number) => {
//   return useQuery({
//     // Unique query key based on project ID
//     queryKey: ["tasks", projectId],
//     // query function to fetch tasks by project ID
//     queryFn: () => getTasksByProject(projectId),
//   });
// };
