import { apiClient } from "../../../api/apiClients";
import type { PageResponse } from "../../../common/types/pageResponse";
import type { Project } from "../types/projectTypes";

export const getProjects = async (
  teamId: string,
): Promise<PageResponse<Project>> => {
  const response = await apiClient.get(`/teams/${teamId}/projects`);
  return response.data;
};

export const createProject = async (
  teamId: string,
  data: { name: string; description?: string },
): Promise<Project> => {
  const response = await apiClient.post(`/teams/${teamId}/projects`, data);
  return response.data;
};

export const getProject = async (
  teamId: string,
  projectId: string,
): Promise<Project> => {
  const response = await apiClient.get(
    `/teams/${teamId}/projects/${projectId}`,
  );

  return response.data;
};

export const updateProject = async (
  teamId: string,
  projectId: string,
  data: {
    name?: string;
    description?: string;
  },
): Promise<Project> => {
  const response = await apiClient.patch(
    `/teams/${teamId}/projects/${projectId}`,
    data,
  );
  return response.data;
};

export const deleteProject = async (teamId: string, projectId: string) => {
  await apiClient.delete(`/teams/${teamId}/projects/${projectId}`);
};
