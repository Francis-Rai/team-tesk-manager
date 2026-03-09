export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export const allowedTransitions: Record<TaskStatus, TaskStatus[]> = {
  TODO: ["IN_PROGRESS", "DONE"],
  IN_PROGRESS: ["DONE"],
  DONE: ["IN_PROGRESS"],
};

export function canTransition(current: TaskStatus, next: TaskStatus) {
  return allowedTransitions[current]?.includes(next);
}

export function isTaskStatus(value: string): value is TaskStatus {
  return ["TODO", "IN_PROGRESS", "DONE"].includes(value);
}

export const TaskStatusLabel: Record<TaskStatus, string> = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};

export const TaskStatusStyles: Record<TaskStatus, string> = {
  TODO: "bg-gray-100 text-gray-700 border-gray-200",
  IN_PROGRESS: "bg-blue-100 text-blue-700 border-blue-200",
  DONE: "bg-green-100 text-green-700 border-green-200",
};
