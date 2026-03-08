import { useState } from "react";
import { useTaskUpdates } from "../hooks/useTaskUpdates";
import Avatar from "../../../common/components/Avatar";

interface Props {
  teamId: string;
  projectId: string;
  taskId: string;
}

export default function TaskTimeline({ teamId, projectId, taskId }: Props) {
  const [page, setPage] = useState(0);

  const { data } = useTaskUpdates(teamId, projectId, taskId, {
    page,
    size: 10,
  });

  const updates = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <div className="space-y-6">
      {updates.map((update) => (
        <div key={update.id} className="flex gap-3">
          <Avatar name={update.createdByName} />

          <div className="flex-1 text-sm space-y-1">
            <div className="font-medium">{update.createdByName}</div>

            <div className="text-muted-foreground">{update.message}</div>

            <div className="text-xs text-muted-foreground">
              {new Date(update.createdAt).toLocaleString()}
            </div>
          </div>
        </div>
      ))}

      {page + 1 < totalPages && (
        <button
          onClick={() => setPage((p) => p + 1)}
          className="w-full text-sm border rounded-md py-2 hover:bg-muted"
        >
          Load more
        </button>
      )}
    </div>
  );
}
