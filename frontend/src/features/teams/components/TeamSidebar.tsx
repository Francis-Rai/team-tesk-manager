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

export default function TeamSidebar({ teamId }: { teamId: string }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <aside
      className={cn(
        "border-r bg-muted/40 flex flex-col transition-all duration-200",
        collapsed ? "w-16" : "w-fit",
      )}
    >
      <div className="relative border-b p-3">
        {!collapsed && <TeamSwitcher teamId={teamId} />}

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed((prev) => !prev)}
          className="
      absolute -right-3 top-1/2 -translate-y-1/2
      h-6 w-6 rounded-full border bg-background shadow-sm
      hover:bg-muted
    "
        >
          {collapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
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
