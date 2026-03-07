import { useParams } from "react-router-dom";
import { useProject } from "../features/projects/hooks/useProject";
import { useTasks } from "../features/tasks/hooks/useTask";
import TaskCard from "../features/tasks/components/TaskCard";
import CreateTaskForm from "../features/tasks/components/createTaskForm";

export default function ProjectPage() {
  const { teamId, projectId } = useParams();

  const { data: project } = useProject(teamId!, projectId!);

  const { data: tasksData, isLoading } = useTasks(teamId!, projectId!);

  const tasks = tasksData?.content ?? [];

  if (isLoading) return <div>Loading tasks...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{project?.name}</h1>
      <p className="text-gray-500">{project?.description}</p>
      <div className="grid gap-4">
        <CreateTaskForm />

        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>{" "}
    </div>
  );
}
