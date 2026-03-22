import { formatDate } from "../../../common/utils/date";
import { useProjectActivity } from "../hooks/useProjectActivity";

import { ActivityItem } from "./ProjectActivityItem";

interface Props {
  teamId: string;
  projectId: string;
  onOpenTask: (taskId: string) => void;
}

export default function ProjectActivity({
  teamId,
  projectId,
  onOpenTask,
}: Props) {
  const { data, isLoading } = useProjectActivity(teamId, projectId);

  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground">Loading activity...</div>
    );
  }

  if (!data || Object.keys(data).length === 0) {
    return <div className="text-sm text-muted-foreground">No activity yet</div>;
  }

  return (
    <div className="w-full space-y-6">
      {Object.entries(data).map(([date, items]) => (
        <div key={date} className="space-y-3">
          <div className="text-xs font-medium text-muted-foreground">
            {formatDate(date)}
          </div>

          <div className="relative pl-5 space-y-2">
            <div className="absolute left-2 top-0 bottom-0 w-px bg-border" />

            {items.map((item) => (
              <ActivityItem key={item.id} item={item} onOpenTask={onOpenTask} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
