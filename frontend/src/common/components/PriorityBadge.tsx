import type { TaskPriority } from "../../features/tasks/utils/taskPriority";
import { cn } from "../../lib/utils";
import { TaskPriorityLabel, TaskPriorityStyles } from "../utils/taskPriority";

interface Props {
  priority: TaskPriority;
  className?: string;
}

export default function PriorityBadge({ priority, className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
        TaskPriorityStyles[priority],
        className,
      )}
    >
      {TaskPriorityLabel[priority]}
    </span>
  );
}
