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
    <div className="flex flex-col sm:flex-row items-center justify-between">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">Members</h1>
        <p className="text-sm text-muted-foreground ">
          Manage your team members and roles
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
        {permissions.canAddMember && (
          <Button onClick={setAddMemberOpen}>Add Member</Button>
        )}
        {permissions.canTransferOwnership && (
          <Button variant="outline" onClick={setTransferOpen}>
            Transfer Ownership
          </Button>
        )}
      </div>
    </div>
  );
}
