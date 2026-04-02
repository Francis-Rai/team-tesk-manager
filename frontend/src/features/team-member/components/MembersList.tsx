import { useMemo, useState } from "react";
import { MoreHorizontal } from "lucide-react";

import type { PaginationProps } from "../../../common/components/Pagination";
import Pagination from "../../../common/components/Pagination";
import { formatDate } from "../../../common/utils/date";

import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";

import { useUpdateMemberRole } from "../hooks/useUpdateMemberRole";
import { useRemoveMember } from "../hooks/useRemoveMember";
import RemoveMemberModal from "./RemoveMemberModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  TeamRoleLabel,
  TeamRoleStyles,
  type TeamRole,
} from "../../../common/utils/teamRole";
import { cn } from "../../../lib/utils";
import type { TeamMember } from "../types/memberTypes";
import TransferOwnershipModal from "./TransferOwnershipModal";
import type { TeamPermissions } from "../../teams/utils/teamPermissions";
import { useTeamMe } from "../../teams/hooks/useTeamMe";

interface Props {
  permissions: TeamPermissions;
  teamId: string;
  members: TeamMember[];
  isLoading: boolean;
  search: string;
  role: string;
  pagination: PaginationProps;
  sort: string;
  onSortChange: (sort: string) => void;
}

export default function MembersList({
  permissions,
  teamId,
  members,
  isLoading,
  search,
  role,
  pagination,
  sort,
  onSortChange,
}: Props) {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const [removeOpen, setRemoveOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);

  const updateRole = useUpdateMemberRole(teamId);
  const removeMember = useRemoveMember(teamId);

  const filtered = useMemo(() => {
    return members.filter((m) => {
      const fullName = `${m.firstName} ${m.lastName}`.toLowerCase();

      const matchesSearch =
        fullName.includes(search.toLowerCase()) ||
        m.email.toLowerCase().includes(search.toLowerCase());

      const matchesRole = role === "ALL" || m.teamRole === role;

      return matchesSearch && matchesRole;
    });
  }, [members, search, role]);

  const handleSort = (field: string) => {
    const [currentField, direction] = sort.split(",");

    if (currentField === field) {
      const newDir = direction === "asc" ? "desc" : "asc";
      onSortChange(`${field},${newDir}`);
    } else {
      onSortChange(`${field},asc`);
    }
  };

  const onOpenRemove = (member: TeamMember) => {
    setSelectedMember(member);
    setRemoveOpen(true);
  };

  function onOpenTransfer(member: TeamMember) {
    setSelectedMember(member);
    setTransferOpen(true);
  }

  const { data: teamMe } = useTeamMe(teamId || "");

  const isOwner = teamMe?.role === "OWNER";
  const isAdmin = teamMe?.role === "ADMIN";

  type EditableRole = "ADMIN" | "MEMBER";

  const handleRoleChange = (memberId: string, role: EditableRole) => {
    updateRole.mutate({
      memberId,
      role: role as EditableRole,
    });
  };

  const isUpdating = updateRole.isPending;

  const handleRemove = () => {
    if (!selectedMember) return;

    removeMember.mutate(selectedMember.id);
    setRemoveOpen(false);
  };

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading...</div>;
  }

  if (!filtered.length) {
    return (
      <div className="text-sm text-muted-foreground">No members found.</div>
    );
  }
  return (
    <>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                onClick={() => handleSort("user.lastName")}
                className="cursor-pointer"
              >
                Name
              </TableHead>
              <TableHead
                onClick={() => handleSort("role")}
                className="cursor-pointer"
              >
                Role
              </TableHead>
              <TableHead
                onClick={() => handleSort("user.email")}
                className="cursor-pointer"
              >
                Email
              </TableHead>
              <TableHead
                onClick={() => handleSort("joinedAt")}
                className="cursor-pointer"
              >
                Joined Date
              </TableHead>
              {(isOwner || isAdmin) && (
                <TableHead className="text-right">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>

          <TableBody>
            {filtered.map((member) => {
              const canTransfer =
                permissions.canTransferOwnership &&
                member.teamRole !== "OWNER" &&
                (member.globalRole === "ADMIN" ||
                  member.globalRole === "SUPER_ADMIN");
              const canRemove = member.teamRole !== "OWNER";
              return (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback>
                          {member.lastName[0]}
                          {member.firstName[0]}
                        </AvatarFallback>
                      </Avatar>

                      <span className="font-medium">
                        {member.lastName}, {member.firstName}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    {member.teamRole === "OWNER" ? (
                      <Badge variant="outline" className={TeamRoleStyles.OWNER}>
                        {TeamRoleLabel.OWNER}
                      </Badge>
                    ) : (
                      <Select
                        value={(member.teamRole ?? "MEMBER") as TeamRole}
                        onValueChange={(value) =>
                          handleRoleChange(member.id, value as EditableRole)
                        }
                        disabled={isUpdating}
                      >
                        <SelectTrigger
                          className={`h-8 w-35 text-xs font-medium ${TeamRoleStyles[(member.teamRole ?? "MEMBER") as TeamRole]}`}
                        >
                          <SelectValue />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="ADMIN">
                            <span
                              className={cn(
                                "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
                                TeamRoleStyles.ADMIN,
                              )}
                            >
                              {TeamRoleLabel.ADMIN}
                            </span>
                          </SelectItem>

                          <SelectItem value="MEMBER">
                            <span
                              className={cn(
                                "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
                                TeamRoleStyles.MEMBER,
                              )}
                            >
                              {TeamRoleLabel.MEMBER}
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </TableCell>

                  <TableCell>{member.email}</TableCell>
                  <TableCell>{formatDate(member.joinedAt)}</TableCell>

                  {(isOwner || isAdmin) && (
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-fit">
                          {canTransfer && (
                            <>
                              <DropdownMenuItem
                                onClick={() => onOpenTransfer(member)}
                                className="text-muted-foreground"
                              >
                                Make Owner
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                            </>
                          )}
                          <DropdownMenuItem
                            disabled={canRemove}
                            onClick={() => onOpenRemove(member)}
                            className="
          flex items-center justify-between
          text-destructive
          focus:text-destructive
        "
                          >
                            <span>Remove Member</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {pagination.totalPages > 1 && (
          <div className="border-t p-4">
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={pagination.onPageChange}
            />
          </div>
        )}
      </div>

      <TransferOwnershipModal
        teamId={teamId}
        open={transferOpen}
        onClose={() => setTransferOpen(false)}
        members={members}
        preselectedUserId={selectedMember?.id ?? null}
      />

      <RemoveMemberModal
        open={removeOpen}
        onClose={() => setRemoveOpen(false)}
        member={selectedMember}
        onConfirm={handleRemove}
        isLoading={removeMember.isPending}
      />
    </>
  );
}
