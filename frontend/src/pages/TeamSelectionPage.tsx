import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAllTeams } from "../features/teams/hooks/useAllTeams";

import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";

import { CreateTeamModal } from "../features/teams/components/CreateTeamModal";

export default function TeamSelectionPage() {
  const navigate = useNavigate();

  const { data: teams = [], isLoading } = useAllTeams();

  const [open, setOpen] = useState(false);

  function openTeam(teamId: string) {
    navigate(`/teams/${teamId}`);
  }

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center text-sm text-muted-foreground">
        Loading teams...
      </div>
    );
  }

  /* -------------------------
     Empty State
  -------------------------- */
  if (!teams.length) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 p-6">
        <h1 className="text-xl font-semibold">No teams yet</h1>

        <p className="text-sm text-muted-foreground">
          Create your first team to get started
        </p>

        <Button onClick={() => setOpen(true)}>Create Team</Button>

        <CreateTeamModal open={open} onOpenChange={setOpen} />
      </div>
    );
  }

  /* -------------------------
     Main UI
  -------------------------- */
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-5xl space-y-8">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Your Teams</h1>

            <p className="text-sm text-muted-foreground">
              Select a team to continue
            </p>
          </div>

          <Button onClick={() => setOpen(true)}>Create Team</Button>
        </div>

        {/* GRID */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {teams.map((team) => (
            <Card
              key={team.id}
              onClick={() => openTeam(team.id)}
              className="
                cursor-pointer transition
                hover:shadow-sm hover:border-muted-foreground/20
              "
            >
              <CardContent className="p-4 space-y-2">
                <h3 className="font-medium truncate">{team.name}</h3>

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {team.description || "No description"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <CreateTeamModal open={open} onOpenChange={setOpen} />
    </div>
  );
}
