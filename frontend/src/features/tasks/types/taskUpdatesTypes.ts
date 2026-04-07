import type { ActivityDetails, ActivityType } from "../../../common/types/activity.types";

export interface TaskUpdate {
  id: string;
  message: string;
  type: ActivityType;
  details: ActivityDetails;
  user: User;
  task?: Task;
  createdAt: string;
}

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
