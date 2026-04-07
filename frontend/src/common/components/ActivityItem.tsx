import { ChevronDown, ChevronUp, Dot, MoveRight } from "lucide-react";
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

  const MAX_LENGTH = 220;
  const isLong = item.message.length > MAX_LENGTH;
  const formattedMessage = activityFormatter(item);
  const truncatedMessage = `${item.message.slice(0, MAX_LENGTH)}...`;
  const shouldTruncate = isLong && !expanded;
  const hasProject = "project" in item;
  const fullName = `${item.user.firstName} ${item.user.lastName}`.trim();
  const initials = `${item.user.firstName?.[0] ?? ""}${item.user.lastName?.[0] ?? ""}`;
  const activityTypeLabel = getActivityTypeLabel(item);
  const activityVerb = getActivityVerb(item);
  const showTypeBadge = activityTypeLabel !== "Comment";
  const taskTitle = item.task?.title ?? "Current task";
  const taskId = item.task?.id;
  const projectTitle = hasProject ? item.project.title : null;

  return (
    <article
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
        "group flex gap-3 border-b border-border/60 py-2 last:border-b-0",
        interactive &&
          "cursor-pointer transition-colors duration-200 hover:bg-muted/20",
        interactive &&
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-2.5">
              <Avatar size="sm" className="shrink-0">
                <AvatarFallback className="bg-primary/10 font-semibold text-primary">
                  {initials || "?"}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2 text-sm leading-6">
                  <span className="font-semibold text-foreground">
                    {fullName}
                  </span>
                  <span className="text-muted-foreground">{activityVerb}</span>
                  <span className="font-semibold text-foreground">
                    {taskTitle}
                  </span>
                  {showTypeBadge && (
                    <Badge
                      variant="outline"
                      className="h-5 rounded-md border-border/70 px-1.5 text-[10px] font-medium text-muted-foreground"
                    >
                      {activityTypeLabel}
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
                  <span>{formatDateTimeShort(item.createdAt)}</span>
                  {projectTitle && (
                    <>
                      <Dot className="h-3.5 w-3.5" />
                      <span>{projectTitle}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="pl-8 text-sm leading-6 text-muted-foreground">
              {shouldTruncate ? truncatedMessage : formattedMessage}
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
                className="h-auto rounded-full px-0 text-xs text-muted-foreground hover:text-foreground"
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

          {interactive && taskId && (
            <div className="hidden shrink-0 items-center md:flex">
              <span className="inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground transition-colors group-hover:text-foreground">
                Open
                <MoveRight className="h-3.5 w-3.5" />
              </span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
