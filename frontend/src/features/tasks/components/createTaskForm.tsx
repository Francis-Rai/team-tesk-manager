import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useCreateTask } from "../hooks/useCreateTask";
import {
  createTaskSchema,
  type CreateTaskInput,
} from "../types/createTaskSchema";

interface Props {
  projectId: string;
  onSuccess?: () => void;
}

export function CreateTaskForm({ projectId, onSuccess }: Props) {
  const createTaskMutation = useCreateTask(projectId);

  const form = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "MEDIUM",
    },
  });

  const onSubmit = (data: CreateTaskInput) => {
    createTaskMutation.mutate(data, {
      onSuccess: () => {
        form.reset();
        onSuccess?.();
      },
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <input
        {...form.register("title")}
        placeholder="Task title"
        className="w-full border p-2 rounded"
      />

      <textarea
        {...form.register("description")}
        placeholder="Description"
        className="w-full border p-2 rounded"
      />

      <select
        {...form.register("priority")}
        className="w-full border p-2 rounded"
      >
        <option value="LOW">LOW</option>
        <option value="MEDIUM">MEDIUM</option>
        <option value="HIGH">HIGH</option>
      </select>

      <input
        type="date"
        {...form.register("plannedStartDate")}
        className="w-full border p-2 rounded"
      />

      <input
        type="date"
        {...form.register("plannedDueDate")}
        className="w-full border p-2 rounded"
      />

      <button
        type="submit"
        disabled={createTaskMutation.isPending}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Create Task
      </button>
    </form>
  );
}
