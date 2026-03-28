import { useState } from "react";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Activity,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import TeamSwitcher from "./TeamSwitcher";
import { Button } from "../../../components/ui/button";
import NavItem from "./TeamNavItem";
import { cn } from "../../../lib/utils";

export default function Sidebar({ teamId }: { teamId: string }) {
  const [collapsed, setCollapsed] = useState(false);
  

  return (
    <aside
      className={cn(
        "h-screen border-r bg-muted/40 flex flex-col transition-all duration-200",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex items-center justify-between p-3 border-b">
        {!collapsed && <TeamSwitcher teamId={teamId} />}

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed((prev) => !prev)}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <nav className="flex-1 p-2 space-y-1">
        <NavItem
          to={`/teams/${teamId}`}
          label="Overview"
          icon={LayoutDashboard}
          collapsed={collapsed}
          end
        />

        <NavItem
          to={`/teams/${teamId}/projects`}
          label="Projects"
          icon={FolderKanban}
          collapsed={collapsed}
        />

        <NavItem
          to={`/teams/${teamId}/members`}
          label="Members"
          icon={Users}
          collapsed={collapsed}
        />

        <NavItem
          to={`/teams/${teamId}/activity`}
          label="Activity"
          icon={Activity}
          collapsed={collapsed}
        />
      </nav>
    </aside>
  );
}
