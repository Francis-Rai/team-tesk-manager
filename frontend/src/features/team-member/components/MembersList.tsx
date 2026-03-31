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
}

export default function MembersList({
  members,
  isLoading,
  search,
  role,
}: Props) {
  const filtered = members.filter((m) => {
    const fullName = `${m.firstName} ${m.lastName}`.toLowerCase();

    const matchesSearch =
      fullName.includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase());

    const matchesRole = role === "ALL" || m.role === role;

    return matchesSearch && matchesRole;
  });

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
            <TableHead>Member</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Email</TableHead>
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
                      {member.firstName[0]}
                      {member.lastName[0]}
                    </AvatarFallback>
                  </Avatar>

                  <span className="font-medium">
                    {member.firstName} {member.lastName}
                  </span>
                </div>
              </TableCell>

              <TableCell>
                <Badge variant="secondary">{member.role}</Badge>
              </TableCell>

              <TableCell>{member.email}</TableCell>

              <TableCell className="text-right">
                <Button size="sm" variant="ghost">
                  Manage
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
