import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useCreateTask } from "../hooks/useCreateTask";
import { useTeamMembers } from "../../teams/hooks/useTeamMembers";

import UserSelector from "../../../common/components/UserSelector";

import {
  createTaskSchema,
  type CreateTaskInput,
} from "../types/createTaskSchema";

interface Props {
  teamId: string;
  projectId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateTaskForm({
  teamId,
  projectId,
  onSuccess,
  onCancel,
}: Props) {
  const createTaskMutation = useCreateTask(teamId, projectId);
  const { data: members = [] } = useTeamMembers(teamId);

  const form = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "MEDIUM",
      assigneeId: "",
      supportId: undefined,
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
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Title */}
      <div>
        <input
          {...form.register("title")}
          placeholder="Task title"
          className="w-full text-base font-medium border rounded-md px-3 py-2"
        />
      </div>

      {/* Description */}
      <div>
        <textarea
          {...form.register("description")}
          rows={3}
          placeholder="Add a description..."
          className="w-full text-sm border rounded-md px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Task Properties */}
      <div className="grid grid-cols-3 gap-3">
        {/* Priority */}
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Priority</label>

          <select
            {...form.register("priority")}
            className="w-full border rounded-md px-3 py-2 text-sm"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>

        {/* Assignee */}
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Assignee</label>

          <UserSelector
            users={members}
            value={form.watch("assigneeId")}
            onChange={(id) => form.setValue("assigneeId", id ?? "")}
            placeholder={""}
          />
        </div>

        {/* Support */}
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Support</label>

          <UserSelector
            users={members}
            allowClear
            value={form.watch("supportId")}
            onChange={(id) => form.setValue("supportId", id ?? undefined)}
            placeholder={""}
          />
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Planned Start</label>

          <input
            type="date"
            {...form.register("plannedStartDate")}
            className="w-full border rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Planned Due</label>

          <input
            type="date"
            {...form.register("plannedDueDate")}
            className="w-full border rounded-md px-3 py-2 text-sm"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-2 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="text-sm px-3 py-1.5 rounded-md border hover:bg-muted"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={createTaskMutation.isPending}
          className="text-sm px-4 py-1.5 rounded-md bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          Create Task
        </button>
      </div>
    </form>
  );
}
