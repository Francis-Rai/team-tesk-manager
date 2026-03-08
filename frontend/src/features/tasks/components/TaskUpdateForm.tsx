import { useState } from "react";
import { useParams } from "react-router-dom";
import { useCreateTaskUpdate } from "../hooks/useCreateTaskUpdate";

export default function TaskUpdateForm() {
  const { teamId, projectId, taskId } = useParams();

  const [message, setMessage] = useState("");

  const createComment = useCreateTaskUpdate(teamId!, projectId!, taskId!);

  const handleSubmit = () => {
    if (!message.trim()) return;

    createComment.mutate(message);

    setMessage("");
  };

  return (
    <div className="space-y-2">
      <textarea
        placeholder="Add comment..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="border p-2 w-full rounded"
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Post Comment
      </button>
    </div>
  );
}
