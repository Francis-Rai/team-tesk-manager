export type ProjectStatus = "ACTIVE" | "ON_HOLD" | "COMPLETED";

export const ProjectStatusStyles: Record<ProjectStatus, string> = {
  ACTIVE: "bg-green-100 text-green-700 border-green-200",
  ON_HOLD: "bg-yellow-100 text-yellow-700 border-yellow-200",
  COMPLETED: "bg-blue-100 text-blue-700 border-blue-200",
};

export const ProjectStatusLabel: Record<ProjectStatus, string> = {
  ACTIVE: "Active",
  ON_HOLD: "On Hold",
  COMPLETED: "Completed",
};
