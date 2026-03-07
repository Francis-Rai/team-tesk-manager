import type { TaskUpdate } from "../types/taskUpdatesTypes";

interface Props {
  updates: TaskUpdate[];
}

export default function TaskTimeline({ updates }: Props) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Activity</h3>

      {updates.map((update) => (
        <div key={update.id} className="border rounded p-3 bg-gray-50">
          <div className="text-sm font-medium">{update.createdByName}</div>

          <div className="text-sm text-gray-600">{update.message}</div>

          <div className="text-xs text-gray-400">
            {new Date(update.createdAt).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}
