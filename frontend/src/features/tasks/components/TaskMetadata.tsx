import type { Task } from "../types/taskTypes";
import PriorityBadge from "../../../common/components/PriorityBadge";
import { formatDateTimeShort } from "../../../common/utils/date";
import { TaskStatusLabel, TaskStatusStyles } from "../utils/taskStatus";

import UserSelector from "../../../common/components/UserSelector";

import { useTeamMembers } from "../../teams/hooks/useTeamMembers";
import { useAssignUser } from "../hooks/useAssignUser";
import { useAssignSupportUser } from "../hooks/useAssignSupportUser";

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

  function handleAssignUser(userId: string | null) {
    if (!userId || userId === task.assignedUser?.id) return;
    assignUserMutation.mutate(userId);
  }

  function handleAssignSupport(userId: string | null) {
    if (!userId || userId === task.supportUser?.id) return;
    assignSupportUserMutation.mutate(userId);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2">
      <Row
        label="Status"
        value={
          <div
            className={`inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium ${
              TaskStatusStyles[task.status]
            }`}
          >
            {TaskStatusLabel[task.status]}
          </div>
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
        value={<PriorityBadge priority={task.priority ?? "LOW"} />}
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
          task.plannedStartDate
            ? formatDateTimeShort(task.plannedStartDate)
            : "—"
        }
      />
      <Row
        label="Due Date"
        value={
          task.plannedDueDate ? formatDateTimeShort(task.plannedDueDate) : "—"
        }
      />
    </div>
  );
}
