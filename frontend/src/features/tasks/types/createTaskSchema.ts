import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),

  description: z.string().max(2000).optional(),

  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),

  assigneeId: z.string().uuid("Invalid assignee"),

  supportId: z.string().uuid().optional(),

  plannedStartDate: z
    .string()
    .min(1, "Start date is required")
    .transform((date) => `${date}T00:00:00Z`),

  plannedDueDate: z
    .string()
    .min(1, "Due date is required")
    .transform((date) => `${date}T00:00:00Z`),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
