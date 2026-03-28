import type { UserRole } from "../../users/types/userRole";

export interface TeamPermissions {
  canCreateTeam: boolean;
  canEditTeamDetails: boolean;
  canDeleteTeam: boolean;
}

interface Params {
  role: UserRole;
}

export function getTeamPermissions({ role }: Params): TeamPermissions {
  const isSuperAdmin = role === "SUPER_ADMIN";
  const isGlobalAdmin = role === "ADMIN";

  const canCreateTeam = isSuperAdmin;

  const canEditTeamDetails = isSuperAdmin || isGlobalAdmin;

  const canDeleteTeam = isSuperAdmin;

  return {
    canCreateTeam,
    canEditTeamDetails,
    canDeleteTeam,
  };
}
