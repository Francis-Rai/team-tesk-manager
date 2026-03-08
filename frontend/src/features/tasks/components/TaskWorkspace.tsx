import { useTask } from "../hooks/useTask";

import TaskHeader from "./TaskHeader";
import TaskContent from "./TaskContent";
import TaskSidebar from "./TaskSidebar";

interface Props {
  teamId: string;
  projectId: string;
  taskId: string;
}

export default function TaskWorkSpace({ teamId, projectId, taskId }: Props) {
  const { data: task, isLoading } = useTask(teamId, projectId, taskId);

  if (isLoading || !task) {
    return <div className="p-6">Loading task...</div>;
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* HEADER */}
      <TaskHeader
        teamId={teamId}
        projectId={projectId}
        taskId={taskId}
        taskNumber={task.taskNumber}
      />

      {/* WORKSPACE */}
      <div className="flex flex-1 min-h-0">
        <TaskContent
          teamId={teamId}
          projectId={projectId}
          taskId={taskId}
          task={task}
        />

        <TaskSidebar teamId={teamId} projectId={projectId} taskId={taskId} />
      </div>
    </div>
  );
}
