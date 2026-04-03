import { useParams } from "react-router-dom";
import { useState } from "react";

import { useTeamMembers } from "../features/teams/hooks/useTeamMembers";
import { useDebounce } from "../common/hooks/useDebounce";
import MembersHeader from "../features/teams/components/MembersHeader";
import MembersToolbar from "../features/teams/components/MembersToolbar";
import MembersList from "../features/teams/components/MembersList";
import { useAvailableUsers } from "../features/teams/hooks/useAvailableUsers";
import AddMemberModal from "../features/teams/components/AddMemberModal";
import TransferOwnershipModal from "../features/teams/components/TransferOwnershipModal";
import { getTeamPermissions } from "../features/teams/utils/teamPermissions";
import { getUserFromToken } from "../features/users/api/userApi";
import { useTeamMe } from "../features/teams/hooks/useTeamMe";

export default function MembersPage() {
  const { teamId } = useParams<{ teamId: string }>();

  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);

  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<string>("ALL");
  const [sort, setSort] = useState("joinedAt,desc");

  const debouncedSearch = useDebounce(search, 400);

  const { data: membersData, isLoading: membersLoading } = useTeamMembers(
    teamId || "",
    {
      page,
      search: debouncedSearch,
      sort,
    },
  );
  const { data: teamMe } = useTeamMe(teamId || "");

  const members = membersData?.content ?? [];
  const totalPages = membersData?.totalPages ?? 0;

  const { data: availableUsersData } = useAvailableUsers(teamId || "", {
    search: debouncedSearch,
  });

  const user = getUserFromToken();
  if (!user?.role) return;

  const permissions = getTeamPermissions({
    globalRole: user.role,
    teamRole: teamMe?.role,
  });

  const availableUsers = availableUsersData?.content ?? [];

  if (!teamId) return <div className="p-6">Invalid team</div>;

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <MembersHeader
        setAddMemberOpen={() => setAddMemberOpen(true)}
        setTransferOpen={() => setTransferOpen(true)}
        permissions={permissions}
      />

      <MembersToolbar
        search={search}
        onSearchChange={setSearch}
        role={role}
        onRoleChange={setRole}
      />

      <MembersList
        permissions={permissions}
        teamId={teamId}
        members={members}
        isLoading={membersLoading}
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

      <AddMemberModal
        users={availableUsers}
        teamId={teamId}
        open={addMemberOpen}
        isLoading={false}
        onOpenChange={setAddMemberOpen}
      />

      <TransferOwnershipModal
        teamId={teamId}
        open={transferOpen}
        onClose={() => setTransferOpen(false)}
        members={members}
      />
    </div>
  );
}
