import type { LucideIcon } from "lucide-react";
import { cn } from "../../../lib/utils";
import { NavLink } from "react-router-dom";

interface NavItemProps {
  to: string;
  label: string;
  icon: LucideIcon;
  collapsed?: boolean;
  end?: boolean;
}

export default function NavItem({
  to,
  label,
  icon: Icon,
  collapsed,
  end,
}: NavItemProps) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition",
          isActive
            ? "bg-background shadow-sm font-medium"
            : "hover:bg-muted text-muted-foreground",
        )
      }
    >
      <Icon className="h-4 w-4 shrink-0" />

      {!collapsed && <span>{label}</span>}
    </NavLink>
  );
}
