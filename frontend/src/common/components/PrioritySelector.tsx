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
  TaskPriorityLabel,
  TaskPriorityStyles,
  TaskPriorityOrder,
} from "../utils/taskPriorityStyles";

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
          TaskPriorityStyles[value],
          className,
        )}
      >
        <SelectValue />
      </SelectTrigger>

      <SelectContent>
        {TaskPriorityOrder.map((priority) => (
          <SelectItem key={priority} value={priority}>
            <span
              className={cn(
                "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
                TaskPriorityStyles[priority],
              )}
            >
              {TaskPriorityLabel[priority]}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
