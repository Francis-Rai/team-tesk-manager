import { useAllTeams } from "../hooks/useAllTeams";
import { useNavigate } from "react-router-dom";
import { setLastTeamId } from "../utils/useTeamStore";

export default function TeamSwitcher({ teamId }: { teamId: string }) {
  const { data: teams = [] } = useAllTeams();
  const navigate = useNavigate();

  return (
    <select
      value={teamId}
      onChange={(e) => {
        setLastTeamId(e.target.value);
        navigate(`/teams/${e.target.value}`);
      }}
      className="w-full border rounded-md p-2"
    >
      {teams.map((t) => (
        <option key={t.id} value={t.id}>
          {t.name}
        </option>
      ))}
    </select>
  );
}
