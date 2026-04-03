import { useTeam } from "../hooks/useTeam";
import { DeleteTeam } from "./DeleteTeamModal";

interface Props {
  teamId: string;
}

export default function TopBar({ teamId }: Props) {
  const { data: team, isLoading } = useTeam(teamId);

  if (isLoading || !team) {
    return (
      <div className="h-14 border-b flex items-center px-6">
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    );
  }

  return (
    <div className="h-14 border-b flex items-center justify-between px-6 bg-background">
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-medium">{team.name}</h2>

        <span className="text-xs text-muted-foreground">
          {team.description}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <DeleteTeam teamId={teamId} teamName={team.name} />

        <span className="text-xs text-muted-foreground">User</span>
      </div>
    </div>
  );
}
