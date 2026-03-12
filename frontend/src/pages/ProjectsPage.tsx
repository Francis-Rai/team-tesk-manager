import { useNavigate, useParams } from "react-router-dom";
import CreateProjectModal from "../features/projects/components/CreateProjectModal";
import { useProjects } from "../features/projects/hooks/useProject";

/*
 * Project page showing projects.
 */
export default function ProjectsPage() {
  const { teamId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useProjects(teamId!);

  const projects = data?.content ?? [];

  if (isLoading) return <div>Loading projects...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Projects</h1>

      <CreateProjectModal />

      <div className="grid grid-cols-3 gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            onClick={() => navigate(`/teams/${teamId}/projects/${project.id}`)}
            className="border p-4 rounded hover:bg-gray-50 cursor-pointer"
          >
            <h3 className="font-semibold">{project.name}</h3>

            <p className="text-sm text-gray-500">{project.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
