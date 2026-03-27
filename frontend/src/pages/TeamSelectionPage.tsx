import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAllTeams } from "../features/teams/hooks/useAllTeams";
import {
  getLastTeamId,
  setLastTeamId,
} from "../features/teams/utils/useTeamStore";

export default function TeamSelectionPage() {
  const navigate = useNavigate();

  const { data: teams = [], isLoading } = useAllTeams();

  useEffect(() => {
    if (!teams.length) return;

    const last = getLastTeamId();

    if (last && teams.some((t) => t.id === last)) {
      navigate(`/teams/${last}`);
    }
  }, [teams]);

  function openTeam(teamId: string) {
    setLastTeamId(teamId);
    navigate(`/teams/${teamId}`);
  }

  if (isLoading) {
    return <div className="p-6">Loading teams...</div>;
  }

  return (
    <div className="p-6">
      <h1>Select Team</h1>
      <div>
        {teams.map((team) => (
          <div key={team.id} onClick={() => openTeam(team.id)}>
            {team.name}
          </div>
        ))}
      </div>
    </div>
  );
}
