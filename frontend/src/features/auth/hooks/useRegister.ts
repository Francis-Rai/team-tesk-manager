import { useMutation } from "@tanstack/react-query";
import * as api from "../api/auth.api";

export const useRegister = () =>
  useMutation({
    mutationFn: api.register,
  });
