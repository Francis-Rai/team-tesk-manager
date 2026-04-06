import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ActivityFeed } from "../../../common/components/ActivityFeed";
import { useTeamActivity } from "../hooks/useTeamActivity";

export default function TeamActivity() {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("createdAt,desc");
  const [groupBy, setGroupBy] = useState<
    "date" | "project" | "task" | "person" | "type"
  >(
    "date",
  );

  const { data, isLoading } = useTeamActivity(teamId || "", {
    page,
    size: 12,
    search,
    sort,
  });

  function openTask(projectId: string, taskId: string) {
    navigate(`/teams/${teamId}/projects/${projectId}/tasks/${taskId}`);
  }

  return (
    <div className="min-h-0 h-full">
      <ActivityFeed
        title="Team Activity"
        description="A polished view of work happening across the team, grouped by day so recent momentum is easy to scan."
        scopeLabel="Team scope"
        emptyTitle="No team activity yet"
        emptyDescription="Updates across projects and tasks will appear here as your team starts collaborating."
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
          { value: "project", label: "Project" },
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
          setGroupBy(value as "date" | "project" | "task" | "person" | "type");
          setPage(0);
        }}
        onPageChange={setPage}
        onOpenTask={(item) => {
          if ("project" in item) {
            openTask(item.project.id, item.task.id);
          }
        }}
      />
    </div>
  );
}
