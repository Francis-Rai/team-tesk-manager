export type TeamRole = "OWNER" | "ADMIN" | "MEMBER";

export const TeamRoleLabel: Record<TeamRole, string> = {
  OWNER: "Owner",
  ADMIN: "Admin",
  MEMBER: "Member",
};

export const TeamRoleStyles: Record<TeamRole, string> = {
  OWNER:
    "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-300",
  ADMIN:
    "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300",
  MEMBER: "bg-muted text-muted-foreground border-border",
};

export const TeamRoleOrder: TeamRole[] = ["OWNER", "ADMIN", "MEMBER"];
