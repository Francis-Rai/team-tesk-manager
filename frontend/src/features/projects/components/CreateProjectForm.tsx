import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import {
  type CreateProjectInput,
  createProjectSchema,
} from "../types/createProjectSchema";
import { Label } from "../../../components/ui/label";
import { Button } from "../../../components/ui/button";
import { useCreateProject } from "../hooks/useCreateProject";
import { Separator } from "../../../components/ui/separator";

interface Props {
  teamId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateProjectForm({ teamId, onSuccess, onCancel }: Props) {
  const createProjectMutation = useCreateProject(teamId);

  const form = useForm<CreateProjectInput>({
    resolver: zodResolver(createProjectSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = (data: CreateProjectInput) => {
    createProjectMutation.mutate(data, {
      onSuccess: () => {
        form.reset();
        onSuccess?.();
      },
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="name">Project name</Label>

        <Input
          id="name"
          placeholder="e.g. Website Redesign"
          {...form.register("name")}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>

        <Textarea
          id="description"
          placeholder="What is this project about?"
          rows={3}
          {...form.register("description")}
        />
      </div>
      <Separator />

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>

        <Button
          type="submit"
          variant="default"
          disabled={createProjectMutation.isPending || !form.formState.isValid}
        >
          {createProjectMutation.isPending ? "Creating..." : "Create Project"}
        </Button>
      </div>
    </form>
  );
}
