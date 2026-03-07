import { useParams } from "react-router-dom";
import { useProject } from "../features/projects/hooks/useProject";
import { useTasks } from "../features/tasks/hooks/useTask";
import TaskCard from "../features/tasks/components/TaskCard";
import CreateTaskForm from "../features/tasks/components/createTaskForm";
import Pagination from "../common/components/Pagination";
import { useState } from "react";

export default function ProjectPage() {
  const { teamId, projectId } = useParams();

  const { data: project } = useProject(teamId!, projectId!);

  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [
    assigneeId,
    // , setAssigneeId
  ] = useState("");

  const { data: tasksData, isLoading } = useTasks(teamId!, projectId!, {
    page,
    search,
    status,
    assigneeId,
  });
  const tasks = tasksData?.content ?? [];
  const totalPages = tasksData?.totalPages ?? 0;

  if (isLoading) return <div>Loading tasks...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{project?.name}</h1>
      <p className="text-gray-500">{project?.description}</p>
      <div className="grid gap-4">
        <CreateTaskForm />

        <input
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          className="border p-2 rounded w-full"
        />

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(0);
          }}
          className="border p-2 rounded"
        >
          <option value="">All Status</option>
          <option value="TODO">TODO</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="DONE">DONE</option>
        </select>

        <div className="grid gap-4">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>

        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>{" "}
    </div>
  );
}
