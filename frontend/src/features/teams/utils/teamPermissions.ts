import type { UserRole } from "../../users/types/userRole";
import type { NullableTeamRole } from "../types/team.type";

export interface TeamPermissions {
  canCreateTeam: boolean;
  canEditTeamDetails: boolean;
  canDeleteTeam: boolean;
  canTransferOwnership: boolean;
  canAddMember: boolean;
}

interface Params {
  globalRole?: UserRole;
  teamRole?: NullableTeamRole;
}

export function getTeamPermissions({
  globalRole,
  teamRole,
}: Params): TeamPermissions {
  const isSuperAdmin = globalRole === "SUPER_ADMIN";
  const isGlobalAdmin = globalRole === "ADMIN";
  const isTeamOwner = teamRole === "OWNER";
  const isTeamAdmin = teamRole === "ADMIN";

  const canCreateTeam = isSuperAdmin;

  const canEditTeamDetails = isSuperAdmin || isGlobalAdmin;

  const canDeleteTeam = isSuperAdmin;

  const canTransferOwnership = isTeamOwner && (isGlobalAdmin || isSuperAdmin);

  const canAddMember = isTeamOwner || isTeamAdmin;

  return {
    canCreateTeam,
    canEditTeamDetails,
    canDeleteTeam,
    canTransferOwnership,
    canAddMember,
  };
}
