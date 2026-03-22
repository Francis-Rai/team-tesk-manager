import { useState } from "react";

import { useCreateTaskUpdate } from "../hooks/useCreateTaskUpdate";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";

import AutoResizeTextarea from "../../../common/components/AutoResizeTextarea";

import type { TaskPermissions } from "../utils/taskPermissions";

interface Props {
  teamId: string;
  projectId: string;
  taskId: string;
  permissions: TaskPermissions;
}

export default function TaskUpdateForm({
  teamId,
  projectId,
  taskId,
  permissions,
}: Props) {
  const [message, setMessage] = useState("");

  const createUpdate = useCreateTaskUpdate(teamId, projectId, taskId);

  const handleSubmit = () => {
    if (!message.trim()) return;

    createUpdate.mutate(message, {
      onSuccess: () => {
        setMessage("");
      },
    });
  };

  const handleCancel = () => {
    setMessage("");
  };

  return (
    <div className="flex gap-3">
      <Avatar className="h-8 w-8">
        <AvatarFallback>ME</AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <AutoResizeTextarea
          value={message}
          onChange={setMessage}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          placeholder="Write an update..."
          maxLength={2000}
          disabled={!permissions.canEditTaskDetails}
          isLoading={createUpdate.isPending}
        />
      </div>
    </div>
  );
}
