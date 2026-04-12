import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Shield, UserRound } from "lucide-react";

import { useCurrentUser } from "../features/auth/hooks/useCurrentUser";
import { useUpdateUserProfile } from "../features/users/hooks/useUpdateUserProfile";
import { useUpdateUserRole } from "../features/users/hooks/useUpdateUserRole";
import type { UserRole } from "../features/users/types/userRole";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Separator } from "../components/ui/separator";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  email: z.string().email("Enter a valid email address"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const ROLE_LABELS: Record<UserRole, string> = {
  USER: "User",
  ADMIN: "Global Admin",
  SUPER_ADMIN: "Super Admin",
};

const ROLE_STYLES: Record<UserRole, string> = {
  USER: "border-border bg-muted/30 text-muted-foreground",
  ADMIN: "border-blue-200 bg-blue-100 text-blue-700",
  SUPER_ADMIN: "border-emerald-200 bg-emerald-100 text-emerald-700",
};

export default function ProfilePage() {
  const { data: user, isLoading } = useCurrentUser();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  useEffect(() => {
    if (!user) return;

    form.reset({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
  }, [form, user]);

  const updateProfile = useUpdateUserProfile(user?.id ?? "");
  const updateRole = useUpdateUserRole(user?.id ?? "");

  if (isLoading || !user) {
    return (
      <div className="p-6 text-sm text-muted-foreground">Loading profile...</div>
    );
  }

  const canManageGlobalRole = user.role === "SUPER_ADMIN";

  const onSubmit = (values: ProfileFormValues) => {
    updateProfile.mutate(values);
  };

  return (
    <div className="min-h-full bg-muted/10 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-5">
        <section className="rounded-3xl border border-border/60 bg-linear-to-br from-background via-background to-muted/20 p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <Avatar className="h-14 w-14 ring-1 ring-border/60">
                <AvatarFallback className="text-sm font-semibold">
                  {user.firstName?.[0]}
                  {user.lastName?.[0]}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 space-y-1">
                <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  <UserRound className="h-3.5 w-3.5" />
                  Account
                </div>
                <h1 className="truncate text-2xl font-semibold tracking-tight text-foreground">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="truncate text-sm text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </div>

            <Badge
              variant="outline"
              className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${ROLE_STYLES[user.role]}`}
            >
              {ROLE_LABELS[user.role]}
            </Badge>
          </div>
        </section>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <Card className="border-border/60 bg-background/95 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Profile details</CardTitle>
            </CardHeader>

            <CardContent>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      First name
                    </label>
                    <Input {...form.register("firstName")} className="h-10 rounded-xl" />
                    {form.formState.errors.firstName && (
                      <p className="text-xs text-destructive">
                        {form.formState.errors.firstName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Last name
                    </label>
                    <Input {...form.register("lastName")} className="h-10 rounded-xl" />
                    {form.formState.errors.lastName && (
                      <p className="text-xs text-destructive">
                        {form.formState.errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Email
                  </label>
                  <Input {...form.register("email")} className="h-10 rounded-xl" />
                  {form.formState.errors.email && (
                    <p className="text-xs text-destructive">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <Separator />

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="rounded-xl"
                    disabled={updateProfile.isPending || !form.formState.isDirty}
                  >
                    {updateProfile.isPending ? "Saving..." : "Save changes"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-5">
            <Card className="border-border/60 bg-background/95 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Global role</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  Current role
                </div>

                <Badge
                  variant="outline"
                  className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${ROLE_STYLES[user.role]}`}
                >
                  {ROLE_LABELS[user.role]}
                </Badge>

                {canManageGlobalRole ? (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Promote to
                    </label>
                    <Select
                      value={user.role}
                      onValueChange={(value) =>
                        updateRole.mutate(value as UserRole)
                      }
                    >
                      <SelectTrigger className="h-10 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USER">User</SelectItem>
                        <SelectItem value="ADMIN">Global Admin</SelectItem>
                        <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      As a SUPER_ADMIN, you can change this account's global role.
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Only SUPER_ADMIN can change global roles.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
