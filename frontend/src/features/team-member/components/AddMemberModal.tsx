import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";

import { Button } from "../../../components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

import UserSelector from "../../../common/components/UserSelector";
import { useAddMember } from "../hooks/useAddMember";
import type { User } from "../../users/types/userType";

const schema = z.object({
  userId: z.string(),
  role: z.enum(["ADMIN", "MEMBER"]),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  teamId: string;
  open: boolean;
  isLoading: boolean;
  onOpenChange: (open: boolean) => void;
  users: User[];
}

export default function AddMemberModal({
  teamId,
  open,
  isLoading,
  onOpenChange,
  users,
}: Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      role: "MEMBER",
    },
  });

  const invite = useAddMember(teamId);

  const onSubmit = (data: FormValues) => {
    invite.mutate(data, {
      onSuccess: () => {
        form.reset();
        onOpenChange(false);
      },
    });
  };

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading...</div>;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-110 p-0 overflow-hidden"
        aria-describedby={undefined}
      >
        {/* HEADER */}
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-lg font-semibold">
            Add Member
          </DialogTitle>

          <p className="text-sm text-muted-foreground">
            Add someone to your team and assign their role.
          </p>
        </DialogHeader>

        {/* BODY */}
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="px-6 pb-6 space-y-5"
        >
          {/* USER SELECTOR */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">
              User
            </label>

            <Controller
              control={form.control}
              name="userId"
              render={({ field }) => (
                <div className="rounded-lg border bg-muted/40 p-2">
                  <UserSelector
                    users={users}
                    value={field.value}
                    placeholder="Search and select user"
                    onChange={(val) => field.onChange(val ?? "")}
                  />
                </div>
              )}
            />

            {form.formState.errors.userId && (
              <p className="text-xs text-destructive">
                {form.formState.errors.userId.message}
              </p>
            )}
          </div>

          {/* ROLE */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">
              Role
            </label>

            <Select
              value={form.watch("role")}
              onValueChange={(value) =>
                form.setValue("role", value as "ADMIN" | "MEMBER")
              }
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="MEMBER">
                  <div className="flex flex-col">
                    <span>Member</span>
                    <span className="text-xs text-muted-foreground">
                      Can view and manage assigned tasks
                    </span>
                  </div>
                </SelectItem>

                <SelectItem value="ADMIN">
                  <div className="flex flex-col">
                    <span>Admin</span>
                    <span className="text-xs text-muted-foreground">
                      Can manage members and settings
                    </span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="h-9"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={invite.isPending}
              className="h-9 px-4"
            >
              {invite.isPending ? "Inviting..." : "Send Invite"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
