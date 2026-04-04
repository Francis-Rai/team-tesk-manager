import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useTeams } from "../features/teams/hooks/useTeams";
import { useDebounce } from "../common/hooks/useDebounce";

import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

import Pagination from "../common/components/Pagination";
import { CreateTeamModal } from "../features/teams/components/CreateTeamModal";
import type { DeletedFilter } from "../common/types/deletedFilter.types";

export default function TeamSelectionPage() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("createdAt,desc");
  const [deletedFilter, setDeletedFilter] = useState<DeletedFilter>("ACTIVE");

  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading } = useTeams({
    page,
    size: 12,
    search: debouncedSearch,
    sort,
    deletedFilter,
  });

  const teams = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(0);
  };

  const handleSortChange = (value: string) => {
    setSort(value);
    setPage(0);
  };

  const handleDeletedFilterChange = (value: DeletedFilter) => {
    setDeletedFilter(value);
    setPage(0);
  };

  function openTeam(teamId: string) {
    navigate(`/teams/${teamId}`);
  }

  if (isLoading && !teams.length) {
    return (
      <div className="h-screen flex items-center justify-center text-sm text-muted-foreground">
        Loading teams...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center px-6 py-10">
      <div className="w-6xl mx-auto space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Your Teams
            </h1>
            <p className="text-sm text-muted-foreground">
              Select a team or create a new one
            </p>
          </div>

          <Button onClick={() => setOpen(true)}>Create Team</Button>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1">
            <Input
              placeholder="Search teams..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Select
              value={deletedFilter}
              onValueChange={handleDeletedFilterChange}
            >
              <SelectTrigger className="h-9 w-[130px]">
                <SelectValue placeholder="Visibility" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="DELETED">Deleted</SelectItem>
                <SelectItem value="ALL">All</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sort} onValueChange={handleSortChange}>
              <SelectTrigger className="h-9 w-[160px]">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="createdAt,desc">Newest</SelectItem>
                <SelectItem value="createdAt,asc">Oldest</SelectItem>
                <SelectItem value="name,asc">Name (A–Z)</SelectItem>
                <SelectItem value="name,desc">Name (Z–A)</SelectItem>
                <SelectItem value="updatedAt,desc">Last Updated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4 h-[65vh] overflow-y-auto p-4 flex justify-around items-center">
          {teams.length > 0 ? (
            <div className="grid gap-5 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              {teams.map((team) => (
                <Card
                  key={team.id}
                  onClick={() => openTeam(team.id)}
                  className="
                  w-xs
            group cursor-pointer transition-all
            hover:shadow-md hover:-translate-y-0.5
            border-muted/60 hover:border-primary/30
          "
                >
                  <CardContent className="p-5 space-y-3">
                    <h3 className="font-semibold text-base truncate group-hover:text-primary transition">
                      {team.name}
                    </h3>

                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {team.description || "No description"}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 space-y-3">
              <h2 className="text-lg font-medium">No teams found</h2>

              <p className="text-sm text-muted-foreground">
                Try adjusting your search or create a new team.
              </p>

              <Button onClick={() => setOpen(true)}>Create Team</Button>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="pt-4">
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      <CreateTeamModal open={open} onOpenChange={setOpen} />
    </div>
  );
}
