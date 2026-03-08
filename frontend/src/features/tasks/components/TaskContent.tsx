import TaskUpdateForm from "./TaskUpdateForm";
import type { Task } from "../types/taskTypes";
import TaskTimeline from "./TaskTimeline";

interface Props {
  teamId: string;
  projectId: string;
  taskId: string;
  task: Task;
}

export default function TaskContent({
  task,
  teamId,
  projectId,
  taskId,
}: Props) {
  return (
    <div className="flex-1 min-w-0 overflow-y-auto px-8 py-6 space-y-8">
      {/* TITLE */}

      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground text-sm">
            #{task.taskNumber}
          </span>

          <h1 className="text-2xl font-semibold tracking-tight">
            {task.title}
          </h1>
        </div>

        <p className="text-muted-foreground text-sm max-w-2xl">
          {task.description || "No description"}
        </p>
      </div>

      {/* COMMENT FORM */}

      <TaskUpdateForm />

      <div className="flex items-center justify-between mt-8">
        <h2 className="text-sm font-semibold">Activity</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-5">
        <TaskTimeline teamId={teamId} projectId={projectId} taskId={taskId} />
      </div>
    </div>
  );
}
