import type { User } from "../../users/user.types";

export type AuthResponse = {
  token: string;
  user: {
    id: string;
    email: string;
    roles: string[];
  };
};

export type AuthContextType = {
  user: User | undefined;
  isGlobalAdmin: boolean;
  logout: () => void;
  isLoading: boolean;
};
