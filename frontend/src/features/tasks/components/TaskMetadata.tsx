import type { Task } from "../types/task.types";
import UserSelector from "../../../common/components/UserSelector";

import { useTeamMembers } from "../../teams/hooks/useTeamMembers";
import { useAssignUser } from "../hooks/useAssignUser";
import { useAssignSupportUser } from "../hooks/useAssignSupportUser";
import PrioritySelect from "../../../common/components/PrioritySelector";
import { useUpdateTask } from "../hooks/useUpdateTask";
import DatePicker from "../../../common/components/DatePicker";
import StatusSelect from "../../../common/components/TaskStatusSelector";
import type { TaskStatus } from "../utils/taskStatus";
import { useUpdateTaskStatus } from "../hooks/useUpdateTaskStatus";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

interface Props {
  teamId: string;
  projectId: string;
  task: Task;
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid gap-1.5 border-b border-border/50 py-2.5 last:border-b-0 first:pt-0 last:pb-0 sm:grid-cols-[5.75rem_minmax(0,1fr)] sm:items-center sm:gap-3">
      <div className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </div>
      <div className="min-w-0 text-sm">{value}</div>
    </div>
  );
}

export default function TaskMetadata({ teamId, projectId, task }: Props) {
  const { data } = useTeamMembers(teamId);
  const members = data?.content ?? [];
  const currentAssigneeId = task.assignedUser?.id;
  const currentSupportId = task.supportUser?.id;

  const assignUserMutation = useAssignUser(teamId, projectId, task.id);

  const assignSupportUserMutation = useAssignSupportUser(
    teamId,
    projectId,
    task.id,
  );

  const updateTaskMutation = useUpdateTask(teamId, projectId, task.id);

  function handleAssignUser(userId: string | null) {
    if (!userId || userId === currentAssigneeId) return;
    assignUserMutation.mutate(userId);
  }

  function handleAssignSupport(userId: string | null) {
    if (!userId) {
      return;
    }

    if (userId === currentSupportId || userId === currentAssigneeId) return;

    assignSupportUserMutation.mutate(userId);
  }

  function handleUpdatePriority(priority: string | null) {
    if (!priority || priority === task.priority) return;
    updateTaskMutation.mutate({
      priority,
    });
  }

  function handleUpdatePlannedStartDate(plannedStartDate: string | null) {
    if (!plannedStartDate || plannedStartDate === task.plannedStartDate) return;
    if (
      task.plannedDueDate &&
      new Date(plannedStartDate) > new Date(task.plannedDueDate)
    ) {
      updateTaskMutation.mutate({
        plannedStartDate,
        plannedDueDate: plannedStartDate,
      });
      return;
    }

    updateTaskMutation.mutate({
      plannedStartDate,
    });
  }

  function handleUpdatePlannedDueDate(plannedDueDate: string | null) {
    if (!plannedDueDate || plannedDueDate === task.plannedDueDate) return;
    updateTaskMutation.mutate({
      plannedDueDate,
    });
  }

  const updateStatus = useUpdateTaskStatus(teamId, projectId);

  function handleStatusChange(taskId: string, status: TaskStatus) {
    updateStatus.mutate({
      taskId,
      status,
    });
  }

  return (
    <section className="rounded-2xl border border-border/60 bg-background p-4 shadow-xs">
      <div>
        <h2 className="text-sm font-semibold text-foreground">Details</h2>
      </div>

      <div className="mt-2">
        <Row
          label="Status"
          value={
            <StatusSelect
              value={task.status}
              onChange={(status) => handleStatusChange(task.id, status)}
            />
          }
        />
        <Row
          label="Assignee"
          value={
            <UserSelector
              key={"assignee"}
              users={members}
              value={currentAssigneeId}
              placeholder="Select assignee"
              excludedUserIds={currentSupportId ? [currentSupportId] : []}
              onChange={handleAssignUser}
            />
          }
        />
        <Row
          label="Priority"
          value={
            <PrioritySelect
              value={task.priority ?? "LOW"}
              onChange={(priority) => handleUpdatePriority(priority)}
            />
          }
        />
        <Row
          label="Support"
          value={
            <UserSelector
              key={"support"}
              users={members}
              value={currentSupportId}
              placeholder="Select support"
              allowClear
              excludedUserIds={currentAssigneeId ? [currentAssigneeId] : []}
              onChange={handleAssignSupport}
            />
          }
        />
        <Row
          label="Planned Start Date"
          value={
            <DatePicker
              value={
                task.plannedStartDate
                  ? new Date(task.plannedStartDate)
                  : undefined
              }
              onChange={(date) =>
                handleUpdatePlannedStartDate(date ? date.toISOString() : null)
              }
            />
          }
        />
        <Row
          label="Planned Due Date"
          value={
            <DatePicker
              value={
                task.plannedDueDate ? new Date(task.plannedDueDate) : undefined
              }
              onChange={(date) =>
                handleUpdatePlannedDueDate(date ? date.toISOString() : null)
              }
              disabled={(date) =>
                task.plannedStartDate
                  ? date < new Date(task.plannedStartDate)
                  : false
              }
            />
          }
        />

        <Row
          label="Actual Start Date"
          value={
            <span className="flex w-fit max-w-full flex-wrap items-center rounded-lg bg-muted/25 px-3 py-2 text-left text-muted-foreground">
              <CalendarIcon className="mr-2 h-4 w-4" />

              {task.actualStartDate
                ? format(task.actualStartDate, "MMM dd, yyyy")
                : "-"}
            </span>
          }
        />
        <Row
          label="Actual Due Date"
          value={
            <span className="flex w-fit max-w-full flex-wrap items-center rounded-lg bg-muted/25 px-3 py-2 text-left text-muted-foreground">
              <CalendarIcon className="mr-2 h-4 w-4" />

              {task.actualCompletionDate
                ? format(task.actualCompletionDate, "MMM dd, yyyy")
                : "-"}
            </span>
          }
        />
      </div>
    </section>
  );
}
