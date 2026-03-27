import { useParams } from "react-router-dom";
import ProjectsView from "../features/projects/components/ProjectsView";

export default function ProjectsPage() {
  const { teamId } = useParams<{ teamId: string }>();

  if (!teamId) {
    return <div className="p-6">Invalid team</div>;
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <ProjectsView />
    </div>
  );
}
