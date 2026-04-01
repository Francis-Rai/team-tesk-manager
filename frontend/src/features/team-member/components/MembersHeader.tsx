import { Button } from "../../../components/ui/button";
import type { User } from "../../users/types/userType";

interface Props {
  teamId: string;
  availableUsers: User[];
  setOpen: () => void;
}

export default function MembersHeader({ setOpen }: Props) {
  return (
    <div className="flex items-start justify-between border-b pb-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Members</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your team members and roles
        </p>
      </div>

      <Button onClick={setOpen} className="gap-2">
        Add Member
      </Button>
    </div>
  );
}
