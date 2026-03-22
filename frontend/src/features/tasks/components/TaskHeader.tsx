import EditableField from "../../../common/components/EditableField";
import { useUpdateTask } from "../hooks/useUpdateTask";
import type { Task } from "../types/taskTypes";
import type { TaskPermissions } from "../utils/taskPermissions";

import { DeleteTaskButton } from "./DeleteTaskButton";

interface Props {
  teamId: string;
  projectId: string;
  task: Task;
  permissions: TaskPermissions;
  onTaskDeleted?: () => void;
}

export default function TaskHeader({
  teamId,
  projectId,
  task,
  permissions,
  onTaskDeleted,
}: Props) {
  const updateTask = useUpdateTask(teamId, projectId, task.id);

  return (
    <div className="px-8 py-6 border-b bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="max-w-5xl mx-auto space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground tracking-wide">
            TASK #{task.taskNumber}
          </div>

          {permissions.canDeleteTask && (
            <DeleteTaskButton
              teamId={teamId}
              projectId={projectId}
              taskId={task.id}
              taskTitle={task.title}
              onTaskDeleted={onTaskDeleted}
            />
          )}
        </div>
        <EditableField
          value={task.title}
          displayClassName="text-2xl font-semibold leading-tight tracking-tight"
          inputClassName="text-2xl font-semibold"
          onSave={(value) => updateTask.mutate({ title: value })}
          disabled={!permissions.canEditTaskDetails}
        />
      </div>
    </div>
  );
}
