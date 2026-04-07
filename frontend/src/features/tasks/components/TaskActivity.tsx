import { useState } from "react";

import { ActivityFeed } from "../../../common/components/ActivityFeed";
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

  return (
    <ActivityFeed
      variant="task"
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
          setGroupBy(value as "date" | "person" | "type");
          setPage(0);
        },
        onPageChange: setPage,
      }}
      behavior={{
        interactiveItems: false,
      }}
    />
  );
}
