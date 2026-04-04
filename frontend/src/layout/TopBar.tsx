import { useState } from "react";
import { Button } from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

import { useAuth } from "../features/auth/hooks/useAuth";

import UserMenu from "./UserMenu";
import { useWorkspaceContext } from "../common/hooks/useWorkspaceContext";
import { CreateProjectModal } from "../features/projects/components/CreateProjectModal";
import { CreateTaskModal } from "../features/tasks/components/CreateTaskModal";

export default function TopBar() {
  const { logout } = useAuth();
  const { teamId, projectId, canCreateProject, canCreateTask } =
    useWorkspaceContext();

  const [openProject, setOpenProject] = useState(false);
  const [openTask, setOpenTask] = useState(false);

  return (
    <>
      <div
        className="
          h-14 px-4 flex items-center justify-between
          border-b bg-background/80 backdrop-blur
          sticky top-0 z-30
        "
      >
        <div className="flex items-center gap-4">
          <span
            className="font-semibold text-sm cursor-pointer"
            onClick={() => (window.location.href = "/teams")}
          >
            TeamTaskManager
          </span>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" className="h-9 px-3">
                + Create
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem
                disabled={!canCreateProject}
                onClick={() => setOpenProject(true)}
              >
                New Project
              </DropdownMenuItem>

              <DropdownMenuItem
                disabled={!canCreateTask}
                onClick={() => setOpenTask(true)}
              >
                New Task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <UserMenu onLogout={logout} />
        </div>
      </div>

      {teamId && (
        <CreateProjectModal
          teamId={teamId}
          open={openProject}
          onOpenChange={setOpenProject}
        />
      )}

      {teamId && projectId && (
        <CreateTaskModal
          teamId={teamId}
          projectId={projectId}
          open={openTask}
          onOpenChange={setOpenTask}
        />
      )}
    </>
  );
}
