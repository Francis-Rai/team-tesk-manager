import PriorityBadge from "../../../common/components/PriorityBadge";
import { formatDateTimeShort } from "../../../common/utils/date";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { Card, CardContent, CardFooter } from "../../../components/ui/card";

import type { Task } from "../types/taskTypes";
import type { TaskPriority } from "../utils/taskPriority";

interface Props {
  task: Task;
  onOpen: (task: Task) => void;
}

export default function TaskCard({ task, onOpen }: Props) {
  return (
    <Card
      onClick={() => onOpen(task)}
      className="cursor-pointer hover:bg-muted/40 transition-colors"
    >
      <CardContent className=" space-y-3">
        {/* Top Row */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            #{task.taskNumber}
          </span>

          <PriorityBadge priority={task.priority ?? ("LOW" as TaskPriority)} />
        </div>

        {/* Title */}
        <h3 className="font-medium leading-snug">{task.title}</h3>

        {/* Description */}
        {task.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Bottom Metadata */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          {/* Assignee */}
          <div className="flex flex-wrap gap-3 items-center">
            Assigned To:
            {task.assignedUser && (
              <div className="flex items-center gap-1">
                <Avatar className="h-5 w-5">
                  <AvatarFallback>
                    {task.assignedUser.firstName[0]}
                    {task.assignedUser.lastName[0]}
                  </AvatarFallback>
                </Avatar>

                <span>{task.assignedUser.firstName}</span>
              </div>
            )}
            Support By:
            {/* Support */}
            {task.supportUser && (
              <div className="flex items-center gap-1">
                <Avatar className="h-5 w-5">
                  <AvatarFallback>
                    {task.supportUser.firstName[0]}
                    {task.supportUser.lastName[0]}
                  </AvatarFallback>
                </Avatar>

                <span>{task.supportUser.firstName}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        {/* Dates */}
        {(task.plannedStartDate || task.plannedDueDate) && (
          <div className="flex flex-wrap gap-2">
            <p className="text-green-700"> Start Date: </p>
            {formatDateTimeShort(task.plannedStartDate) ?? "—"}

            <p className="text-red-700"> Due Date: </p>
            {formatDateTimeShort(task.plannedDueDate) ?? "—"}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
