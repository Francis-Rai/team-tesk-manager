import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

import { cn } from "../../lib/utils";

import {
  type TaskPriority,
  TASK_PRIORITY_LABEL,
  TASK_PRIORITY_STYLES,
  TASK_PRIORITY_ORDER,
} from "../constants/task.constants";

interface Props {
  value: TaskPriority;
  onChange: (priority: TaskPriority) => void;
  className?: string;
}

export default function PrioritySelect({ value, onChange, className }: Props) {
  return (
    <Select
      value={value}
      onValueChange={(val) => onChange(val as TaskPriority)}
    >
      <SelectTrigger
        className={cn(
          "h-8 w-35 text-xs font-medium",
          TASK_PRIORITY_STYLES[value],
          className,
        )}
      >
        <SelectValue />
      </SelectTrigger>

      <SelectContent>
        {TASK_PRIORITY_ORDER.map((priority) => (
          <SelectItem key={priority} value={priority}>
            <span
              className={cn(
                "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
                TASK_PRIORITY_STYLES[priority],
              )}
            >
              {TASK_PRIORITY_LABEL[priority]}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
