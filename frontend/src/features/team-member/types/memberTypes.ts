import type { TeamRole } from "../../teams/types/TeamRole";
import type { UserRole } from "../../users/types/userRole";

export interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  teamRole: TeamRole;
  globalRole: UserRole;
  joinedAt: string;
}
