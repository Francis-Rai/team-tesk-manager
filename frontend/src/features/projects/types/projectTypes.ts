import type { ProjectStatus } from "../utils/projectStatus";

export type Project = {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  status: ProjectStatus;
  createdBy: ProjectOwner;
};

export type ProjectOwner = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
};

export interface UpdateProjectInput {
  name?: string;
  description?: string;
}
