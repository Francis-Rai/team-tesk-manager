import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "../api/auth.api";
import { authStorage } from "../utils/authStorage";
import { useContext } from "react";
import { AuthContext } from "./../context/AuthContext";

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.login,
    onSuccess: (data) => {
      authStorage.setToken(data.token);

      queryClient.setQueryData(["me"], data.user);
    },
  });
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return ctx;
};
