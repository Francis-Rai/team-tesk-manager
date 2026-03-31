import type { TeamRole } from "./TeamRole";
export interface TeamMember {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: TeamRole;
}
