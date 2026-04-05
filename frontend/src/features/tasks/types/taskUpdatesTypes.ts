export interface TaskUpdate {
  id: string;
  message: string;
  user: User;
  createdAt: string;
}

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
};
