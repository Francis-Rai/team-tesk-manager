import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createTeamSchema,
  type CreateTeamInput,
} from "../types/createTeamSchema";
import { useCreateTeam } from "../hooks/useCreateTeam";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Button } from "../../../components/ui/button";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateTeamModal({ open, onOpenChange }: Props) {
  const { mutate, isPending } = useCreateTeam();

  const form = useForm<CreateTeamInput>({
    resolver: zodResolver(createTeamSchema),
  });

  function onSubmit(data: CreateTeamInput) {
    mutate(data, {
      onSuccess: () => {
        onOpenChange(false);
        form.reset();
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Team</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Input placeholder="Team name" {...form.register("name")} />

          <Textarea
            placeholder="Description"
            {...form.register("description")}
          />

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Creating..." : "Create Team"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
