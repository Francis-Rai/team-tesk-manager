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

// // Fetch project by ID
// export const getProjectById = async (projectId: number) => {
//   const { data } = await apiClient.get(`/projects/${projectId}`);
//   return data;
// };

// // Update Project
// export const updateProject = async (
//   projectId: number,
//   payload: {
//     name?: string;
//     description?: string;
//   },
// ) => {
//   const { data } = await apiClient.patch(`/projects/${projectId}`, payload);
//   return data;
// };

// // Delete Project
// export const deleteProject = async (projectId: number): Promise<void> => {
//   await apiClient.delete(`/projects/${projectId}`);
// };
