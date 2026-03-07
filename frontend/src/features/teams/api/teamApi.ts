import { apiClient } from "../../../api/apiClients";
import type { PageResponse } from "../../../common/types/pageResponse";
import type { Team } from "../types/TeamTypes";

export const getTeams = async (): Promise<PageResponse<Team>> => {
  const response = await apiClient.get("/teams");

  return response.data;
};

export const createTeam = async (data: {
  name: string;
  description?: string;
}): Promise<Team> => {
  const response = await apiClient.post("/teams", data);
  return response.data;
};
