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

export default function TaskHeader({
  teamId,
  projectId,
  task,
  permissions,
}: Props) {
  const updateTask = useUpdateTask(teamId, projectId, task.id);
  console.log(permissions);

  return (
    <div className="px-8 py-6 border-b space-y-2">
      <div className="text-xs text-muted-foreground">#{task.taskNumber}</div>
      <EditableField
        value={task.title}
        displayClassName="text-xl font-semibold"
        inputClassName="text-xl font-semibold"
        onSave={(value) => updateTask.mutate({ title: value })}
        disabled={!permissions.canEditTaskDetails}
      />
    </div>
  );
}
