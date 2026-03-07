import { apiClient } from "../../api/apiClients";
import type { Project } from "./project.types";

//  * Fetch all projects.
export const getProjects = async (): Promise<Project[]> => {
  const { data } = await apiClient.get("/projects");
  return data;
};

// Fetch project by ID
export const getProjectById = async (projectId: number) => {
  const { data } = await apiClient.get(`/projects/${projectId}`);
  return data;
};

// Create Project
export const createProject = async (payload: {
  name: string;
  description?: string;
}): Promise<Project> => {
  const { data } = await apiClient.post("/projects", payload);
  return data;
};

// Update Project
export const updateProject = async (
  projectId: number,
  payload: {
    name?: string;
    description?: string;
  },
) => {
  const { data } = await apiClient.patch(`/projects/${projectId}`, payload);
  return data;
};

// Delete Project
export const deleteProject = async (projectId: number): Promise<void> => {
  await apiClient.delete(`/projects/${projectId}`);
};
