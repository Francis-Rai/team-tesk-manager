import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Input } from "../../../components/ui/input";
import { useAuth } from "../../auth/hooks/useAuth";
import type { DeletedFilter } from "../../../common/types/deletedFilter.types";
import { Search } from "lucide-react";

type Props = {
  search: string;
  status: string;
  deletedFilter: DeletedFilter;

  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onDeletedFilterChange: (value: DeletedFilter) => void;
};

export default function TaskFilters({
  search,
  status,
  deletedFilter,
  onSearchChange,
  onStatusFilterChange,
  onDeletedFilterChange,
}: Props) {
  const { isGlobalAdmin } = useAuth();

  return (
    <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
      <div className="relative w-full max-w-md">
        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-10 rounded-xl border-border/70 bg-background pl-9 shadow-none"
        />
      </div>
      <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-end">
        <Select value={status || "ALL"} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-45">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="TODO">TODO</SelectItem>
            <SelectItem value="IN_PROGRESS">IN PROGRESS</SelectItem>
            <SelectItem value="DONE">DONE</SelectItem>
          </SelectContent>
        </Select>
        {isGlobalAdmin && (
          <Select value={deletedFilter} onValueChange={onDeletedFilterChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="ALL">All</SelectItem>
              <SelectItem value="DELETED">Deleted</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
}
