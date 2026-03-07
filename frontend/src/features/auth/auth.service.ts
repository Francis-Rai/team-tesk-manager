import { apiClient } from "../../api/apiClients";

/*
 * Define the structure of the authentication response
 */
export type AuthResponse = {
  token: string;
};

// Function to register a new user
export const register = async (payload: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) => {
  const { data } = await apiClient.post<AuthResponse>(
    "/auth/register",
    payload,
  );
  return data;
};

// Function to log in an existing user
export const login = async (payload: { email: string; password: string }) => {
  const { data } = await apiClient.post<AuthResponse>("/auth/login", payload);
  return data;
};
