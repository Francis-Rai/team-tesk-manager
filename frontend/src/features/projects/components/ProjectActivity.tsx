import { useState } from "react";

import { ActivityFeed } from "../../../common/components/ActivityFeed";
import { useDebounce } from "../../../common/hooks/useDebounce";
import { useProjectActivity } from "../hooks/useProjectActivity";

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
  const [groupBy, setGroupBy] = useState<"date" | "task" | "person" | "type">(
    "date",
  );
  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading } = useProjectActivity(teamId, projectId, {
    page,
    size: 12,
    search: debouncedSearch,
    sort,
  });

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ActivityFeed
        variant="project"
        data={{
          items: data?.content ?? [],
          isLoading,
          page,
          totalPages: data?.totalPages ?? 0,
          totalElements: data?.totalElements ?? 0,
        }}
        controls={{
          search,
          sort,
          groupBy,
          groupByOptions: [
            { value: "date", label: "Date" },
            { value: "task", label: "Task" },
            { value: "person", label: "Person" },
            { value: "type", label: "Type" },
          ],
          onSearchChange: (value) => {
            setSearch(value);
            setPage(0);
          },
          onSortChange: (value) => {
            setSort(value);
            setPage(0);
          },
          onGroupByChange: (value) => {
            setGroupBy(value as "date" | "task" | "person" | "type");
            setPage(0);
          },
          onPageChange: setPage,
        }}
        behavior={{
          showHeaderMeta: false,
          onOpenTask: (item) => {
            if (item.task?.id) {
              onOpenTask(item.task.id);
            }
          },
        }}
      />
    </div>
  );
}
