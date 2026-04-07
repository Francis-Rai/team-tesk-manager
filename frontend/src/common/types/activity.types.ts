export type ActivityType =
  | "TASK_CREATED"
  | "TASK_UPDATED"
  | "TASK_DELETED"
  | "TASK_STATUS_CHANGED"
  | "TASK_ASSIGNEE_CHANGED"
  | "TASK_SUPPORT_ASSIGNED"
  | "TASK_SUPPORT_CHANGED"
  | "TASK_SUPPORT_REMOVED"
  | "TASK_COMMENTED"
  | "PROJECT_UPDATED"
  | "TEAM_UPDATED";

export interface ActivityDetails {
  fields: string[];
  from: string | null;
  to: string | null;
  target: string | null;
}
