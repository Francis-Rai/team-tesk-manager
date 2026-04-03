import { Button } from "../../../components/ui/button";
import type { TeamPermissions } from "../../teams/utils/teamPermissions";

interface Props {
  setAddMemberOpen: () => void;
  setTransferOpen: () => void;
  permissions: TeamPermissions;
}

export default function MembersHeader({
  setAddMemberOpen,
  setTransferOpen,
  permissions,
}: Props) {
  return (
    <div className="flex items-start justify-between border-b pb-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Members</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your team members and roles
        </p>
      </div>

      <div className="flex items-center gap-2">
        {permissions.canAddMember && (
          <Button onClick={setAddMemberOpen} className="gap-2">
            Add Member
          </Button>
        )}
        {permissions.canTransferOwnership && (
          <Button variant="outline" onClick={setTransferOpen} className="h-9">
            Transfer Ownership
          </Button>
        )}
      </div>
    </div>
  );
}
