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
        "relative flex h-full flex-col border-r border-border/60 bg-background/85 backdrop-blur transition-all duration-200",
        collapsed ? "w-[4.5rem]" : "w-72",
      )}
    >
      <div className="relative border-b border-border/60 px-3 py-3">
        <TeamSwitcher teamId={teamId} collapsed={collapsed} />

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed((prev) => !prev)}
          className="absolute -right-3 top-1/2 h-7 w-7 -translate-y-1/2 rounded-full border border-border/60 bg-background shadow-sm hover:bg-muted"
        >
          {collapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </Button>
      </div>

      <nav className="flex-1 space-y-1 p-2">
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
