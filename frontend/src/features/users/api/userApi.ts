import { apiClient } from "../../../api/apiClients";
import { authStorage } from "../../auth/utils/authStorage";
import type { UserRole } from "../types/userRole";
import type { User } from "../types/userType";
import { jwtDecode } from "jwt-decode";

/*
 * Fetches the list of users from the backend API.
 */
export const getUsers = async (): Promise<User[]> => {
  const { data } = await apiClient.get<User[]>("/users");
  return data;
};

type TokenPayload = {
  role: UserRole;
  exp: number;
  sub: string;
};

export const getUserFromToken = (): TokenPayload | null => {
  const token = authStorage.getToken();
  if (!token) return null;

  try {
    return jwtDecode<TokenPayload>(token);
  } catch {
    return null;
  }
};
