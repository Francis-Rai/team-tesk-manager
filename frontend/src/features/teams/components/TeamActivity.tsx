import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ActivityFeed } from "../../../common/components/ActivityFeed";
import { useDebounce } from "../../../common/hooks/useDebounce";
import { useTeamActivity } from "../hooks/useTeamActivity";

export default function TeamActivity() {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("createdAt,desc");
  const [groupBy, setGroupBy] = useState<
    "date" | "project" | "task" | "person" | "type"
  >("date");
  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading } = useTeamActivity(teamId || "", {
    page,
    size: 12,
    search: debouncedSearch,
    sort,
  });

  function openTask(projectId: string, taskId: string) {
    navigate(`/teams/${teamId}/projects/${projectId}/tasks/${taskId}`);
  }

  return (
    <div className="flex flex-col h-full min-h-0 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Activity</h1>
          <p className="text-sm text-muted-foreground">
            Review recent updates across projects and tasks
          </p>
        </div>
      </div>
      <ActivityFeed
        variant="team"
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
            { value: "project", label: "Project" },
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
            setGroupBy(value as "date" | "project" | "task" | "person" | "type");
            setPage(0);
          },
          onPageChange: setPage,
        }}
        behavior={{
          showHeaderMeta: false,
          onOpenTask: (item) => {
            if ("project" in item && item.project?.id && item.task?.id) {
              openTask(item.project.id, item.task.id);
            }
          },
        }}
      />
    </div>
  );
}
