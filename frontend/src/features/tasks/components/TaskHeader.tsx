import type { Task } from "../types/taskTypes";

interface Props {
  task: Task;
}

export default function TaskHeader({ task }: Props) {
  return (
    <div className="px-8 py-6 border-b space-y-2">
      <div className="text-xs text-muted-foreground">#{task.taskNumber}</div>

      <h1 className="text-xl font-semibold leading-tight">{task.title}</h1>
    </div>
  );
}
