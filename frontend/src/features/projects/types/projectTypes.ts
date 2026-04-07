import type { ProjectStatus } from "../utils/projectStatus";
import type { ActivityDetails, ActivityType } from "../../../common/types/activity.types";

export type Project = {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
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
  type: ActivityType;
  details: ActivityDetails;
  user: User;
  task?: Task | null;
  createdAt: string;
};

export interface UpdateProjectInput {
  name?: string;
  description?: string;
}
