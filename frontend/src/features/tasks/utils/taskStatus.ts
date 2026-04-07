export type TaskStatus =
  | "TODO"
  | "IN_PROGRESS"
  | "IN_REVIEW"
  | "ON_HOLD"
  | "DONE"
  | "CANCELLED";

/*
 Transition rule:
 - Tasks can move between any statuses
 - Once a task leaves TODO, it cannot go back to TODO
*/

export const allowedTransitions: Record<TaskStatus, TaskStatus[]> = {
  TODO: ["IN_PROGRESS", "IN_REVIEW", "ON_HOLD", "DONE", "CANCELLED"],

  IN_PROGRESS: ["IN_REVIEW", "ON_HOLD", "DONE", "CANCELLED"],

  IN_REVIEW: ["IN_PROGRESS", "ON_HOLD", "DONE", "CANCELLED"],

  ON_HOLD: ["IN_PROGRESS", "IN_REVIEW", "DONE", "CANCELLED"],

  DONE: ["IN_REVIEW", "ON_HOLD"],

  CANCELLED: [],
};

export function canTransition(current: TaskStatus, next: TaskStatus) {
  return allowedTransitions[current]?.includes(next);
}

export function isTaskStatus(value: string): value is TaskStatus {
  return [
    "TODO",
    "IN_PROGRESS",
    "IN_REVIEW",
    "ON_HOLD",
    "DONE",
    "CANCELLED",
  ].includes(value);
}

export const TaskStatusLabel: Record<TaskStatus, string> = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  IN_REVIEW: "In Review",
  ON_HOLD: "On Hold",
  DONE: "Done",
  CANCELLED: "Cancelled",
};

export const TaskStatusStyles: Record<TaskStatus, string> = {
  TODO: "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 border-gray-200",

  IN_PROGRESS:
    "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 border-blue-200",

  IN_REVIEW:
    "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-700 border-purple-200",

  ON_HOLD:
    "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-700 border-yellow-200",

  DONE: "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 border-green-200",

  CANCELLED:
    "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 border-red-200",
};
