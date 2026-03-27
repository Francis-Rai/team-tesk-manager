import type { TaskPriority } from "../utils/taskPriority";
import type { TaskStatus } from "../utils/taskStatus";

export type Task = {
  id: string;

  taskNumber: number;

  title: string;
  description?: string;

  status: TaskStatus;
  priority: TaskPriority;

  assignedUser?: TaskUser;
  supportUser?: TaskUser;

  plannedStartDate?: string;
  plannedDueDate?: string;

  actualStartDate?: string;
  actualCompletionDate?: string;

  createdAt: string;
  updatedAt: string;
};

export interface TaskUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  priority?: string;
  plannedStartDate?: string | null;
  plannedDueDate?: string | null;
}