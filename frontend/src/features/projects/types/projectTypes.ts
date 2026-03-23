/*
 * Represents a project.
 */
export type Project = {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  createdBy: ProjectOwner;
};

/*
 * Represents a project owner.
 */
export type ProjectOwner = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
};

export interface UpdateProjectInput {
  name?: string;
  description?: string;
}
