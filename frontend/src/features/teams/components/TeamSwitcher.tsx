import { useNavigate } from "react-router-dom";
import { ChevronsUpDown, Plus, Check } from "lucide-react";

import { useAllTeams } from "../hooks/useAllTeams";
import { setLastTeamId } from "../utils/useTeamStore";
import { Button } from "../../../components/ui/button";
import { cn } from "../../../lib/utils";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../../components/ui/command";
import { CreateTeamModal } from "./CreateTeamModal";
import { useState } from "react";
import { Separator } from "../../../components/ui/separator";

interface Props {
  teamId: string;
  collapsed?: boolean;
}

export default function TeamSwitcher({ teamId, collapsed }: Props) {
  const navigate = useNavigate();
  const { data: teams = [] } = useAllTeams();

  const [open, setOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const currentTeam = teams.find((t) => t.id === teamId);

  function switchTeam(id: string) {
    if (id === teamId) return;

    setLastTeamId(id);
    setOpen(false);
    navigate(`/teams/${id}`);
  }

  function handleCreate() {
    setOpen(false);

    setTimeout(() => {
      setCreateOpen(true);
    }, 100);
  }

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "w-full h-10 px-2 transition",
              collapsed ? "justify-center" : "justify-between",
            )}
          >
            <div className="flex items-center gap-2 min-w-0">
              <Avatar className="h-6 w-6 shrink-0">
                <AvatarFallback>{currentTeam?.name?.[0] || "T"}</AvatarFallback>
              </Avatar>

              {!collapsed && (
                <span className="text-sm font-medium truncate">
                  {currentTeam?.name || "Select Team"}
                </span>
              )}
            </div>

            {!collapsed && (
              <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="w-64 p-2 space-y-2">
          <Command className="space-y-2">
            <CommandInput placeholder="Search teams..." />

            <CommandList>
              <CommandEmpty>No teams found.</CommandEmpty>

              {teams.map((team) => {
                const isActive = team.id === teamId;

                return (
                  <CommandItem
                    key={team.id}
                    value={team.id}
                    onSelect={() => switchTeam(team.id)}
                    className={cn(
                      "flex items-center gap-2 rounded-md",
                      isActive && "bg-muted font-medium",
                    )}
                  >
                    <Avatar className="h-5 w-5">
                      <AvatarFallback>{team.name[0]}</AvatarFallback>
                    </Avatar>

                    <span className="flex-1 text-sm truncate">{team.name}</span>

                    {isActive && <Check className="h-4 w-4 text-primary" />}
                  </CommandItem>
                );
              })}
            </CommandList>
          </Command>

          <Separator />

          <Button
            variant="secondary"
            size="sm"
            className="w-full justify-start gap-2"
            onClick={handleCreate}
          >
            <Plus className="h-4 w-4" />
            Create Team
          </Button>
        </DropdownMenuContent>
      </DropdownMenu>

      <CreateTeamModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={(team) => {
          console.log(team.id, team.name);
          setLastTeamId(team.id);
          navigate(`/teams/${team.id}`);
        }}
      />
    </>
  );
}
