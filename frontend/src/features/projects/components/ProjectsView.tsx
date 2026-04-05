import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useDebounce } from "../../../common/hooks/useDebounce";
import { useProjects } from "../hooks/useProjects";
import { CreateProjectModal } from "./CreateProjectModal";
import ProjectCard from "./ProjectCard";
import { ProjectsHeader } from "./ProjectsHeader";
import ProjectsToolbar from "./ProjectsToolBar";
import type { DeletedFilter } from "../../../common/types/deletedFilter.types";

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
    <div className="space-y-6">
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
            grid gap-5
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
