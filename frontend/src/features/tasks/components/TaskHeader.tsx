import PriorityBadge from "../../../common/components/PriorityBadge";
import UserSelector from "../../../common/components/UserSelector";
import { useTeamMembers } from "../../teams/hooks/useTeamMembers";
import { useAssignUser } from "../hooks/useAssignUser";
import { useUpdateTaskStatus } from "../hooks/useTaskUpdateStatus";
import type { Task } from "../types/taskTypes";
import type { TaskPriority } from "../utils/taskPriority";
import {
  allowedTransitions,
  isTaskStatus,
  TaskStatusLabel,
  TaskStatusStyles,
  type TaskStatus,
} from "../utils/taskStatus";

interface Props {
  teamId: string;
  projectId: string;
  taskId: string;
  task: Task;
}

export default function TaskHeader({ teamId, projectId, taskId, task }: Props) {
  const { data: members = [] } = useTeamMembers(teamId);

  const updateStatus = useUpdateTaskStatus(teamId, projectId);
  const assignUserMutation = useAssignUser(teamId, projectId, taskId);

  const currentStatus = task.status as TaskStatus;
  const nextStatuses = allowedTransitions[currentStatus] ?? [];

  const priority: TaskPriority = (task.priority ?? "LOW") as TaskPriority;

  const handleAssignUser = (userId: string) => {
    assignUserMutation.mutate(userId);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm">
            #{task.taskNumber}
          </span>
          <h1 className="text-2xl font-semibold">{task.title}</h1>
        </div>
        <PriorityBadge priority={priority} />
        <div
          className={`inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium ${
            TaskStatusStyles[currentStatus]
          }`}
        >
          <select
            value={currentStatus}
            onChange={(e) => {
              const value = e.target.value;

              if (!isTaskStatus(value)) return;

              updateStatus.mutate({
                taskId: task.id,
                status: value,
              });
            }}
            className="bg-transparent outline-none text-xs font-medium cursor-pointer"
          >
            <option value={currentStatus}>
              {TaskStatusLabel[currentStatus]}
            </option>

            {nextStatuses.map((status) => (
              <option key={status} value={status}>
                {TaskStatusLabel[status]}
              </option>
            ))}
          </select>
        </div>
      </div>
      <UserSelector
        value={task.assignedUser?.id}
        users={members}
        onSelect={handleAssignUser}
      />
    </div>
  );
}
