export interface Team {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

export interface UpdateTeamInput {
  name?: string;
  description?: string;
}
