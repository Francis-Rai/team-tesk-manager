export interface TaskUpdate {
  id: string;
  message: string;
  user: User;
  task?: Task;
  createdAt: string;
}

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
};

type Task = {
  id: string;
  title: string;
};
