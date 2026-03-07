/*
 * Represents a project.
 */
export type Project = {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  createdBy: ProjectCreator;
};

/*
 * Represents a project owner.
 */
export type ProjectCreator = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
};
