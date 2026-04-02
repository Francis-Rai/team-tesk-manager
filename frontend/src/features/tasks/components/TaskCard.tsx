import PriorityBadge from "../../../common/components/PriorityBadge";
import { formatDate } from "../../../common/utils/date";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { Card, CardContent, CardFooter } from "../../../components/ui/card";
import { Label } from "../../../components/ui/label";

import type { Task } from "../types/taskTypes";

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
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            #{task.taskNumber}
          </span>

          <PriorityBadge priority={task.priority ?? "LOW"} />
        </div>

        <Label className="text-xs font-medium leading-snug line-clamp-2">
          {task.title}
        </Label>

        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {task.assignedUser && (
            <div className="flex items-center gap-1">
              <Avatar className="h-5 w-5">
                <AvatarFallback>
                  {task.assignedUser.lastName?.[0]}
                  {task.assignedUser.firstName?.[0]}
                </AvatarFallback>
              </Avatar>

              <span>{task.assignedUser.lastName}</span>
            </div>
          )}

          {task.supportUser && (
            <div className="flex items-center gap-1">
              <Avatar className="h-5 w-5">
                <AvatarFallback>
                  {task.supportUser.lastName?.[0]}
                  {task.supportUser.firstName?.[0]}
                </AvatarFallback>
              </Avatar>

              <span>{task.supportUser.lastName}</span>
            </div>
          )}
        </div>
      </CardContent>

      {(task.plannedStartDate || task.plannedDueDate) && (
        <CardFooter className="px-4 py-3 border-t text-xs text-muted-foreground flex flex-wrap gap-4">
          {task.plannedStartDate && (
            <span>Start: {formatDate(task.plannedStartDate)}</span>
          )}

          {task.plannedDueDate && (
            <span>Due: {formatDate(task.plannedDueDate)}</span>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
