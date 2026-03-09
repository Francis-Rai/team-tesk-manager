import type { TaskPriority } from "../../features/tasks/utils/taskPriority";
import { cn } from "../../lib/utils";

interface Props {
  priority: TaskPriority;
  className?: string;
}

const PRIORITY_STYLES: Record<TaskPriority, string> = {
  HIGH: "bg-red-100 text-red-700 border-red-200",
  MEDIUM: "bg-yellow-100 text-yellow-700 border-yellow-200",
  LOW: "bg-green-100 text-green-700 border-green-200",
};

export default function PriorityBadge({ priority, className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
        PRIORITY_STYLES[priority],
        className,
      )}
    >
      {priority}
    </span>
  );
}
