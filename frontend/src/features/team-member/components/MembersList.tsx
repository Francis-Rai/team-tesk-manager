import type { PaginationProps } from "../../../common/components/Pagination";
import Pagination from "../../../common/components/Pagination";
import { formatDate } from "../../../common/utils/date";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import type { TeamMember } from "../../teams/types/memberTypes";

interface Props {
  members: TeamMember[];
  isLoading: boolean;
  search: string;
  role: string;
  pagination: PaginationProps;
  sort: string;
  onSortChange: (sort: string) => void;
}

export default function MembersList({
  members,
  isLoading,
  search,
  role,
  pagination,
  sort,
  onSortChange,
}: Props) {
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

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading...</div>;
  }

  if (!filtered.length) {
    return (
      <div className="text-sm text-muted-foreground">No members found.</div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className="cursor-pointer select-none"
              onClick={() => handleSort("user.lastName")}
            >
              Name
            </TableHead>
            <TableHead
              className="cursor-pointer select-none"
              onClick={() => handleSort("role")}
            >
              Role
            </TableHead>
            <TableHead
              className="cursor-pointer select-none"
              onClick={() => handleSort("user.email")}
            >
              Email
            </TableHead>
            <TableHead
              className="cursor-pointer select-none"
              onClick={() => handleSort("joinedAt")}
            >
              Joined Date
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filtered.map((member) => (
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
                <Badge variant="secondary">{member.role}</Badge>
              </TableCell>

              <TableCell>{member.email}</TableCell>
              <TableCell>{formatDate(member.joinedAt)}</TableCell>

              <TableCell className="text-right">
                <Button size="sm" variant="ghost">
                  Manage
                </Button>
              </TableCell>
            </TableRow>
          ))}
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
  );
}
