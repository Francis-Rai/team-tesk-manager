import { useParams } from "react-router-dom";
import TaskDetailsContent from "../features/tasks/components/TaskWorkspace";

export default function TaskDetailsPage() {
  const { teamId, projectId, taskId } = useParams();

  if (!teamId || !projectId || !taskId) {
    return <div>Invalid task</div>;
  }

  return (
    <div className="p-6">
      <TaskDetailsContent
        teamId={teamId}
        projectId={projectId}
        taskId={taskId}
      />
    </div>
  );
}
