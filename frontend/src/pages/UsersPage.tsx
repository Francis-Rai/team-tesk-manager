import { useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { KeyRound, PencilLine, Search, Shield, UsersRound } from "lucide-react";

import { useCurrentUser } from "../features/auth/hooks/useCurrentUser";
import { useUsers } from "../features/users/hooks/useUsers";
import type { User } from "../features/users/types/userType";
import type { UserRole } from "../features/users/types/userRole";
import EditUserDialog from "../features/users/components/EditUserDialog";
import ResetUserPasswordDialog from "../features/users/components/ResetUserPasswordDialog";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

const ROLE_LABELS: Record<UserRole, string> = {
  USER: "User",
  ADMIN: "Global Admin",
  SUPER_ADMIN: "Super Admin",
};

const ROLE_STYLES: Record<UserRole, string> = {
  USER: "border-border bg-muted/30 text-muted-foreground",
  ADMIN: "border-blue-200 bg-blue-100 text-blue-700",
  SUPER_ADMIN: "border-emerald-200 bg-emerald-100 text-emerald-700",
};

function countByRole(users: User[], role: UserRole) {
  return users.filter((user) => user.role === role).length;
}

export default function UsersPage() {
  const { data: currentUser, isLoading: isCurrentUserLoading } = useCurrentUser();
  const { data: users = [], isLoading: isUsersLoading } = useUsers();

  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [passwordUser, setPasswordUser] = useState<User | null>(null);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return [...users]
      .filter((user) => {
        if (!query) return true;

        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        return (
          fullName.includes(query) ||
          user.email.toLowerCase().includes(query) ||
          ROLE_LABELS[user.role].toLowerCase().includes(query)
        );
      })
      .sort((left, right) => {
        const leftName = `${left.lastName} ${left.firstName}`.toLowerCase();
        const rightName = `${right.lastName} ${right.firstName}`.toLowerCase();
        return leftName.localeCompare(rightName);
      });
  }, [search, users]);

  if (isCurrentUserLoading) {
    return <div className="p-6 text-sm text-muted-foreground">Loading users...</div>;
  }

  if (!currentUser || (currentUser.role !== "ADMIN" && currentUser.role !== "SUPER_ADMIN")) {
    return <Navigate to="/teams" replace />;
  }

  const canManageUser = (target: User) => {
    if (currentUser.role === "SUPER_ADMIN") return true;
    return target.role !== "SUPER_ADMIN";
  };

  return (
    <div className="min-h-full bg-muted/10 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-5">
        <section className="rounded-3xl border border-border/60 bg-linear-to-br from-background via-background to-muted/20 p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                <UsersRound className="h-3.5 w-3.5" />
                User management
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Manage people and access
              </h1>
              <p className="max-w-2xl text-sm text-muted-foreground">
                Update account details, reset passwords, and manage global roles
                from one place.
              </p>
            </div>

            <div className="flex-1 grid gap-3 sm:grid-cols-3">
              <Card size="sm" className="border-border/60 bg-background/95 shadow-sm">
                <CardHeader className="gap-2">
                  <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    <UsersRound className="h-3.5 w-3.5" />
                    Total users
                  </div>
                  <CardTitle className="text-xl font-semibold">{users.length}</CardTitle>
                </CardHeader>
              </Card>

              <Card size="sm" className="border-border/60 bg-background/95 shadow-sm">
                <CardHeader className="gap-2">
                  <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    <Shield className="h-3.5 w-3.5" />
                    Global admins
                  </div>
                  <CardTitle className="text-xl font-semibold">
                    {countByRole(users, "ADMIN")}
                  </CardTitle>
                </CardHeader>
              </Card>

              <Card size="sm" className="border-border/60 bg-background/95 shadow-sm">
                <CardHeader className="gap-2">
                  <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    <Shield className="h-3.5 w-3.5" />
                    Super admins
                  </div>
                  <CardTitle className="text-xl font-semibold">
                    {countByRole(users, "SUPER_ADMIN")}
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        <Card className="border-border/60 bg-background/95 shadow-sm">
          <CardHeader className="flex flex-col gap-3 border-b border-border/60 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <CardTitle className="text-base">Users</CardTitle>
              <p className="text-sm text-muted-foreground">
                Search by name, email, or global role.
              </p>
            </div>

            <div className="relative w-full sm:max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search users"
                className="h-10 rounded-xl pl-9"
              />
            </div>
          </CardHeader>

          <CardContent className="px-0 pb-0">
            {isUsersLoading ? (
              <div className="px-5 py-8 text-sm text-muted-foreground">
                Loading users...
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="px-5 py-8 text-sm text-muted-foreground">
                No users matched your search.
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-muted/20">
                  <TableRow>
                    <TableHead className="px-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      User
                    </TableHead>
                    <TableHead className="px-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Email
                    </TableHead>
                    <TableHead className="px-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Global role
                    </TableHead>
                    <TableHead className="px-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Access
                    </TableHead>
                    <TableHead className="px-5 text-right text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredUsers.map((user) => {
                    const manageable = canManageUser(user);
                    const isSelf = user.id === currentUser.id;

                    return (
                      <TableRow key={user.id} className="hover:bg-muted/20">
                        <TableCell className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9 ring-1 ring-border/60">
                              <AvatarFallback className="text-xs font-semibold">
                                {user.firstName?.[0]}
                                {user.lastName?.[0]}
                              </AvatarFallback>
                            </Avatar>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="truncate font-medium text-foreground">
                                  {user.firstName} {user.lastName}
                                </p>
                                {isSelf && (
                                  <Badge variant="outline" className="rounded-full px-2 py-0.5 text-[10px] uppercase tracking-[0.12em]">
                                    You
                                  </Badge>
                                )}
                              </div>
                              <p className="truncate text-sm text-muted-foreground">
                                Account holder
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="px-4 py-3 text-sm text-muted-foreground">
                          {user.email}
                        </TableCell>

                        <TableCell className="px-4 py-3">
                          <Badge
                            variant="outline"
                            className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${ROLE_STYLES[user.role]}`}
                          >
                            {ROLE_LABELS[user.role]}
                          </Badge>
                        </TableCell>

                        <TableCell className="px-4 py-3 text-sm text-muted-foreground">
                          {manageable ? "Manageable" : "Restricted"}
                        </TableCell>

                        <TableCell className="px-5 py-3">
                          <div className="flex justify-end gap-2">
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingUser(user)}
                              disabled={!manageable}
                            >
                              <PencilLine className="h-3.5 w-3.5" />
                              Edit
                            </Button>

                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => setPasswordUser(user)}
                              disabled={!manageable || isSelf}
                            >
                              <KeyRound className="h-3.5 w-3.5" />
                              Reset password
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <EditUserDialog
        currentUser={currentUser}
        open={!!editingUser}
        onOpenChange={(open) => {
          if (!open) setEditingUser(null);
        }}
        user={editingUser}
      />

      <ResetUserPasswordDialog
        open={!!passwordUser}
        onOpenChange={(open) => {
          if (!open) setPasswordUser(null);
        }}
        user={passwordUser}
      />
    </div>
  );
}
