import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  CalendarDays,
  Plus,
  Search,
  Sparkles,
  Users,
} from "lucide-react";

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
import { formatDate } from "../common/utils/dateFormatter";

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
  const totalElements = data?.totalElements ?? 0;

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

  const openTeam = (teamId: string) => {
    navigate(`/teams/${teamId}`);
  };

  return (
    <div className="min-h-full bg-muted/10 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-5">
        <section className="rounded-3xl border border-border/60 bg-linear-to-br from-background via-background to-muted/20 p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5" />
                Workspace selection
              </div>
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                  Choose a team
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                  Open an existing workspace or create a new team to start organizing projects, members, and activity.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-2xl border border-border/60 bg-background/80 px-4 py-3 shadow-xs">
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Teams
                </div>
                <div className="text-xl font-semibold tracking-tight text-foreground">
                  {totalElements}
                </div>
              </div>

              <Button className="rounded-xl" onClick={() => setOpen(true)}>
                <Plus className="h-4 w-4" />
                Create team
              </Button>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border/60 bg-background/92 p-4 shadow-sm">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
            <div className="relative w-full">
              <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search teams..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="h-10 rounded-xl border-border/70 bg-background pl-9 shadow-none"
              />
            </div>

            <div className="grid gap-2 sm:grid-cols-2 lg:min-w-[22rem]">
              <div className="space-y-1">
                <label className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  Visibility
                </label>
                <Select
                  value={deletedFilter}
                  onValueChange={handleDeletedFilterChange}
                >
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
                <Select value={sort} onValueChange={handleSortChange}>
                  <SelectTrigger className="h-10 rounded-xl border-border/70 bg-background shadow-none">
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="createdAt,desc">Newest</SelectItem>
                    <SelectItem value="createdAt,asc">Oldest</SelectItem>
                    <SelectItem value="name,asc">Name (A-Z)</SelectItem>
                    <SelectItem value="name,desc">Name (Z-A)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-44 animate-pulse rounded-2xl border border-border/60 bg-muted/25"
              />
            ))}
          </div>
        ) : teams.length > 0 ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {teams.map((team) => (
                <Card
                  key={team.id}
                  onClick={() => openTeam(team.id)}
                  className="group cursor-pointer overflow-hidden border-border/60 bg-background/95 transition-all hover:-translate-y-0.5 hover:border-border hover:shadow-md"
                >
                  <CardContent className="space-y-4 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="rounded-2xl border border-border/60 bg-muted/25 p-2 text-muted-foreground transition group-hover:border-border group-hover:text-foreground">
                          <Users className="h-4 w-4" />
                        </div>

                        <div className="min-w-0 space-y-1">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                            Team
                          </p>
                          <h3 className="truncate text-base font-semibold text-foreground">
                            {team.name}
                          </h3>
                        </div>
                      </div>

                      <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:text-foreground" />
                    </div>

                    <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
                      {team.description?.trim() || "No description provided for this team."}
                    </p>

                    <div className="flex items-center gap-2 border-t border-border/60 pt-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1 rounded-full bg-muted/25 px-2.5 py-1">
                        <CalendarDays className="h-3 w-3" />
                        Created {formatDate(team.createdAt)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            )}
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-border/70 bg-background/75 px-6 py-16 text-center">
            <h2 className="text-lg font-semibold text-foreground">
              No teams found
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Try changing the search or filters, or create a new team to get started.
            </p>
            <Button className="mt-5 rounded-xl" onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4" />
              Create team
            </Button>
          </div>
        )}
      </div>

      <CreateTeamModal open={open} onOpenChange={setOpen} />
    </div>
  );
}
