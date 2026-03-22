import EditableField from "../../../common/components/EditableField";
import { useUpdateTask } from "../hooks/useUpdateTask";
import type { Task } from "../types/taskTypes";
import type { TaskPermissions } from "../utils/taskPermissions";

interface Props {
  teamId: string;
  projectId: string;
  task: Task;
  permissions: TaskPermissions;
}

export default function TaskDescription({
  teamId,
  projectId,
  task,
  permissions,
}: Props) {
  const updateTask = useUpdateTask(teamId, projectId, task.id);

  return (
    <div className="space-y-2">
      <h2 className="text-sm font-medium text-muted-foreground">Description</h2>

      <EditableField
        value={task.description}
        displayClassName="text-sm leading-relaxed text-muted-foreground"
        multiline
        maxLength={2000}
        inputClassName="text-sm font-medium"
        onSave={(value) => updateTask.mutate({ description: value })}
        disabled={!permissions.canEditTaskDetails}
      />
    </div>
  );
}
