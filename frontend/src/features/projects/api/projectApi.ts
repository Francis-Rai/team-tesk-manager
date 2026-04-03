import { apiClient } from "../../../api/apiClients";
import type { DeletedFilter } from "../../../common/types/deletedFilter.types";
import type { Project } from "../types/projectTypes";

export const getProjects = async (
  teamId: string,
  params: {
    page?: number;
    size?: number;
    search?: string;
    status?: string;
    sort?: string;
    deletedFilter: DeletedFilter;
  },
) => {
  const response = await apiClient.get(`/teams/${teamId}/projects`, { params });
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
