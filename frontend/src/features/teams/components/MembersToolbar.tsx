import { Search } from "lucide-react";

import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
  role: string;
  onRoleChange: (value: string) => void;
}

export default function MembersToolbar({
  search,
  onSearchChange,
  role,
  onRoleChange,
}: Props) {
  return (
    <section className="rounded-2xl border border-border/60 bg-background/92 p-4 shadow-sm">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_14rem] lg:items-start">
        <div className="relative w-full">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search members..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-10 rounded-xl border-border/70 bg-background pl-9 shadow-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Role
          </label>
          <Select value={role} onValueChange={onRoleChange}>
            <SelectTrigger className="h-10 rounded-xl border-border/70 bg-background shadow-none">
              <SelectValue placeholder="Role" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="ALL">All roles</SelectItem>
              <SelectItem value="MEMBER">Member</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="OWNER">Owner</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </section>
  );
}
