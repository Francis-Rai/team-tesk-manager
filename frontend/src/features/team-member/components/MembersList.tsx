import { useState } from "react";
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

interface Props {
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

  const [removeModalOpen, setRemoveModalOpen] = useState(false);

  const updateRole = useUpdateMemberRole(teamId);
  const removeMember = useRemoveMember(teamId);

  const filtered = members.filter((m) => {
    const fullName = `${m.firstName} ${m.lastName}`.toLowerCase();

    const matchesSearch =
      fullName.includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase());

    const matchesRole = role === "ALL" || m.role === role;

    return matchesSearch && matchesRole;
  });

  function handleSort(field: string) {
    const [currentField, direction] = sort.split(",");

    if (currentField === field) {
      const newDir = direction === "asc" ? "desc" : "asc";
      onSortChange(`${field},${newDir}`);
    } else {
      onSortChange(`${field},asc`);
    }
  }

  function onOpenRemove(member: TeamMember) {
    setSelectedMember(member);
    setRemoveModalOpen(true);
  }

  type EditableRole = "ADMIN" | "MEMBER";

  function handleRoleChange(memberId: string, role: string) {
    updateRole.mutate({
      memberId,
      role: role as EditableRole,
    });
  }

  const isUpdating = updateRole.isPending;

  function handleRemove() {
    if (!selectedMember) return;

    removeMember.mutate(selectedMember.userId);
    setRemoveModalOpen(false);
  }

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

              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filtered.map((member) => {
              const isOwner = member.role === "OWNER";

              return (
                <TableRow key={member.userId}>
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
                    {member.role === "OWNER" ? (
                      <Badge variant="outline" className={TeamRoleStyles.OWNER}>
                        {TeamRoleLabel.OWNER}
                      </Badge>
                    ) : (
                      <Select
                        value={(member.role ?? "MEMBER") as TeamRole}
                        onValueChange={(value) =>
                          handleRoleChange(member.userId, value)
                        }
                        disabled={isUpdating}
                      >
                        <SelectTrigger
                          className={`h-8 w-35 text-xs font-medium ${TeamRoleStyles[(member.role ?? "MEMBER") as TeamRole]}`}
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
                        <DropdownMenuItem
                          disabled={isOwner}
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

      <RemoveMemberModal
        open={removeModalOpen}
        onClose={() => setRemoveModalOpen(false)}
        member={selectedMember}
        onConfirm={handleRemove}
        isLoading={removeMember.isPending}
      />
    </>
  );
}
