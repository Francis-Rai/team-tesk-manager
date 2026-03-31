import { UserPlus } from "lucide-react";
import { Button } from "../../../components/ui/button";

export default function MembersHeader({ onInvite }: { onInvite: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-xl font-semibold">Members</h1>
        <p className="text-sm text-muted-foreground">
          Manage your team members and roles
        </p>
      </div>

      <Button onClick={onInvite} className="gap-2">
        <UserPlus className="h-4 w-4" />
        Invite Member
      </Button>
    </div>
  );
}
