import { type ReactNode } from "react";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { authStorage } from "../utils/authStorage";
import { useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "./AuthContext";

type Props = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: Props) => {
  const { data: user, isLoading } = useCurrentUser();
  const queryClient = useQueryClient();

  const logout = () => {
    authStorage.clearToken();
    queryClient.clear();
    window.location.href = "/login";
  };

  const isGlobalAdmin = user?.role === "SUPER_ADMIN" || user?.role === "ADMIN";

  return (
    <AuthContext.Provider value={{ user, isGlobalAdmin, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
