import { ChevronUp, ChevronDown } from "lucide-react";
import { useState } from "react";
import { formatTimelineMessage } from "../../../common/utils/activityFormatter";
import { formatDateTimeShort } from "../../../common/utils/dateFormat";
import { Button } from "../../../components/ui/button";

export function ActivityItem({
  item,
  onOpenTask,
}: {
  item: {
    id: string;
    userName: string;
    taskTitle: string;
    action: string;
    createdAt: string;
    taskId: string;
  };
  onOpenTask: (taskId: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const MAX_LENGTH = 120;
  const isLong = item.action.length > MAX_LENGTH;

  const displayMessage =
    !isLong || expanded
      ? item.action
      : item.action.slice(0, MAX_LENGTH) + "...";

  return (
    <div
      onClick={() => onOpenTask(item.taskId)}
      className="
        flex items-start gap-3 px-2 py-1.5 rounded-md
        hover:bg-muted/40 transition cursor-pointer
      "
    >
      <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-muted-foreground" />

      <div className="flex flex-col text-sm leading-tight max-w-2xl">
        <div>
          <span className="font-medium">{item.userName}</span>{" "}
          <span className="text-muted-foreground">updated</span>{" "}
          <span className="font-medium">"{item.taskTitle}"</span>{" "}
          <span className="text-muted-foreground">
            {formatTimelineMessage(displayMessage)}
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
            className="
              h-auto p-0 mt-1
              text-xs text-muted-foreground
              hover:text-foreground
              flex items-center gap-1
              w-fit
            "
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
