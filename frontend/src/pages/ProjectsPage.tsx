import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

import { useProjects } from "../features/projects/hooks/useProjects";

import ProjectsToolbar from "../features/projects/components/ProjectsToolBar";
import { ProjectsHeader } from "../features/projects/components/ProjectsHeader";
import { CreateProjectModal } from "../features/projects/components/CreateProjectModal";
import ProjectCard from "../features/projects/components/ProjectCard";

export default function ProjectsPage() {
  const { teamId } = useParams<{
    teamId: string;
  }>();

  const navigate = useNavigate();

  const { data, isLoading } = useProjects(teamId!);

  const projects = data?.content ?? [];

  const [search, setSearch] = useState("");

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

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

      <ProjectsToolbar search={search} onSearchChange={setSearch} />

      <div
        className="
            grid gap-4
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
          "
      >
        {filteredProjects.map((project) => (
          <ProjectCard
            key={project.id}
            name={project.name}
            description={project.description}
            onClick={() => openProject(project.id)}
          />
        ))}
      </div>
    </div>
  );
}
