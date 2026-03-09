import { useForm } from "react-hook-form";
import { useCreateTaskUpdate } from "../hooks/useCreateTaskUpdate";

interface Props {
  teamId: string;
  projectId: string;
  taskId: string;
}

interface FormValues {
  message: string;
}

export default function TaskUpdateForm({ teamId, projectId, taskId }: Props) {
  const { register, handleSubmit, reset } = useForm<FormValues>();

  const createUpdate = useCreateTaskUpdate(teamId, projectId, taskId);

  const onSubmit = (data: FormValues) => {
    createUpdate.mutate(data.message, {
      onSuccess: () => reset(),
    });
  };

  return (
    <div className="space-y-3">
      <div className="border rounded-lg p-4 bg-background space-y-3">
        <textarea
          {...register("message")}
          placeholder="Write an update or comment..."
          rows={4}
          className="w-full resize-none text-sm outline-none"
        />

        <div className="flex justify-end">
          <button
            onClick={handleSubmit(onSubmit)}
            className="px-4 py-2 text-sm bg-primary text-white rounded-md hover:opacity-90"
          >
            Post Update
          </button>
        </div>
      </div>
    </div>
  );
}
