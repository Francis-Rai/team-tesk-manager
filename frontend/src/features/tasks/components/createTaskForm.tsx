import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createTaskSchema,
  type CreateTaskInput,
} from "../types/createTaskSchema";
import { useCreateTask } from "../hooks/useCreateTask";

export default function CreateTaskForm() {
  const { teamId, projectId } = useParams();

  const { mutate, isPending } = useCreateTask(teamId!, projectId!);

  const form = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),
  });

  const onSubmit = (data: CreateTaskInput) => {
    mutate(data);
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="border p-4 rounded space-y-4"
    >
      <h3 className="font-semibold">Create Task</h3>

      <div>
        <input
          {...form.register("title")}
          placeholder="Task title"
          className="border p-2 w-full rounded"
        />

        {form.formState.errors.title && (
          <p className="text-red-500 text-sm">
            {form.formState.errors.title.message}
          </p>
        )}
      </div>

      <div>
        <textarea
          {...form.register("description")}
          placeholder="Description"
          className="border p-2 w-full rounded"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {isPending ? "Creating..." : "Create Task"}
      </button>
    </form>
  );
}
