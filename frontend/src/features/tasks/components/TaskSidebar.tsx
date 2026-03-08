import TaskMeta from "./TaskMeta";

interface Props {
  teamId: string;
  projectId: string;
  taskId: string;
}

export default function TaskSidebar({ teamId, projectId, taskId }: Props) {
  return (
    <aside className="w-[340px] border-l bg-muted/30 flex flex-col min-h-0">
      <TaskMeta teamId={teamId} projectId={projectId} taskId={taskId} />
    </aside>
  );
}
