import type { TeamRole } from "../../teams/types/TeamRole";

export interface TeamMember {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: TeamRole;
  joinedAt: string;
}
