import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useCreateTask } from "../hooks/useCreateTask";
import { useTeamMembers } from "../../teams/hooks/useTeamMembers";

import UserSelector from "../../../common/components/UserSelector";

import {
  createTaskSchema,
  type CreateTaskInput,
} from "../types/createTaskSchema";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Select,
} from "../../../components/ui/select";
import { Textarea } from "../../../components/ui/textarea";
import { Label } from "../../../components/ui/label";
import { Separator } from "../../../components/ui/separator";
import DatePicker from "../../../common/components/DatePicker";
import type { TaskPriority } from "../utils/taskPriority";

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
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      assigneeId: "",
      supportId: undefined,
      plannedStartDate: "",
      plannedDueDate: "",
    },
  });

  const start = form.watch("plannedStartDate");
  const due = form.watch("plannedDueDate");

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
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Title</Label>
        <Input {...form.register("title")} placeholder="Enter task title..." />
      </div>
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Description</Label>
        <Textarea
          {...form.register("description")}
          rows={4}
          placeholder="Add more details about this task..."
          className="resize-none"
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Priority</Label>

          <Select
            value={form.watch("priority")}
            onValueChange={(value) =>
              form.setValue("priority", value as TaskPriority, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
          >
            <SelectTrigger className="w-full border rounded-md px-3 py-2 text-sm">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="LOW">Low</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Assignee</Label>

          <UserSelector
            users={members}
            value={form.watch("assigneeId")}
            onChange={(id) =>
              form.setValue("assigneeId", id ?? "", {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
            placeholder="Select User"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Support</Label>

          <UserSelector
            users={members}
            allowClear
            value={form.watch("supportId")}
            onChange={(id) => form.setValue("supportId", id ?? undefined)}
            placeholder="Optional"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Planned Start</Label>

          <DatePicker
            value={start ? new Date(start) : undefined}
            onChange={(date) => {
              const iso = date ? date.toISOString() : "";

              form.setValue("plannedStartDate", iso, {
                shouldValidate: true,
                shouldDirty: true,
              });

              if (due && date && new Date(iso) > new Date(due)) {
                form.setValue("plannedDueDate", iso);
              }

              form.trigger("plannedDueDate");
            }}
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Planned Due</Label>

          <DatePicker
            value={due ? new Date(due) : undefined}
            onChange={(date) =>
              form.setValue("plannedDueDate", date ? date.toISOString() : "", {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
            disabled={(date) => {
              if (!start) return true;

              return date < new Date(start);
            }}
          />
        </div>
      </div>
      <Separator />

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>

        <Button
          type="submit"
          variant="default"
          disabled={createTaskMutation.isPending || !form.formState.isValid}
        >
          {createTaskMutation.isPending ? "Creating..." : "Create Task"}
        </Button>
      </div>
    </form>
  );
}
