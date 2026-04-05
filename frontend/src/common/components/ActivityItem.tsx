import { ChevronUp, ChevronDown } from "lucide-react";
import { useState } from "react";

import { activityFormatter } from "../utils/activityFormatter";
import { formatDateTimeShort } from "../utils/dateFormatter";

import { Button } from "../../components/ui/button";

import type { ProjectActivity } from "../../features/projects/types/projectTypes";

export function ActivityItem({
  item,
  onOpenTask,
}: {
  item: ProjectActivity;
  onOpenTask: (taskId: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const MAX_LENGTH = 120;
  const isLong = item.message.length > MAX_LENGTH;

  const formattedMessage = activityFormatter(item.message);

  const truncatedMessage = item.message.slice(0, MAX_LENGTH) + "...";

  const shouldTruncate = isLong && !expanded;

  return (
    <div
      onClick={() => onOpenTask(item.task.id)}
      className="flex items-start gap-3 px-2 py-2 rounded-md hover:bg-muted/40 transition cursor-pointer"
    >
      <div className="mt-2 h-1.5 w-1.5 rounded-full bg-muted-foreground shrink-0" />

      <div className="flex flex-col text-sm leading-relaxed max-w-2xl">
        <div className="text-sm">
          <span className="font-medium text-foreground">
            {item.user.firstName}
          </span>
          <span className="text-muted-foreground">updated</span>
          <span className="font-medium text-foreground">
            “{item.task.title}”
          </span>
          <span className="text-muted-foreground">
            {shouldTruncate ? truncatedMessage : formattedMessage}
          </span>
        </div>

        {isLong && (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded((prev) => !prev);
            }}
            className="h-auto p-0 mt-1 text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 w-fit"
          >
            {expanded ? (
              <>
                Show less <ChevronUp className="h-3 w-3" />
              </>
            ) : (
              <>
                Show more <ChevronDown className="h-3 w-3" />
              </>
            )}
          </Button>
        )}

        <span className="text-xs text-muted-foreground mt-1">
          {formatDateTimeShort(item.createdAt)}
        </span>
      </div>
    </div>
  );
}
