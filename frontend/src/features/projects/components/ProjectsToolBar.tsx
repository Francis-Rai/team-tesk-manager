import type { DeletedFilter } from "../../../common/utils/deletedFilter";
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
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      {/* LEFT: Search */}
      <div className="flex items-center gap-2 flex-1">
        <Input
          placeholder="Search projects..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full md:max-w-sm"
        />

        {/* RIGHT: Filters */}
        {/* Status */}
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="ON_HOLD">On Hold</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
          </SelectContent>
        </Select>

        {/* Deleted */}
        <Select value={deletedFilter} onValueChange={onDeletedFilterChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Visibility" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="DELETED">Deleted</SelectItem>
            <SelectItem value="ALL">All</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select value={sort} onValueChange={onSortChange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt,desc">Newest</SelectItem>
            <SelectItem value="createdAt,asc">Oldest</SelectItem>
            <SelectItem value="name,asc">Name (A–Z)</SelectItem>
            <SelectItem value="updatedAt,desc">Last Updated</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
