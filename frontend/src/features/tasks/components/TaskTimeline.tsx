import { useState } from "react";
import { useTaskUpdates } from "../hooks/useTaskUpdates";
import TimelineItem from "./TimelineItems";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";

interface Props {
  teamId: string;
  projectId: string;
  taskId: string;
}

export default function TaskTimeline({ teamId, projectId, taskId }: Props) {
  const [page, setPage] = useState(0);

  const { data, isLoading } = useTaskUpdates(teamId, projectId, taskId, {
    page,
    size: 5,
  });

  const updates = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;

  const isFirstPage = page === 0;
  const isLastPage = page + 1 >= totalPages;

  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground">Loading activity...</div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm text-muted-foreground">
          Activity
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {updates.length === 0 && (
          <p className="text-sm text-muted-foreground">No activity yet.</p>
        )}

        {updates.map((update, index) => (
          <TimelineItem
            key={update.id}
            name={update.user.lastName}
            message={update.message}
            createdAt={update.createdAt}
            isLast={index === updates.length - 1}
          />
        ))}

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t pt-4">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 0))}
              disabled={isFirstPage}
              className="px-3 py-1.5 text-sm border rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted"
            >
              Previous
            </button>

            <span className="text-xs text-muted-foreground">
              Page {page + 1} of {totalPages}
            </span>

            <button
              onClick={() => setPage((p) => (isLastPage ? p : p + 1))}
              disabled={isLastPage}
              className="px-3 py-1.5 text-sm border rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted"
            >
              Next
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
