import EditableField from "../../../common/components/EditableField";
import { useUpdateTask } from "../hooks/useUpdateTask";
import type { Task } from "../types/taskTypes";

interface Props {
  teamId: string;
  projectId: string;
  task: Task;
}

export default function TaskDescription({ teamId, projectId, task }: Props) {
  const updateTask = useUpdateTask(teamId, projectId, task.id);

  return (
    <div className="space-y-2">
      <h2 className="text-sm font-medium text-muted-foreground">Description</h2>

      <EditableField
        value={task.description}
        displayClassName="text-sm leading-relaxed text-muted-foreground"
        inputClassName="text-sm font-medium"
        onSave={(value) => updateTask.mutate({ description: value })}
      />
    </div>
  );
}
