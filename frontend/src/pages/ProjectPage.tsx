import { useParams } from "react-router-dom";
import { useProject } from "../features/projects/hooks/useProject";
import { useTasks } from "../features/tasks/hooks/useTask";
import TaskCard from "../features/tasks/components/TaskCard";
import CreateTaskForm from "../features/tasks/components/CreateTaskForm";
import Pagination from "../common/components/Pagination";
import { useState } from "react";
import TaskBoard from "../features/tasks/components/TaskBoard";
import { useUpdateTaskStatus } from "../features/tasks/hooks/useTaskUpdateStatus";

export default function ProjectPage() {
  const { teamId, projectId } = useParams();

  const { data: project } = useProject(teamId!, projectId!);
  const [view, setView] = useState<"list" | "board">("list");
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [
    assigneeId,
    // , setAssigneeId
  ] = useState("");

  const updateStatus = useUpdateTaskStatus(teamId!, projectId!);

  function handleStatusChange(taskId: string, status: string) {
    updateStatus.mutate({ taskId, status });
  }

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
        <div className="flex gap-2">
          <button
            onClick={() => setView("list")}
            className={`px-3 py-1 border rounded ${
              view === "list" ? "bg-blue-600 text-white" : ""
            }`}
          >
            List
          </button>

          <button
            onClick={() => setView("board")}
            className={`px-3 py-1 border rounded ${
              view === "board" ? "bg-blue-600 text-white" : ""
            }`}
          >
            Board
          </button>
        </div>
        {view === "list" ? (
          <div className="grid gap-4">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <TaskBoard tasks={tasks} onStatusChange={handleStatusChange} />
        )}

        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>{" "}
    </div>
  );
}
