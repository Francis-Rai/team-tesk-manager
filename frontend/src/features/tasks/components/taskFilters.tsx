import { Button } from "../../../components/ui/button";
import type { DeletedFilter } from "../types/taskTypes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Input } from "../../../components/ui/input";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "../../../components/ui/toggle-group";
import { LayoutList, Kanban } from "lucide-react";
import { useAuth } from "../../auth/hooks/useAuth";

type Props = {
  search: string;
  status: string;
  view: "list" | "board";
  deletedFilter: DeletedFilter;

  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onDeletedFilterChange: (value: DeletedFilter) => void;
  onViewChange: (value: "list" | "board") => void;

  onCreateTask: () => void;
};

export default function TaskFilters({
  search,
  status,
  deletedFilter,
  view,
  onSearchChange,
  onStatusFilterChange,
  onViewChange,
  onCreateTask,
  onDeletedFilterChange,
}: Props) {
  const { isGlobalAdmin } = useAuth();

  return (
    <div className="flex flex-wrap gap-4">
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
      <ToggleGroup
        type="single"
        value={view}
        onValueChange={(value) => {
          if (value) onViewChange(value as "list" | "board");
        }}
        className="border rounded-md bg-muted/40"
      >
        <ToggleGroupItem
          value="list"
          className="
      flex items-center gap-2 px-3 py-1.5 text-sm
      data-[state=on]:bg-background
      data-[state=on]:shadow-sm
      data-[state=on]:text-foreground
      hover:bg-muted
      transition-all
    "
        >
          <LayoutList className="h-4 w-4" />
          List
        </ToggleGroupItem>

        <ToggleGroupItem
          value="board"
          className="
      flex items-center gap-2 px-3 py-1.5 text-sm
      data-[state=on]:bg-background
      data-[state=on]:shadow-sm
      data-[state=on]:text-foreground
      hover:bg-muted
      transition-all
    "
        >
          <Kanban className="h-4 w-4" />
          Board
        </ToggleGroupItem>
      </ToggleGroup>

      <Button onClick={onCreateTask}>Create Task</Button>
    </div>
  );
}
