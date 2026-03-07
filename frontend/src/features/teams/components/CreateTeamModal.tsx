import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useCreateTeam } from "../hooks/useCreateTeam";
import {
  createTeamSchema,
  type CreateTeamInput,
} from "../types/createTeamSchema";

const CreateTeamModal = () => {
  const { mutate, isPending } = useCreateTeam();

  const form = useForm<CreateTeamInput>({
    resolver: zodResolver(createTeamSchema),
  });

  const onSubmit = (data: CreateTeamInput) => {
    mutate(data);
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="border p-6 rounded-lg space-y-4"
    >
      <h2 className="text-xl font-semibold">Create Team</h2>

      <div>
        <input
          {...form.register("name")}
          placeholder="Team name"
          className="border p-2 w-full rounded"
        />
        {form.formState.errors.name && (
          <p className="text-red-500 text-sm">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>

      <div>
        <textarea
          {...form.register("description")}
          placeholder="Description"
          className="border p-2 w-full rounded"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {isPending ? "Creating..." : "Create Team"}
      </button>
    </form>
  );
};

export default CreateTeamModal;
