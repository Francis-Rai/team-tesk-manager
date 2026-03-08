import { useState } from "react";
import type { Task } from "../types/taskTypes";
import { useParams } from "react-router-dom";
import { useUpdateTask } from "../hooks/useUpdateTask";
import { toInstant } from "../../../common/utils/dateUtils";

interface Props {
  task: Task;
  onClose: () => void;
}

export default function EditTaskForm({ task, onClose }: Props) {
  const { teamId, projectId } = useParams();

  const updateTaskMutation = useUpdateTask(teamId!, projectId!, task.id);

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const [priority, setPriority] = useState(task.priority);
  const [plannedStartDate, setPlannedStartDate] = useState(
    task.plannedStartDate,
  );
  const [plannedDueDate, setPlannedDueDate] = useState(task.plannedDueDate);

  const handleSave = () => {
    updateTaskMutation.mutate({
      title,
      description,
      priority,
      plannedStartDate: toInstant(plannedStartDate),
      plannedDueDate: toInstant(plannedDueDate),
    });

    onClose();
  };

  return (
    <div className="space-y-3">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 rounded w-full"
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2 rounded w-full"
      />

      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="LOW">LOW</option>
        <option value="MEDIUM">MEDIUM</option>
        <option value="HIGH">HIGH</option>
      </select>

      <input
        type="datetime-local"
        value={plannedStartDate}
        onChange={(e) => setPlannedStartDate(e.target.value)}
        className="border p-2 rounded"
      />

      <input
        type="datetime-local"
        value={plannedDueDate}
        onChange={(e) => setPlannedDueDate(e.target.value)}
        className="border p-2 rounded"
      />

      <div className="flex gap-2">
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save
        </button>

        <button onClick={onClose} className="border px-4 py-2 rounded">
          Cancel
        </button>
      </div>
    </div>
  );
}
