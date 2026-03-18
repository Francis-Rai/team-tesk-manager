import { useQuery } from "@tanstack/react-query";
import { authStorage } from "../utils/authStorage";
import { apiClient } from "../../../api/apiClients";

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await apiClient.get("/users/me");
      return res.data;
    },
    enabled: !!authStorage.getToken(),
    staleTime: 1000 * 60 * 5,
  });
};
