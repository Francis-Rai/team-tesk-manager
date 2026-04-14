import { resolveRoles } from "../../../common/utils/roleHelpers";
import type { UserRole } from "../../users/types/userRole";
import type { NullableTeamRole } from "../types/team.type";

export interface TeamPermissions {
  canCreateTeam: boolean;
  canEditTeamDetails: boolean;
  canDeleteTeam: boolean;
  canViewDeleteTeam: boolean;
  canTransferOwnership: boolean;
  canAddMember: boolean;
  canCreateProject: boolean;
}

interface Params {
  globalRole?: UserRole;
  teamRole?: NullableTeamRole;
}

export function getTeamPermissions({
  globalRole,
  teamRole,
}: Params): TeamPermissions {
  const { isSuperAdmin, isGlobalAdmin, isOwner, isAdmin } = resolveRoles(
    globalRole,
    teamRole,
  );

  const isSystemAdmin = isSuperAdmin || isGlobalAdmin;
  const canManage = isOwner || isAdmin;

  return {
    canCreateTeam: isSuperAdmin,

    canEditTeamDetails: isSystemAdmin,

    canDeleteTeam: isSuperAdmin,

    canViewDeleteTeam: isSystemAdmin && canManage,

    canTransferOwnership: isOwner && isSystemAdmin,

    canAddMember: canManage,

    canCreateProject: canManage,
  };
}
