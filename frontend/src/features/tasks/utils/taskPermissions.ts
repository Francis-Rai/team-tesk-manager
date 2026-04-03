import type { NullableTeamRole } from "../../teams/types/team.type";

export interface TaskPermissions {
  canEditTaskDetails: boolean;
  canDeleteTask: boolean;
  canChangeStatus: boolean;
  canComment: boolean;
}

interface Params {
  role: NullableTeamRole;
  userId?: string;
  assigneeId?: string;
  supportId?: string;
}

export function getTaskPermissions({
  role,
  userId,
  assigneeId,
  supportId,
}: Params): TaskPermissions {
  // Global admin / super admin not in team
  if (role === null) {
    return {
      canEditTaskDetails: false,
      canDeleteTask: false,
      canChangeStatus: false,
      canComment: false,
    };
  }

  const isOwner = role === "OWNER";
  const isAdmin = role === "ADMIN";
  const isAssignee = userId === assigneeId;
  const isSupport = userId === supportId;

  const canEditTaskDetails = isOwner || isAdmin;

  const canDeleteTask = isOwner || isAdmin;

  const canChangeStatus = isOwner || isAdmin || isAssignee || isSupport;

  const canComment = isOwner || isAdmin || isAssignee || isSupport;

  return {
    canEditTaskDetails,
    canDeleteTask,
    canChangeStatus,
    canComment,
  };
}
