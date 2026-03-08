import { useParams } from "react-router-dom";
import { useState } from "react";

import { useProject } from "../features/projects/hooks/useProject";
import { useTasks } from "../features/tasks/hooks/useTask";
import { useUpdateTaskStatus } from "../features/tasks/hooks/useTaskUpdateStatus";

import TaskCard from "../features/tasks/components/TaskCard";
import TaskBoard from "../features/tasks/components/TaskBoard";
import TaskModal from "../features/tasks/components/TaskModal";

import Pagination from "../common/components/Pagination";

import type { Task } from "../features/tasks/types/taskTypes";
import type { TaskStatus } from "../features/tasks/utils/taskStatus";

import { CreateTaskModal } from "../features/tasks/components/createTaskModal";
import TaskFilters from "../features/tasks/components/taskFilters";
import ProjectHeader from "../features/projects/components/ProjectHeader";
import { useDebounce } from "../common/hooks/useDebounce";

export default function ProjectPage() {
  const { teamId, projectId } = useParams<{
    teamId: string;
    projectId: string;
  }>();

  /* -------------------------
     UI State
  -------------------------- */

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const [view, setView] = useState<"list" | "board">("list");

  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const debouncedSearch = useDebounce(search, 400);

  /* -------------------------
     Safe fallback values
  -------------------------- */

  const safeTeamId = teamId ?? "";
  const safeProjectId = projectId ?? "";

  /* -------------------------
     Queries
  -------------------------- */

  const { data: project } = useProject(safeTeamId, safeProjectId);

  const { data: tasksData, isLoading } = useTasks(safeTeamId, safeProjectId, {
    page,
    search: debouncedSearch,
    status,
  });

  const tasks = tasksData?.content ?? [];
  const totalPages = tasksData?.totalPages ?? 0;

  /* -------------------------
     Mutations
  -------------------------- */

  const updateStatus = useUpdateTaskStatus(safeTeamId, safeProjectId);

  function handleStatusChange(taskId: string, status: TaskStatus) {
    updateStatus.mutate({
      taskId,
      status,
    });
  }

  /* -------------------------
     Invalid param guard
  -------------------------- */

  if (!teamId || !projectId) {
    return <div className="p-6">Invalid project</div>;
  }

  /* -------------------------
     Render
  -------------------------- */

  return (
    <div className="flex flex-col gap-6 p-6">
      <ProjectHeader
        name={project?.name}
        description={project?.description}
        onCreateTask={() => setCreateOpen(true)}
      />

      <CreateTaskModal
        projectId={safeProjectId}
        open={createOpen}
        onOpenChange={setCreateOpen}
      />

      <TaskFilters
        search={search}
        status={status}
        view={view}
        setSearch={setSearch}
        setStatus={setStatus}
        setPage={setPage}
        setView={setView}
      />

      {/* Content */}

      {isLoading ? (
        <div className="text-sm text-muted-foreground">Loading tasks...</div>
      ) : view === "list" ? (
        <div className="grid gap-4">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onOpen={setSelectedTask} />
          ))}
        </div>
      ) : (
        <TaskBoard
          tasks={tasks}
          onStatusChange={handleStatusChange}
          onOpenTask={setSelectedTask}
        />
      )}

      {/*  */}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {/* Task Modal */}

      {selectedTask && (
        <TaskModal
          open={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          teamId={safeTeamId}
          projectId={safeProjectId}
          taskId={selectedTask.id}
        />
      )}
    </div>
  );
}
