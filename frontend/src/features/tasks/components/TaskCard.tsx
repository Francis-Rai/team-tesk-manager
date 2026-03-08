import { Badge } from "../../../components/ui/badge";
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
      <div className="space-y-3">
        {/* Title */}
        <div className="text-sm font-semibold leading-tight">
          #{task.taskNumber} {task.title}
        </div>

        {/* Priority */}
        <div className="flex items-center gap-2">
          <PriorityBadge priority={task.priority} />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          {task.assignedUser && <span>👤 {task.assignedUser.firstName}</span>}

          {task.plannedDueDate && (
            <span>📅 {new Date(task.plannedDueDate).toLocaleDateString()}</span>
          )}
        </div>
      </div>
    </Card>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const colors: Record<string, string> = {
    LOW: "bg-gray-200 text-gray-700",
    MEDIUM: "bg-yellow-200 text-yellow-800",
    HIGH: "bg-red-200 text-red-800",
  };

  return <Badge className={colors[priority] ?? ""}>{priority}</Badge>;
}
