export interface CreateTaskTypes {
  title: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  plannedStartDate: string;
  plannedDueDate: string;
  assigneeId: string;
  supportId?: string;
}
