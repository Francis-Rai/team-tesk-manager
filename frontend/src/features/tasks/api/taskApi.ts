import { apiClient } from "../../../api/apiClients";

export const getTasks = async (
  teamId: string,
  projectId: string,
  params: {
    page?: number;
    size?: number;
    search?: string;
    status?: string;
    assigneeId?: string;
  },
) => {
  const response = await apiClient.get(
    `/teams/${teamId}/projects/${projectId}/tasks`,
    { params },
  );

  return response.data;
};

export const getTask = async (
  teamId: string,
  projectId: string,
  taskId: string,
) => {
  const response = await apiClient.get(
    `/teams/${teamId}/projects/${projectId}/tasks/${taskId}`,
  );

  return response.data;
};

export const createTask = async (
  teamId: string,
  projectId: string,
  data: {
    title: string;
    description?: string;
  },
) => {
  const response = await apiClient.post(
    `/teams/${teamId}/projects/${projectId}/tasks`,
    data,
  );

  return response.data;
};

export const getTaskUpdates = async (
  teamId: string,
  projectId: string,
  taskId: string,
) => {
  const response = await apiClient.get(
    `/teams/${teamId}/projects/${projectId}/tasks/${taskId}/updates`,
  );

  return response.data;
};

export const updateTaskStatus = async (
  teamId: string,
  projectId: string,
  taskId: string,
  status: string,
) => {
  const response = await apiClient.patch(
    `/teams/${teamId}/projects/${projectId}/tasks/${taskId}/status`,
    { status },
  );

  return response.data;
};

export const assignUser = async (
  teamId: string,
  projectId: string,
  taskId: string,
  userId: string,
) => {
  const response = await apiClient.patch(
    `/teams/${teamId}/projects/${projectId}/tasks/${taskId}/assignee/${userId}`,
  );

  return response.data;
};

export const assignSupportUser = async (
  teamId: string,
  projectId: string,
  taskId: string,
  userId: string,
) => {
  const response = await apiClient.patch(
    `/teams/${teamId}/projects/${projectId}/tasks/${taskId}/support/${userId}`,
  );

  return response.data;
};

// /*
//  * Fetch all tasks for a specific project.
//  */
// export const getTasksByProject = async (projectId: number): Promise<Task[]> => {
//   const { data } = await api.get<Task[]>(`/projects/${projectId}/tasks`);
//   return data;
// };

// // Create a new task within a specific project.
// export const createTask = async (
//   projectId: number,
//   payload: {
//     title: string;
//     description: string;
//     status: TaskStatus;
//     assignedUserId?: number | null;
//   },
// ): Promise<Task> => {
//   const { data } = await api.post<Task>(
//     `/projects/${projectId}/tasks`,
//     payload,
//   );

//   return data;
// };

// // Update Task
// export const updateTask = async (
//   projectId: number,
//   taskId: number,
//   payload: {
//     name?: string;
//     description?: string;
//     status?: string | null;
//     assignedUserId?: number | null;
//   },
// ) => {
//   const { data } = await api.patch(
//     `/projects/${projectId}/tasks/${taskId}`,
//     payload,
//   );
//   return data;
// };

// // Delete a task within a specific project
// export const deleteTask = async (
//   projectId: number,
//   taskId: number,
// ): Promise<void> => {
//   await api.delete(`/projects/${projectId}/tasks/${taskId}`);
// };
