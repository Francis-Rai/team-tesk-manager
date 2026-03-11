import type { Task } from "../types/taskTypes";
import UserSelector from "../../../common/components/UserSelector";

import { useTeamMembers } from "../../teams/hooks/useTeamMembers";
import { useAssignUser } from "../hooks/useAssignUser";
import { useAssignSupportUser } from "../hooks/useAssignSupportUser";
import PrioritySelect from "../../../common/components/PrioritySelector";
import { useUpdateTask } from "../hooks/useUpdateTask";
import DatePicker from "../../../common/components/DatePicker";
import StatusSelect from "../../../common/components/StatusSelector";
import type { TaskStatus } from "../utils/taskStatus";
import { useUpdateTaskStatus } from "../hooks/useUpdateTaskStatus";

interface Props {
  teamId: string;
  projectId: string;
  task: Task;
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-start">
      <span className="w-25 shrink-0 text-xs text-muted-foreground">
        {label}
      </span>

      <div className="text-sm whitespace-nowrap">{value}</div>
    </div>
  );
}

export default function TaskMetadata({ teamId, projectId, task }: Props) {
  const { data: members = [] } = useTeamMembers(teamId);

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2">
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
            users={members}
            value={task.supportUser?.id}
            placeholder="Select support"
            allowClear
            onChange={handleAssignSupport}
          />
        }
      />
      <Row
        label="Start Date"
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
        label="Due Date"
        value={
          <DatePicker
            value={
              task.plannedDueDate ? new Date(task.plannedDueDate) : undefined
            }
            onChange={(date) =>
              handleUpdatePlannedDueDate(date ? date.toISOString() : null)
            }
          />
        }
      />
    </div>
  );
}
