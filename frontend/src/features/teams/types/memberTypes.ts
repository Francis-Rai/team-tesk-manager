export type TeamRole = "OWNER" | "ADMIN" | "MEMBER";

export interface TeamMember {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
}
