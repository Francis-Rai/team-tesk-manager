import { useTask } from "../hooks/useTask";
import { useTeamMembers } from "../../teams/hooks/useTeamMembers";
import { useUpdateTaskStatus } from "../hooks/useTaskUpdateStatus";
import { useAssignUser } from "../hooks/useAssignUser";

import PriorityBadge from "../../../common/components/PriorityBadge";
import UserSelector from "../../../common/components/UserSelector";

import { allowedTransitions, type TaskStatus } from "../utils/taskStatus";

interface Props {
  teamId: string;
  projectId: string;
  taskId: string;
}

export default function TaskMeta({ teamId, projectId, taskId }: Props) {
  const { data: task } = useTask(teamId, projectId, taskId);
  const { data: members = [] } = useTeamMembers(teamId);

  const updateStatus = useUpdateTaskStatus(teamId, projectId);
  const assignUserMutation = useAssignUser(teamId, projectId, taskId);

  if (!task) return null;

  const currentStatus = task.status as TaskStatus;
  const nextStatuses = allowedTransitions[currentStatus] ?? [];

  const handleAssignUser = (userId: string) => {
    assignUserMutation.mutate(userId);
  };

  return (
    <div className="p-5 border-b space-y-6">
      {/* STATUS */}

      <div className="space-y-1">
        <div className="text-xs text-muted-foreground">Status</div>

        <select
          value={currentStatus}
          onChange={(e) =>
            updateStatus.mutate({
              taskId: task.id,
              status: e.target.value as TaskStatus,
            })
          }
          className="border rounded-md px-3 py-2 w-full text-sm"
        >
          <option value={currentStatus}>{currentStatus}</option>

          {nextStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {/* ASSIGNEE */}

      <div className="space-y-1">
        <div className="text-xs text-muted-foreground">Assignee</div>

        <UserSelector users={members} onSelect={handleAssignUser} />
      </div>

      {/* PRIORITY */}

      <div className="space-y-1">
        <div className="text-xs text-muted-foreground">Priority</div>

        <PriorityBadge priority={task.priority ?? "LOW"} />
      </div>
    </div>
  );
}
