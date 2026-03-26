import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

import { useProjects } from "../features/projects/hooks/useProjects";

import ProjectsToolbar from "../features/projects/components/ProjectsToolBar";
import { ProjectsHeader } from "../features/projects/components/ProjectsHeader";
import { CreateProjectModal } from "../features/projects/components/CreateProjectModal";
import ProjectCard from "../features/projects/components/ProjectCard";
import { useDebounce } from "../common/hooks/useDebounce";
import type { DeletedFilter } from "../features/tasks/types/taskTypes";

export default function ProjectsPage() {
  const { teamId } = useParams<{
    teamId: string;
  }>();

  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("createdAt,desc");
  const [deletedFilter, setDeletedFilter] = useState<DeletedFilter>("ACTIVE");

  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading } = useProjects(teamId || "", {
    page,
    search: debouncedSearch,
    status,
    sort,
    deletedFilter,
  });

  const projects = data?.content ?? [];

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(0);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatus(value === "ALL" ? "" : value);
    setPage(0);
  };

  const handleDeletedFilterChange = (value: DeletedFilter) => {
    setDeletedFilter(value);
    setPage(0);
  };

  const [createOpen, setCreateOpen] = useState(false);

  function openProject(projectId: string) {
    navigate(`/teams/${teamId}/projects/${projectId}`);
  }

  if (!teamId) {
    return <div className="p-6">Invalid project</div>;
  }

  if (isLoading) {
    return <div className="p-6">Loading projects...</div>;
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <ProjectsHeader onCreateProject={() => setCreateOpen(true)} />

      <CreateProjectModal
        teamId={teamId}
        open={createOpen}
        onOpenChange={setCreateOpen}
      />

      <ProjectsToolbar
        search={search}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusFilterChange}
        onSortChange={setSort}
        onDeletedFilterChange={handleDeletedFilterChange}
        status={status}
        sort={sort}
        deletedFilter={deletedFilter}
      />

      <div
        className="
            grid gap-4
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
          "
      >
        {projects?.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onClick={() => openProject(project.id)}
          />
        ))}
      </div>
    </div>
  );
}
