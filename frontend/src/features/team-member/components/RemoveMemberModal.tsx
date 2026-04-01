import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";

import { Button } from "../../../components/ui/button";
import type { TeamMember } from "../types/memberTypes";

interface Props {
  open: boolean;
  onClose: () => void;
  member: TeamMember | null;
  onConfirm: () => void;
  isLoading: boolean;
}

export default function RemoveMemberModal({
  open,
  onClose,
  member,
  onConfirm,
  isLoading,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove Member</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Are you sure you want to remove{" "}
          <span className="font-medium">
            {member?.firstName} {member?.lastName}
          </span>
          ? This action cannot be undone.
        </p>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>

          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Removing..." : "Remove"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
