import type { ProjectStatus } from "../utils/projectStatus";

export type Project = {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  lastActivityAt: string;
  status: ProjectStatus;
  createdBy: User;
};

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
};

type Task = {
  id: string;
  title: string;
};

export type ProjectActivity = {
  id: string;
  message: string;
  user: User;
  task: Task;
  createdAt: string;
};

export interface UpdateProjectInput {
  name?: string;
  description?: string;
}
