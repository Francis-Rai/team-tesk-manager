import { useTask } from "../hooks/useTask";
import TaskDescription from "./TaskDescription";

import TaskHeader from "./TaskHeader";
import TaskMetadata from "./TaskMetadata";
import TaskTimeline from "./TaskTimeline";
import TaskUpdateForm from "./TaskUpdateForm";

interface Props {
  teamId: string;
  projectId: string;
  taskId: string;
}

export default function TaskWorkspace({ teamId, projectId, taskId }: Props) {
  const { data: task, isLoading } = useTask(teamId, projectId, taskId);

  if (isLoading || !task) {
    return <div className="p-6">Loading task...</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <TaskHeader task={task} />

      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8">
        <TaskMetadata teamId={teamId} projectId={projectId} task={task} />

        <TaskDescription description={task.description} />

        <TaskUpdateForm teamId={teamId} projectId={projectId} taskId={taskId} />

        <TaskTimeline teamId={teamId} projectId={projectId} taskId={taskId} />
      </div>
    </div>
  );
}
