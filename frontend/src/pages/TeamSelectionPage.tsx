import { useTeams } from "../features/teams/hooks/useTeams";
import { useNavigate } from "react-router-dom";

const TeamSelectionPage = () => {
  const { data, isLoading } = useTeams();
  const navigate = useNavigate();

  if (isLoading) return <div>Loading teams...</div>;

  const teams = data?.content ?? [];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Your Teams</h1>

      <div className="grid grid-cols-3 gap-4">
        {teams.map((team) => (
          <div
            key={team.id}
            onClick={() => navigate(`/teams/${team.id}`)}
            className="border p-4 rounded cursor-pointer hover:bg-gray-100"
          >
            {team.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamSelectionPage;
