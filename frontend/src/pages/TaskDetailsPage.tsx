import { useParams } from "react-router-dom";
import TaskTimeline from "../features/tasks/components/TaskTimeline";
import { useTask } from "../features/tasks/hooks/useTask";
import { useTaskUpdates } from "../features/tasks/hooks/useTaskUpdates";

export default function TaskDetailsPage() {
  const { teamId, projectId, taskId } = useParams();

  const { data: task, isLoading } = useTask(teamId!, projectId!, taskId!);

  const { data: updatesData } = useTaskUpdates(teamId!, projectId!, taskId!);

  const updates = updatesData?.content ?? [];

  if (isLoading) return <div>Loading task...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        #{task?.taskNumber} {task?.title}
      </h1>

      <p className="text-gray-500">{task?.description}</p>

      <div className="border rounded p-6 space-y-4">
        <div>
          <strong>Status:</strong> {task?.status}
        </div>

        <div>
          <strong>Priority:</strong> {task?.priority}
        </div>

        <div>
          <strong>Assigned:</strong>{" "}
          {task?.assignedUser
            ? `${task.assignedUser.firstName} ${task.assignedUser.lastName}`
            : "Unassigned"}
        </div>
      </div>

      <TaskTimeline updates={updates} />
    </div>
  );
}
