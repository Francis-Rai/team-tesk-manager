import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),

  description: z.string().optional(),

  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),

  plannedStartDate: z.string().optional(),

  plannedDueDate: z.string().optional(),

  assigneeId: z.string().uuid().optional(),

  supportId: z.string().uuid().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;