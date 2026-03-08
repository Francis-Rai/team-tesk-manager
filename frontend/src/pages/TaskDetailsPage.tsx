import { useParams } from "react-router-dom";
import TaskTimeline from "../features/tasks/components/TaskTimeline";
import { useTask } from "../features/tasks/hooks/useTask";
import { useTaskUpdates } from "../features/tasks/hooks/useTaskUpdates";
import { useUpdateTaskStatus } from "../features/tasks/hooks/useTaskUpdateStatus";
import PriorityBadge from "../common/components/PriorityBadge";
import { useAssignUser } from "../features/tasks/hooks/useAssignUser";
import { useTeamMembers } from "../features/teams/hooks/useTeamMembers";
import UserSelector from "../common/components/UserSelector";
import TaskUpdateForm from "../features/tasks/components/TaskUpdateForm";
import { useState } from "react";
import EditTaskForm from "../features/tasks/components/EditTaskForm";
import {
  allowedTransitions,
  type TaskStatus,
} from "../features/tasks/utils/taskStatus";

export default function TaskDetailsPage() {
  const { teamId, projectId, taskId } = useParams();

  const { data: task, isLoading } = useTask(teamId!, projectId!, taskId!);

  const { data: updatesData } = useTaskUpdates(teamId!, projectId!, taskId!);

  const { data: members = [] } = useTeamMembers(teamId!);

  const handleAssignUser = (userId: string) => {
    assignUserMutation.mutate(userId);
  };

  const currentStatus = task?.status as TaskStatus;

  const nextStatuses = allowedTransitions[currentStatus] ?? [];

  const updates = updatesData?.content ?? [];
  const [editing, setEditing] = useState(false);
  const updateStatus = useUpdateTaskStatus(teamId!, projectId!);

  const assignUserMutation = useAssignUser(teamId!, projectId!, taskId!);

  if (isLoading) return <div>Loading task...</div>;

  return (
    <div className="space-y-6">
      <TaskUpdateForm />
      {editing ? (
        <EditTaskForm task={task} onClose={() => setEditing(false)} />
      ) : (
        <>
          <h1 className="text-2xl font-bold">
            #{task?.taskNumber} {task?.title}
          </h1>

          <p className="text-gray-500">{task?.description}</p>

          <button
            onClick={() => setEditing(true)}
            className="border px-3 py-1 rounded"
          >
            Edit Task
          </button>
        </>
      )}

      <div className="border rounded p-6 space-y-4">
        <div className="space-y-1">
          <strong>Status</strong>

          <select
            value={currentStatus}
            onChange={(e) =>
              updateStatus.mutate({
                taskId: task!.id,
                status: e.target.value,
              })
            }
            className="border p-2 rounded"
          >
            <option value={currentStatus}>{currentStatus}</option>

            {nextStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <strong>Priority</strong>

          <PriorityBadge priority={task?.priority ?? "LOW"} />
        </div>

        <div className="space-y-2">
          <strong>Assign User</strong>

          <UserSelector users={members} onSelect={handleAssignUser} />
        </div>
      </div>

      <TaskTimeline updates={updates} />
    </div>
  );
}
