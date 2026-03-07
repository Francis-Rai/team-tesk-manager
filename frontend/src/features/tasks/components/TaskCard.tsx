import PriorityBadge from "../../../common/components/PriorityBadge";
import type { Task } from "../types/taskTypes";
import { useNavigate, useParams } from "react-router-dom";

interface Props {
  task: Task;
}

export default function TaskCard({ task }: Props) {
  const navigate = useNavigate();
  const { teamId, projectId } = useParams();
  return (
    <div
      onClick={() =>
        navigate(`/teams/${teamId}/projects/${projectId}/tasks/${task.id}`)
      }
      className="border p-4 rounded hover:bg-gray-50 cursor-pointer space-y-2"
    >
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">
          #{task.taskNumber} {task.title}
        </h3>

        <PriorityBadge priority={task.priority} />
      </div>

      {task.description && (
        <p className="text-sm text-gray-500">{task.description}</p>
      )}

      <div className="flex justify-between text-xs text-gray-400">
        <span>{task.status}</span>

        <span>
          {task.assignedUser
            ? `${task.assignedUser.firstName} ${task.assignedUser.lastName}`
            : "Unassigned"}
        </span>
      </div>
    </div>
  );
}
