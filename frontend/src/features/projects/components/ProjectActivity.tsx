import { useState } from "react";

import { ActivityFeed } from "../../../common/components/ActivityFeed";
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

  const { data, isLoading } = useProjectActivity(teamId, projectId, {
    page,
    size: 12,
    search,
    sort,
  });

  return (
    <div className="min-h-0">
      <ActivityFeed
        title="Project Activity"
        description="A clearer, more structured feed for tracking task movement, updates, and decisions inside this project."
        scopeLabel="Project scope"
        emptyTitle="No project activity yet"
        emptyDescription="As work starts moving on this project, updates and task changes will show up here."
        items={data?.content ?? []}
        isLoading={isLoading}
        search={search}
        sort={sort}
        page={page}
        totalPages={data?.totalPages ?? 0}
        totalElements={data?.totalElements ?? 0}
        groupBy={groupBy}
        groupByOptions={[
          { value: "date", label: "Date" },
          { value: "task", label: "Task" },
          { value: "person", label: "Person" },
          { value: "type", label: "Type" },
        ]}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(0);
        }}
        onSortChange={(value) => {
          setSort(value);
          setPage(0);
        }}
        onGroupByChange={(value) => {
          setGroupBy(value as "date" | "task" | "person" | "type");
          setPage(0);
        }}
        onPageChange={setPage}
        onOpenTask={(item) => onOpenTask(item.task.id)}
      />
    </div>
  );
}
