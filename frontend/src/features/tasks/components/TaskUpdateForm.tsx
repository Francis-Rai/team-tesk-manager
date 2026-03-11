import { useForm } from "react-hook-form";
import { useState, useRef } from "react";
import { useCreateTaskUpdate } from "../hooks/useCreateTaskUpdate";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";

interface Props {
  teamId: string;
  projectId: string;
  taskId: string;
}

interface FormValues {
  message: string;
}

const MAX_CHARACTERS = 2000;

export default function TaskUpdateForm({ teamId, projectId, taskId }: Props) {
  const { register, handleSubmit, reset, watch } = useForm<FormValues>();
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const createUpdate = useCreateTaskUpdate(teamId, projectId, taskId);

  const message = watch("message") || "";

  const onSubmit = (data: FormValues) => {
    if (!data.message.trim()) return;

    createUpdate.mutate(data.message, {
      onSuccess: () => {
        reset();
        setFocused(false);

        if (textareaRef.current) {
          textareaRef.current.style.height = "auto";
        }
      },
    });
  };

  const handleCancel = () => {
    reset();
    setFocused(false);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex gap-3 border rounded-md bg-background p-3"
    >
      {/* Avatar */}
      <Avatar className="h-8 w-8">
        <AvatarFallback>ME</AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-2">
        <textarea
          {...register("message", { maxLength: MAX_CHARACTERS })}
          ref={(el) => {
            register("message").ref(el);
            textareaRef.current = el;
          }}
          placeholder="Write an update..."
          rows={focused ? 3 : 1}
          maxLength={MAX_CHARACTERS}
          onFocus={() => setFocused(true)}
          onInput={(e) => {
            const target = e.currentTarget;
            target.style.height = "auto";
            target.style.height = `${target.scrollHeight}px`;
          }}
          className="w-full resize-none text-sm outline-none bg-transparent max-h-[200px] overflow-y-auto"
        />

        {focused && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {message.length} / {MAX_CHARACTERS}
            </span>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="text-sm px-3 py-1.5 rounded-md hover:bg-muted"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!message.trim()}
                className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md disabled:opacity-50"
              >
                Post Update
              </button>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
