import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  type TaskStatus,
  TaskStatusStyles,
  TaskStatusLabel,
} from "../../features/tasks/utils/taskStatus";

import { cn } from "../../lib/utils";

interface Props {
  value: TaskStatus;
  onChange: (status: TaskStatus) => void;
  className?: string;
}

export default function StatusSelector({ value, onChange, className }: Props) {
  const statuses: TaskStatus[] = [
    "IN_PROGRESS",
    "IN_REVIEW",
    "ON_HOLD",
    "DONE",
    "CANCELLED",
  ];

  return (
    <Select value={value} onValueChange={(v) => onChange(v as TaskStatus)}>
      {/* Trigger (shows selected status) */}
      <SelectTrigger
        className={cn(
          "h-8 w-35 text-xs font-medium",
          TaskStatusStyles[value],
          className,
        )}
      >
        <SelectValue />
      </SelectTrigger>

      {/* Dropdown */}
      <SelectContent>
        {statuses.map((status) => (
          <SelectItem key={status} value={status}>
            <span
              className={cn(
                "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
                TaskStatusStyles[status],
              )}
            >
              {TaskStatusLabel[status]}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
