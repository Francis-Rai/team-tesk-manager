import { useQuery } from "@tanstack/react-query";
import { getTaskUpdates } from "../api/taskApi";

export const useTaskUpdates = (
  teamId: string,
  projectId: string,
  taskId: string,
) => {
  return useQuery({
    queryKey: ["taskUpdates", teamId, projectId, taskId],
    queryFn: () => getTaskUpdates(teamId, projectId, taskId),
  });
};
