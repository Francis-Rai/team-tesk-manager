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

export const updateUserProfile = async (
  userId: string,
  payload: {
    firstName?: string;
    lastName?: string;
    email?: string;
  },
): Promise<User> => {
  const { data } = await apiClient.patch<User>(`/users/${userId}`, payload);
  return data;
};

export const updateUserRole = async (
  userId: string,
  payload: {
    role: UserRole;
  },
): Promise<void> => {
  await apiClient.patch(`/admin/users/${userId}/role`, payload);
};

export const resetUserPasswordByAdmin = async (
  userId: string,
  payload: {
    newPassword: string;
  },
): Promise<void> => {
  await apiClient.patch(`/admin/users/${userId}/password`, payload);
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
