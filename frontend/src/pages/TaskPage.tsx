import { useParams } from "react-router-dom";
import TaskDescription from "../features/tasks/components/TaskDescription";
import TaskHeader from "../features/tasks/components/TaskHeader";
import TaskMetadata from "../features/tasks/components/TaskMetadata";
import TaskTimeline from "../features/tasks/components/TaskTimeline";
import TaskUpdateForm from "../features/tasks/components/TaskUpdateForm";
import { useTask } from "../features/tasks/hooks/useTask";

export default function TaskDetailsPage() {
  const { teamId, projectId, taskId } = useParams<{
    teamId: string;
    projectId: string;
    taskId: string;
  }>();

  const { data: task, isLoading } = useTask(
    teamId || "",
    projectId || "",
    taskId || "",
  );

  if (!teamId || !projectId || !taskId) {
    return <div className="p-6">Invalid task</div>;
  }

  if (isLoading || !task) {
    return <div className="p-6">Loading task...</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <TaskHeader task={task} teamId={teamId} projectId={projectId} />

      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="max-w-5xl mx-auto space-y-8">
          <TaskMetadata teamId={teamId} projectId={projectId} task={task} />

          <TaskDescription teamId={teamId} projectId={projectId} task={task} />

          <TaskUpdateForm
            teamId={teamId}
            projectId={projectId}
            taskId={task.id}
          />

          <TaskTimeline
            teamId={teamId}
            projectId={projectId}
            taskId={task.id}
          />
        </div>
      </div>
    </div>
  );
}
