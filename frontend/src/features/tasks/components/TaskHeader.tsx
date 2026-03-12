import EditableField from "../../../common/components/EditableField";
import { useUpdateTask } from "../hooks/useUpdateTask";
import type { Task } from "../types/taskTypes";

interface Props {
  teamId: string;
  projectId: string;
  task: Task;
}

export default function TaskHeader({ teamId, projectId, task }: Props) {
  const updateTask = useUpdateTask(teamId, projectId, task.id);

  return (
    <div className="px-8 py-6 border-b space-y-2">
      <div className="text-xs text-muted-foreground">#{task.taskNumber}</div>
      <EditableField
        value={task.title}
        displayClassName="text-xl font-semibold"
        inputClassName="text-xl font-semibold"
        onSave={(value) => updateTask.mutate({ title: value })}
      />
    </div>
  );
}
