import { useParams } from "react-router-dom";
import { useProject } from "../features/projects/hooks/useProject";

export default function ProjectPage() {
  const { teamId, projectId } = useParams();

  const { data: project, isLoading } = useProject(teamId!, projectId!);

  if (isLoading) return <div>Loading project...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{project?.name}</h1>

      <p className="text-gray-500">{project?.description}</p>

      <div className="border rounded p-6">Tasks will appear here</div>
    </div>
  );
}
