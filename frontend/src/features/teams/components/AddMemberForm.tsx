import { Button } from "../../../components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

import UserSelector from "../../../common/components/UserSelector";
import { Separator } from "../../../components/ui/separator";
import { Controller, useForm } from "react-hook-form";
import { useAddMember } from "../hooks/useAddMember";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { User } from "../../users/types/userType";
import { cn } from "../../../lib/utils";
import {
  TeamRoleLabel,
  TeamRoleStyles,
} from "../../../common/utils/teamRoleStyles";

const schema = z.object({
  userId: z.string(),
  role: z.enum(["ADMIN", "MEMBER"]),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  teamId: string;
  users: User[];
  onOpenChange: (open: boolean) => void;
}

export function AddMemberForm({ teamId, users, onOpenChange }: Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      role: "MEMBER",
    },
  });

  const addMember = useAddMember(teamId);

  const onSubmit = (data: FormValues) => {
    addMember.mutate(data, {
      onSuccess: () => {
        form.reset();
        onOpenChange(false);
      },
    });
  };
  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="px-6 py-5 space-y-6"
    >
      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground">
          User
        </label>

        <Controller
          control={form.control}
          name="userId"
          render={({ field }) => (
            <UserSelector
              users={users}
              value={field.value}
              placeholder="Search user..."
              onChange={(val) => field.onChange(val ?? "")}
            />
          )}
        />

        {form.formState.errors.userId && (
          <p className="text-xs text-destructive">
            {form.formState.errors.userId.message}
          </p>
        )}
      </div>

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
          <SelectTrigger className="h-10 w-full">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="MEMBER">
              <span
                className={cn(
                  "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
                  TeamRoleStyles.MEMBER,
                )}
              >
                {TeamRoleLabel.MEMBER}
              </span>{" "}
            </SelectItem>

            <SelectItem value="ADMIN">
              <span
                className={cn(
                  "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
                  TeamRoleStyles.ADMIN,
                )}
              >
                {TeamRoleLabel.ADMIN}
              </span>{" "}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Separator />

      <div className="flex justify-end gap-2 pt-4">
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
          disabled={!form.watch("userId") || addMember.isPending}
          className="h-9 px-4"
        >
          {addMember.isPending ? "Adding..." : "Add member"}
        </Button>
      </div>
    </form>
  );
}
