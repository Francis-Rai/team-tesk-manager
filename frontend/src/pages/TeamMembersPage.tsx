import { useParams } from "react-router-dom";
import { useState } from "react";

import { useTeamMembers } from "../features/teams/hooks/useTeamMembers";
import { useDebounce } from "../common/hooks/useDebounce";
import MembersHeader from "../features/team-member/components/MembersHeader";
import MembersToolbar from "../features/team-member/components/MembersToolbar";
import MembersList from "../features/team-member/components/MembersList";
import InviteMemberModal from "../features/team-member/components/InviteMemberModal";

export default function MembersPage() {
  const { teamId } = useParams<{ teamId: string }>();

  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<string>("ALL");
  const [sort, setSort] = useState("joinedAt,desc");

  const debouncedSearch = useDebounce(search, 400);

  const [inviteOpen, setInviteOpen] = useState(false);

  const { data, isLoading } = useTeamMembers(teamId || "", {
    page,
    search: debouncedSearch,
    sort,
  });

  const members = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;

  if (!teamId) return <div className="p-6">Invalid team</div>;

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <MembersHeader onInvite={() => setInviteOpen(true)} />

      <MembersToolbar
        search={search}
        onSearchChange={setSearch}
        role={role}
        onRoleChange={setRole}
      />

      <MembersList
        members={members}
        isLoading={isLoading}
        search={debouncedSearch}
        role={role}
        pagination={{
          page,
          totalPages,
          onPageChange: setPage,
        }}
        sort={sort}
        onSortChange={setSort}
      />

      <InviteMemberModal
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        teamId={teamId}
      />
    </div>
  );
}
