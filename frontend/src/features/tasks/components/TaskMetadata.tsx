import type { Task } from "../types/taskTypes";
import UserSelector from "../../../common/components/UserSelector";

import { useTeamMembers } from "../../team-member/hooks/useTeamMembers";
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
    <div className="flex items-center gap-4">
      <span className="w-36 text-xs text-muted-foreground">{label}</span>
      <div className="text-sm">{value}</div>
    </div>
  );
}

export default function TaskMetadata({ teamId, projectId, task }: Props) {
  const { data } = useTeamMembers(teamId);
  const members = data?.content ?? [];

  const assignUserMutation = useAssignUser(teamId, projectId, task.id);

  const assignSupportUserMutation = useAssignSupportUser(
    teamId,
    projectId,
    task.id,
  );

  const updateTaskMutation = useUpdateTask(teamId, projectId, task.id);

  function handleAssignUser(userId: string | null) {
    if (!userId || userId === task.assignedUser?.id) return;
    assignUserMutation.mutate(userId);
  }

  function handleAssignSupport(userId: string | null) {
    if (!userId || userId === task.supportUser?.id) return;
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
            value={task.assignedUser?.id}
            placeholder="Select assignee"
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
            value={task.supportUser?.id}
            placeholder="Select support"
            allowClear
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
          <span className="flex flex-wrap w-fit max-w-50 p-2 items-center text-left">
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
          <span className="flex flex-wrap w-fit max-w-50 p-2 items-center text-left">
            <CalendarIcon className="mr-2 h-4 w-4" />

            {task.actualCompletionDate
              ? format(task.actualCompletionDate, "MMM dd, yyyy")
              : "-"}
          </span>
        }
      />
    </div>
  );
}
