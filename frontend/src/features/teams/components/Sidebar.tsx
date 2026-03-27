import { NavLink } from "react-router-dom";
import TeamSwitcher from "./TeamSwitcher";

export default function Sidebar({ teamId }: { teamId: string }) {
  return (
    <aside className="w-64 border-r flex flex-col bg-muted/40">
      <div className="p-4 border-b">
        <TeamSwitcher teamId={teamId} />
      </div>

      <nav className="p-2 space-y-1">
        <NavItem to={`/teams/${teamId}`} label="Overview" end />
        <NavItem to={`/teams/${teamId}/projects`} label="Projects" />
        <NavItem to={`/teams/${teamId}/members`} label="Members" />
        <NavItem to={`/teams/${teamId}/activity`} label="Activity" />
      </nav>
    </aside>
  );
}

interface NavItemProps {
  to: string;
  label: string;
  end?: boolean;
}

function NavItem({ to, label, end }: NavItemProps) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `block px-3 py-2 rounded-md text-sm ${
          isActive ? "bg-background shadow-sm" : "hover:bg-muted"
        }`
      }
    >
      {label}
    </NavLink>
  );
}
