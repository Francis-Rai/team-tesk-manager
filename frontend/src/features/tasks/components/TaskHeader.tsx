import { Link } from "react-router-dom";

interface Props {
  teamId: string;
  projectId: string;
  taskId: string;
  taskNumber: number;
}

export default function TaskHeader({
  teamId,
  projectId,
  taskId,
  taskNumber,
}: Props) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b bg-background">
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">Task</span>

        <span className="font-mono text-sm text-muted-foreground">
          #{taskNumber}
        </span>
      </div>

      <Link
        to={`/teams/${teamId}/projects/${projectId}/tasks/${taskId}`}
        className="text-sm text-primary hover:underline"
      >
        Open full page
      </Link>
    </div>
  );
}
