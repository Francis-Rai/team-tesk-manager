import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask } from "../api/taskApi";

export const useCreateTask = (teamId: string, projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { title: string; description?: string }) =>
      createTask(teamId, projectId, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", teamId, projectId],
      });
    },
  });
};

// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { createTask } from "./api/taskApi";

// /*
//  * Custom hook to create a new task within a project.
//  */
// export const useCreateTask = (projectId: number) => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (payload: {
//       title: string;
//       description: string;
//       status: "TODO" | "IN_PROGRESS" | "DONE";
//       assignedUserId?: number | null;
//     }) => createTask(projectId, payload),

//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: ["tasks", projectId],
//       });
//     },
//   });
// };
