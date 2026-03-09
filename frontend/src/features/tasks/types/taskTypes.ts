import type { TaskPriority } from "../utils/taskPriority";
import type { TaskStatus } from "../utils/taskStatus";

/*
 * Represents a task within a project.
 */
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

/*
 * Summary information about a user.
 */
export interface TaskUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}
