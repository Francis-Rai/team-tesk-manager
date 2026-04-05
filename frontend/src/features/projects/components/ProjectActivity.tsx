import { useState } from "react";

import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

import { useProjectActivity } from "../hooks/useProjectActivity";
import { ActivityItem } from "../../../common/components/ActivityItem";
import type { ProjectActivity } from "../types/projectTypes";

interface Props {
  teamId: string;
  projectId: string;
  onOpenTask: (taskId: string) => void;
}

export default function ProjectActivity({
  teamId,
  projectId,
  onOpenTask,
}: Props) {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("createdAt,desc");

  const { data, isLoading } = useProjectActivity(teamId, projectId, {
    page: page,
    size: 1000,
    search,
    sort,
  });

  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground">Loading activity...</div>
    );
  }

  function groupActivityByDate(items: ProjectActivity[]) {
    const groups: Record<string, ProjectActivity[]> = {};

    for (const item of items) {
      const date = new Date(item.createdAt).toDateString();

      if (!groups[date]) groups[date] = [];

      groups[date].push(item);
    }

    return groups;
  }

  const grouped = groupActivityByDate(data?.content ?? []);

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex-1 overflow-auto space-y-6">
        <div className="flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
          <Input
            placeholder="Search activity..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            className="max-w-sm"
          />

          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-45">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="createdAt,desc">Newest</SelectItem>
              <SelectItem value="createdAt,asc">Oldest</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-6">
          {Object.entries(grouped).map(([date, items]) => (
            <div key={date}>
              <div className="text-xs text-muted-foreground mb-2">{date}</div>

              <div className="space-y-1">
                {items.map((item) => (
                  <ActivityItem
                    key={item.id}
                    item={item}
                    onOpenTask={onOpenTask}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t p-4">PAGINATION</div>
    </div>
  );
}
