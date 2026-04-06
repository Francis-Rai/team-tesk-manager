import { useMemo, useState } from "react";

import { ActivityFeed } from "../../../common/components/ActivityFeed";
import { getActivityTypeLabel } from "../../../common/utils/activityFormatter";
import { useTaskUpdates } from "../hooks/useTaskUpdates";

interface Props {
  teamId: string;
  projectId: string;
  taskId: string;
}

export default function TaskActivity({ teamId, projectId, taskId }: Props) {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("createdAt,desc");
  const [groupBy, setGroupBy] = useState<"date" | "person" | "type">("date");

  const { data, isLoading } = useTaskUpdates(teamId, projectId, taskId, {
    page,
    size: 8,
    sort,
  });

  const filteredUpdates = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const updates = data?.content ?? [];

    if (!normalizedSearch) {
      return updates;
    }

    return updates.filter((item) => {
      const fullName =
        `${item.user.firstName} ${item.user.lastName}`.toLowerCase();
      const typeLabel = getActivityTypeLabel(item.message).toLowerCase();

      return (
        item.message.toLowerCase().includes(normalizedSearch) ||
        (item.task?.title ?? "").toLowerCase().includes(normalizedSearch) ||
        fullName.includes(normalizedSearch) ||
        typeLabel.includes(normalizedSearch)
      );
    });
  }, [data?.content, search]);

  return (
    <ActivityFeed
      title="Task Activity"
      description="A focused stream of updates, comments, and task changes for this work item."
      scopeLabel="Task scope"
      emptyTitle="No task activity yet"
      emptyDescription="New comments and task changes will appear here as work progresses."
      items={filteredUpdates}
      isLoading={isLoading}
      search={search}
      sort={sort}
      page={page}
      totalPages={data?.totalPages ?? 0}
      totalElements={data?.totalElements ?? 0}
      groupBy={groupBy}
      groupByOptions={[
        { value: "date", label: "Date" },
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
        setGroupBy(value as "date" | "person" | "type");
        setPage(0);
      }}
      onPageChange={setPage}
      interactiveItems={false}
    />
  );
}
