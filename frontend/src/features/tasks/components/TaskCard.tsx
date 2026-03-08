import { Card } from "../../../components/ui/card";
import type { Task } from "../types/taskTypes";

interface Props {
  task: Task;
  onOpen: (task: Task) => void;
}

export default function TaskCard({ task, onOpen }: Props) {
  return (
    <Card
      onClick={() => onOpen(task)}
      className="p-3 cursor-pointer hover:shadow-md transition"
    >
      <div className="space-y-2">
        <div className="text-sm font-semibold">
          #{task.taskNumber} {task.title}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{task.priority}</span>

          {task.assignedUser && <span>{task.assignedUser.firstName}</span>}
        </div>

        {task.plannedDueDate && (
          <div className="text-xs text-muted-foreground">
            📅 {new Date(task.plannedDueDate).toLocaleDateString()}
          </div>
        )}
      </div>
    </Card>
  );
}
