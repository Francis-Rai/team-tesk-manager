import { useParams } from "react-router-dom";
import { getUserFromToken } from "../../features/users/api/userApi";
import { getTeamPermissions } from "../../features/teams/utils/teamPermissions";
import { useTeamMe } from "../../features/teams/hooks/useTeamMe";

export function useWorkspaceContext() {
  const { teamId, projectId } = useParams();

  const user = getUserFromToken();

  const { data: teamMe } = useTeamMe(teamId || "");

  const permissions = getTeamPermissions({
    globalRole: user?.role,
    teamRole: teamMe?.role,
  });

  return {
    teamId,
    projectId,
    teamIdPresent: !!teamId,
    projectIdPresent: !!projectId,
    permissions,
  };
}
