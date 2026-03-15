import { apiClient } from "./../../../api/apiClients";
import type { PageResponse } from "../../../common/types/pageResponse";
import type { CreateTaskInput } from "../types/createTaskSchema";
import type { TaskUpdate } from "../types/taskUpdatesTypes";
import type { Task, UpdateTaskInput } from "../types/taskTypes";

export const getTasks = async (
  teamId: string,
  projectId: string,
  params: {
    page?: number;
    size?: number;
    search?: string;
    status?: string;
    sort?: string;
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
  data: CreateTaskInput,
) => {
  const response = await apiClient.post(
    `/teams/${teamId}/projects/${projectId}/tasks`,
    data,
  );

  return response.data;
};

export const updateTask = async (
  teamId: string,
  projectId: string,
  taskId: string,
  data: UpdateTaskInput,
): Promise<Task> => {
  const response = await apiClient.patch(
    `/teams/${teamId}/projects/${projectId}/tasks/${taskId}`,
    data,
  );

  return response.data;
};

export const deleteTask = async (
  teamId: string,
  projectId: string,
  taskId: string,
) => {
  await apiClient.delete(
    `/teams/${teamId}/projects/${projectId}/tasks/${taskId}`,
  );
};

export const getTaskUpdates = async (
  teamId: string,
  projectId: string,
  taskId: string,
  params: { page: number; size: number },
): Promise<PageResponse<TaskUpdate>> => {
  const res = await apiClient.get(
    `/teams/${teamId}/projects/${projectId}/tasks/${taskId}/updates`,
    { params },
  );

  return res.data;
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

export const createTaskUpdate = async (
  teamId: string,
  projectId: string,
  taskId: string,
  message: string,
) => {
  const response = await apiClient.post(
    `/teams/${teamId}/projects/${projectId}/tasks/${taskId}/updates`,
    { message },
  );

  return response.data;
};
