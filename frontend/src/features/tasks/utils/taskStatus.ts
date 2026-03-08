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
