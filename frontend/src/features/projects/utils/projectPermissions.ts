import type { NullableTeamRole } from "../../teams/types/team.type";

export interface ProjectPermissions {
  canEditProjectDetails: boolean;
  canDeleteProject: boolean;
}

interface Params {
  role: NullableTeamRole;
}

export function getProjectPermissions({ role }: Params): ProjectPermissions {
  // Global admin / super admin not in team
  if (role === null) {
    return {
      canEditProjectDetails: false,
      canDeleteProject: false,
    };
  }

  const isOwner = role === "OWNER";
  const isAdmin = role === "ADMIN";

  const canEditProjectDetails = isOwner || isAdmin;

  const canDeleteProject = isOwner || isAdmin;

  return {
    canEditProjectDetails,
    canDeleteProject,
  };
}
