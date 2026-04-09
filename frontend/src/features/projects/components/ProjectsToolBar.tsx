import { Search } from "lucide-react";

import type { DeletedFilter } from "../../../common/types/deletedFilter.types";
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../../../components/ui/select";

interface Props {
  search: string;
  status: string;
  sort: string;
  deletedFilter: string;

  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onDeletedFilterChange: (value: DeletedFilter) => void;
}

export default function ProjectsToolbar({
  search,
  status,
  sort,
  deletedFilter,
  onSearchChange,
  onStatusChange,
  onSortChange,
  onDeletedFilterChange,
}: Props) {
  return (
    <section className="rounded-2xl border border-border/60 bg-background/92 p-4 shadow-sm">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
        <div className="relative w-full">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-10 rounded-xl border-border/70 bg-background pl-9 shadow-none"
          />
        </div>

        <div className="grid gap-2 sm:grid-cols-3 lg:min-w-[32rem]">
          <div className="space-y-1">
            <label className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Status
            </label>
            <Select value={status} onValueChange={onStatusChange}>
              <SelectTrigger className="h-10 rounded-xl border-border/70 bg-background shadow-none">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="ON_HOLD">On Hold</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Visibility
            </label>
            <Select value={deletedFilter} onValueChange={onDeletedFilterChange}>
              <SelectTrigger className="h-10 rounded-xl border-border/70 bg-background shadow-none">
                <SelectValue placeholder="Visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="DELETED">Deleted</SelectItem>
                <SelectItem value="ALL">All</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Sort
            </label>
            <Select value={sort} onValueChange={onSortChange}>
              <SelectTrigger className="h-10 rounded-xl border-border/70 bg-background shadow-none">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt,desc">Newest</SelectItem>
                <SelectItem value="createdAt,asc">Oldest</SelectItem>
                <SelectItem value="name,asc">Name (A-Z)</SelectItem>
                <SelectItem value="updatedAt,desc">Last Updated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </section>
  );
}
