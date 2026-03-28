import { useTeam } from "../hooks/useTeam";
import { DeleteTeamButton } from "./DeleteTeamButton";

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
      {/* LEFT */}
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-medium">{team.name}</h2>

        <span className="text-xs text-muted-foreground">
          {team.description}
        </span>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2">
        <DeleteTeamButton teamId={teamId} teamName={team.name} />

        {/* future: theme toggle */}
        {/* future: user menu */}
        <span className="text-xs text-muted-foreground">User</span>
      </div>
    </div>
  );
}
