import { useParams } from "react-router-dom";

export function useWorkspaceContext() {
  const { teamId, projectId } = useParams();

  return {
    teamId,
    projectId,
    canCreateProject: !!teamId,
    canCreateTask: !!projectId,
  };
}
