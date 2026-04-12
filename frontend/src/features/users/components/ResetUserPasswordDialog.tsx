import { useEffect, useState } from "react";

import type { User } from "../types/userType";
import { useAdminResetUserPassword } from "../hooks/useAdminResetUserPassword";
import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
};

export default function ResetUserPasswordDialog({
  open,
  onOpenChange,
  user,
}: Props) {
  const resetPassword = useAdminResetUserPassword(user?.id ?? "");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      setPassword("");
      setConfirmPassword("");
      setError("");
    }
  }, [open]);

  if (!user) return null;

  const handleReset = async () => {
    if (password.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");

    try {
      await resetPassword.mutateAsync(password);
      onOpenChange(false);
    } catch (mutationError) {
      const message =
        mutationError instanceof Error
          ? mutationError.message
          : "Unable to reset this password right now.";
      setError(message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg gap-0 overflow-hidden p-0">
        <DialogHeader className="border-b border-border/60 px-5 py-4">
          <DialogTitle>Reset password</DialogTitle>
          <DialogDescription>
            Set a new password for {user.firstName} {user.lastName}.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 px-5 py-5">
          <div className="space-y-2">
            <Label htmlFor="reset-user-password">New password</Label>
            <Input
              id="reset-user-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-10 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reset-user-password-confirm">Confirm password</Label>
            <Input
              id="reset-user-password-confirm"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="h-10 rounded-xl"
            />
          </div>

          <p className="text-xs text-muted-foreground">
            Use this for admin resets. The user can sign in with the new password
            immediately after it is saved.
          </p>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter className="px-5 py-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleReset}
            disabled={resetPassword.isPending}
          >
            {resetPassword.isPending ? "Resetting..." : "Reset password"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
