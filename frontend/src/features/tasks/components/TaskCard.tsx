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
      className="border p-4 rounded hover:bg-gray-50 cursor-pointer"
    >
      {" "}
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">
          #{task.taskNumber} {task.title}
        </h3>

        <span className="text-xs bg-gray-200 px-2 py-1 rounded">
          {task.status}
        </span>
      </div>
      {task.description && (
        <p className="text-sm text-gray-500 mt-2">{task.description}</p>
      )}
      <div className="text-xs text-gray-400 mt-2">
        {task.assignedUser
          ? `Assigned to ${task.assignedUser.firstName} ${task.assignedUser.lastName}`
          : "Unassigned"}
      </div>
    </div>
  );
}
