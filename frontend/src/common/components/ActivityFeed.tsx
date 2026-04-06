import { CalendarDays, Search, Sparkles } from "lucide-react";
import { useMemo } from "react";

import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { ActivityItem, type ActivityRecord } from "./ActivityItem";
import { formatDate } from "../utils/dateFormatter";
import { getActivityTypeLabel } from "../utils/activityFormatter";

type GroupByValue = "date" | "project" | "task" | "person" | "type";

interface ActivityFeedProps {
  title: string;
  description: string;
  scopeLabel: string;
  emptyTitle: string;
  emptyDescription: string;
  items: ActivityRecord[];
  isLoading: boolean;
  search: string;
  sort: string;
  page: number;
  totalPages: number;
  totalElements: number;
  groupBy: GroupByValue;
  groupByOptions: Array<{
    value: GroupByValue;
    label: string;
  }>;
  onSearchChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onGroupByChange: (value: GroupByValue) => void;
  onPageChange: (page: number) => void;
  onOpenTask?: (item: ActivityRecord) => void;
  interactiveItems?: boolean;
}

function groupActivity(items: ActivityRecord[], groupBy: GroupByValue) {
  return items.reduce<Record<string, ActivityRecord[]>>((groups, item) => {
    let key = new Date(item.createdAt).toDateString();

    if (groupBy === "project") {
      key = "project" in item ? item.project.title : "Current task";
    }

    if (groupBy === "task") {
      key = item.task?.title ?? "Current task";
    }

    if (groupBy === "person") {
      key = `${item.user.firstName} ${item.user.lastName}`.trim();
    }

    if (groupBy === "type") {
      key = getActivityTypeLabel(item.message);
    }

    if (!groups[key]) {
      groups[key] = [];
    }

    groups[key].push(item);

    return groups;
  }, {});
}

function sortGroupedEntries(
  entries: Array<[string, ActivityRecord[]]>,
  groupBy: GroupByValue,
  sort: string,
) {
  if (groupBy === "date") {
    return entries;
  }

  return [...entries].sort((a, b) => {
    if (sort === "createdAt,asc") {
      return a[0].localeCompare(b[0]);
    }

    return b[0].localeCompare(a[0]);
  });
}

export function ActivityFeed({
  title,
  description,
  scopeLabel,
  emptyTitle,
  emptyDescription,
  items,
  isLoading,
  search,
  sort,
  page,
  totalPages,
  totalElements,
  groupBy,
  groupByOptions,
  onSearchChange,
  onSortChange,
  onGroupByChange,
  onPageChange,
  onOpenTask,
  interactiveItems = true,
}: ActivityFeedProps) {
  const grouped = useMemo(() => groupActivity(items, groupBy), [items, groupBy]);
  const groupEntries = useMemo(
    () => sortGroupedEntries(Object.entries(grouped), groupBy, sort),
    [grouped, groupBy, sort],
  );
  const isFirstPage = page === 0;
  const isLastPage = totalPages === 0 || page + 1 >= totalPages;

  if (isLoading) {
    return (
      <Card className="border-0 bg-gradient-to-br from-background via-background to-muted/30 shadow-sm">
        <CardHeader className="border-b border-border/60">
          <div className="space-y-2">
            <div className="h-5 w-40 animate-pulse rounded-md bg-muted" />
            <div className="h-4 w-72 animate-pulse rounded-md bg-muted" />
          </div>
        </CardHeader>

        <CardContent className="space-y-4 py-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-24 animate-pulse rounded-2xl border border-border/60 bg-muted/40"
            />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-auto h-full border-0 bg-gradient-to-br from-background via-background to-muted/20 shadow-sm ring-1 ring-border/60">
      <CardHeader className="gap-5 border-b border-border/60 pb-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Live activity feed
            </div>

            <div className="space-y-1">
              <CardTitle className="text-xl font-semibold tracking-tight">
                {title}
              </CardTitle>
              <p className="max-w-2xl text-sm text-muted-foreground">
                {description}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="h-7 rounded-full px-3">
              {scopeLabel}
            </Badge>
            <Badge variant="secondary" className="h-7 rounded-full px-3">
              {totalElements} events
            </Badge>
            <Badge variant="outline" className="h-7 rounded-full px-3">
              Page {totalPages === 0 ? 0 : page + 1} of {Math.max(totalPages, 1)}
            </Badge>
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search activity, updates, or task history..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-11 rounded-xl border-border/70 bg-background pl-9 shadow-none"
            />
          </div>

          <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-end">
            <Select
              value={groupBy}
              onValueChange={(value) => onGroupByChange(value as GroupByValue)}
            >
              <SelectTrigger className="h-11 w-full min-w-40 rounded-xl border-border/70 bg-background shadow-none sm:w-44">
                <SelectValue placeholder="Group by" />
              </SelectTrigger>

              <SelectContent>
                {groupByOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    Group: {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sort} onValueChange={onSortChange}>
              <SelectTrigger className="h-11 w-full min-w-40 rounded-xl border-border/70 bg-background shadow-none sm:w-44">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="createdAt,desc">Newest first</SelectItem>
                <SelectItem value="createdAt,asc">Oldest first</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-8 py-6">
        {groupEntries.length === 0 ? (
          <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-border/80 bg-muted/20 px-6 text-center">
            <div className="mb-4 rounded-2xl bg-background p-4 shadow-sm ring-1 ring-border/60">
              <CalendarDays className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-base font-semibold text-foreground">
              {emptyTitle}
            </h3>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              {emptyDescription}
            </p>
          </div>
        ) : (
          groupEntries.map(([groupLabel, groupItems]) => (
            <section key={groupLabel} className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge
                  variant="outline"
                  className="rounded-full border-border/70 bg-background px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
                >
                  {groupBy === "date" ? formatDate(groupLabel) : groupLabel}
                </Badge>
                <div className="h-px flex-1 bg-border/60" />
              </div>

              <div className="space-y-3">
                {groupItems.map((item) => (
                  <ActivityItem
                    key={item.id}
                    item={item}
                    interactive={interactiveItems}
                    onOpenTask={
                      onOpenTask ? () => onOpenTask(item) : undefined
                    }
                  />
                ))}
              </div>
            </section>
          ))
        )}
      </CardContent>

      {totalPages > 1 && (
        <CardFooter className="justify-between border-border/60 bg-muted/20">
          <p className="text-sm text-muted-foreground">
            Showing page {page + 1} of {totalPages}
          </p>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onPageChange(page - 1)}
              disabled={isFirstPage}
              className="rounded-xl"
            >
              Previous
            </Button>

            <Button
              type="button"
              onClick={() => onPageChange(page + 1)}
              disabled={isLastPage}
              className="rounded-xl"
            >
              Next
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
