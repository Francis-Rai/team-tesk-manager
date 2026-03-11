import { useState } from "react";
import Avatar from "../../../common/components/Avatar";
import { format } from "date-fns";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Props {
  name: string;
  message: string;
  createdAt: string;
  isLast: boolean;
}

const MAX_PREVIEW = 200;

export default function TimelineItem({
  name,
  message,
  createdAt,
  isLast,
}: Props) {
  const [expanded, setExpanded] = useState(false);

  const isLong = message.length > MAX_PREVIEW;

  const displayText =
    !expanded && isLong ? message.slice(0, MAX_PREVIEW) + "..." : message;

  return (
    <div className="flex gap-3">
      {/* Avatar + timeline line */}
      <div className="flex flex-col items-center">
        <Avatar name={name} />

        {!isLast && <div className="w-px flex-1 bg-border mt-1" />}
      </div>

      <div className="flex-1 pb-6">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium">{name}</span>

          <span className="text-xs text-muted-foreground">
            {format(new Date(createdAt), "MMM d, yyyy • h:mm a")}
          </span>
        </div>

        <p className="text-sm text-muted-foreground whitespace-pre-wrap wrap-break-word">
          {displayText}
        </p>

        {isLong && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="mt-2 inline-flex items-center gap-1 rounded-md border bg-background px-2.5 py-1 text-xs font-medium hover:bg-muted transition-colors"
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
          </button>
        )}
      </div>
    </div>
  );
}
