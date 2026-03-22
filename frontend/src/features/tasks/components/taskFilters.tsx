import type { DeletedFilter } from "../types/taskTypes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Input } from "../../../components/ui/input";
import { useAuth } from "../../auth/hooks/useAuth";

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
    <div className="flex flex-wrap gap-4 pb-2">
      <Input
        placeholder="Search tasks..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="border rounded px-3 py-2 text-sm w-62.5"
      />
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
  );
}
