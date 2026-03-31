import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";

import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

import { useInviteMember } from "../hooks/useInviteMember";

const schema = z.object({
  userId: z.string(),
  role: z.enum(["ADMIN", "MEMBER"]),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  teamId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function InviteMemberModal({
  teamId,
  open,
  onOpenChange,
}: Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      role: "MEMBER",
    },
  });

  const invite = useInviteMember(teamId);

  const onSubmit = (data: FormValues) => {
    invite.mutate(data, {
      onSuccess: () => {
        form.reset();
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Member</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Input placeholder="Enter email" {...form.register("userId")} />

          <Select
            value={form.watch("role")}
            onValueChange={(value) =>
              form.setValue("role", value as "ADMIN" | "MEMBER")
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="MEMBER">Member</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
            </SelectContent>
          </Select>

          <Button type="submit" className="w-full" disabled={invite.isPending}>
            {invite.isPending ? "Inviting..." : "Send Invite"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
