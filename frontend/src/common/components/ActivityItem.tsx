import { ChevronDown, ChevronUp, FolderKanban, MoveRight } from "lucide-react";
import { useState } from "react";

import {
  activityFormatter,
  getActivityTypeLabel,
  getActivityVerb,
} from "../utils/activityFormatter";
import { formatDateTimeShort } from "../utils/dateFormatter";

import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { cn } from "../../lib/utils";

import type { ProjectActivity } from "../../features/projects/types/projectTypes";
import type { TaskUpdate } from "../../features/tasks/types/taskUpdatesTypes";
import type { TeamActivity } from "../../features/teams/types/team.type";

export type ActivityRecord = ProjectActivity | TeamActivity | TaskUpdate;

export function ActivityItem({
  item,
  onOpenTask,
  interactive = true,
}: {
  item: ActivityRecord;
  onOpenTask?: (taskId: string) => void;
  interactive?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  const MAX_LENGTH = 170;
  const isLong = item.message.length > MAX_LENGTH;
  const formattedMessage = activityFormatter(item.message);
  const truncatedMessage = `${item.message.slice(0, MAX_LENGTH)}...`;
  const shouldTruncate = isLong && !expanded;
  const hasProject = "project" in item;
  const fullName = `${item.user.firstName} ${item.user.lastName}`.trim();
  const initials = `${item.user.firstName?.[0] ?? ""}${item.user.lastName?.[0] ?? ""}`;
  const activityTypeLabel = getActivityTypeLabel(item.message);
  const activityVerb = getActivityVerb(item.message);
  const showTypeBadge = activityTypeLabel !== "Comment";
  const taskTitle = item.task?.title ?? "Current task";
  const taskId = item.task?.id;

  return (
    <div
      onClick={() => {
        if (interactive && onOpenTask && taskId) {
          onOpenTask(taskId);
        }
      }}
      onKeyDown={(e) => {
        if (
          (e.key === "Enter" || e.key === " ") &&
          interactive &&
          onOpenTask &&
          taskId
        ) {
          e.preventDefault();
          onOpenTask(taskId);
        }
      }}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      className={cn(
        "group rounded-[1.35rem] border border-border/70 bg-background px-4 py-4 transition-colors duration-200",
        "shadow-[0_1px_2px_rgba(15,23,42,0.03)]",
        interactive && "cursor-pointer hover:border-border hover:bg-muted/20",
        interactive && "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
      )}
    >
      <div className="flex items-start gap-3.5">
        <Avatar size="default" className="mt-0.5 shrink-0">
          <AvatarFallback className="bg-primary/10 font-semibold text-primary">
            {initials || "?"}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="text-sm font-semibold text-foreground">
                  {fullName}
                </span>
                <span className="text-sm text-muted-foreground">{activityVerb}</span>
                {showTypeBadge && (
                  <Badge
                    variant="outline"
                    className="h-6 rounded-full border-border/70 bg-muted/20 px-2.5 text-[11px] font-medium text-muted-foreground"
                  >
                    {activityTypeLabel}
                  </Badge>
                )}
              </div>

              <div className="text-[15px] font-semibold leading-6 text-foreground">
                {taskTitle}
              </div>
            </div>

            <div className="flex shrink-0 flex-col items-start gap-2 md:items-end">
              <span className="text-xs font-medium text-muted-foreground">
                {formatDateTimeShort(item.createdAt)}
              </span>

              {interactive && taskId && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  Open
                  <MoveRight className="h-3.5 w-3.5" />
                </span>
              )}
            </div>
          </div>

          <div className="rounded-2xl bg-muted/25 px-3.5 py-3">
            <div className="text-sm leading-6 text-muted-foreground">
              {shouldTruncate ? truncatedMessage : formattedMessage}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {hasProject && (
              <Badge
                variant="outline"
                className="h-7 rounded-full border-border/70 bg-background px-2.5 text-[11px] text-foreground"
              >
                <FolderKanban className="h-3.5 w-3.5 text-muted-foreground" />
                {item.project.title}
              </Badge>
            )}
          </div>

          {isLong && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setExpanded((prev) => !prev);
              }}
              className="h-auto w-fit rounded-full px-0 text-xs text-muted-foreground hover:text-foreground"
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
        </div>
      </div>
    </div>
  );
}
