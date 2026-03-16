import { useParams } from "react-router-dom";
import { useState } from "react";

import { useProject } from "../features/projects/hooks/useProject";
import { useTasks } from "../features/tasks/hooks/useTask";

import TaskBoard from "../features/tasks/components/TaskBoard";
import TaskModal from "../features/tasks/components/TaskModal";

import type { DeletedFilter, Task } from "../features/tasks/types/taskTypes";
import type { TaskStatus } from "../features/tasks/utils/taskStatus";

import { CreateTaskModal } from "../features/tasks/components/createTaskModal";
import TaskFilters from "../features/tasks/components/taskFilters";
import ProjectHeader from "../features/projects/components/ProjectHeader";
import { useDebounce } from "../common/hooks/useDebounce";
import TaskList from "../features/tasks/components/TaskList";
import { useUpdateTaskStatus } from "../features/tasks/hooks/useUpdateTaskStatus";

export default function ProjectPage() {
  const { teamId, projectId } = useParams<{
    teamId: string;
    projectId: string;
  }>();

  /* -------------------------
     UI State
  -------------------------- */
  const [deletedFilter, setDeletedFilter] = useState<DeletedFilter>("ACTIVE");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const [view, setView] = useState<"list" | "board">("list");

  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("createdAt,desc");
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
    sort,
    deletedFilter,
  });

  const tasks = tasksData?.content ?? [];
  const totalPages = tasksData?.totalPages ?? 0;

  /* -------------------------
     Mutations
  -------------------------- */

  const updateStatus = useUpdateTaskStatus(safeTeamId, safeProjectId);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(0);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatus(value === "ALL" ? "" : value);
    setPage(0);
  };

  const handleDeletedFilterChange = (value: DeletedFilter) => {
    setDeletedFilter(value);
    setPage(0);
  };

  const handleViewChange = (value: "list" | "board") => {
    setView(value);
  };

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
    <div className="flex flex-col gap-6 p-6 max-h-[90vh]">
      <ProjectHeader name={project?.name} description={project?.description} />

      <CreateTaskModal
        teamId={safeTeamId}
        projectId={safeProjectId}
        open={createOpen}
        onOpenChange={setCreateOpen}
      />

      <TaskFilters
        search={search}
        status={status}
        view={view}
        deletedFilter={deletedFilter}
        onSearchChange={handleSearchChange}
        onStatusFilterChange={handleStatusFilterChange}
        onDeletedFilterChange={handleDeletedFilterChange}
        onViewChange={handleViewChange}
        onCreateTask={() => setCreateOpen(true)}
      />

      {/* Content */}

      {isLoading ? (
        <div className="text-sm text-muted-foreground">Loading tasks...</div>
      ) : view === "list" ? (
        <TaskList
          tasks={tasks}
          teamId={safeTeamId}
          projectId={safeProjectId}
          pagination={{
            page,
            totalPages,
            onPageChange: setPage,
          }}
          sort={sort}
          onSortChange={setSort}
        />
      ) : (
        <TaskBoard
          tasks={tasks}
          onStatusChange={handleStatusChange}
          onOpenTask={setSelectedTask}
        />
      )}

      {/* Task Modal */}

      {selectedTask && (
        <TaskModal
          open={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onTaskDeleted={() => setSelectedTask(null)}
          taskId={selectedTask.id}
          teamId={safeTeamId}
          projectId={safeProjectId}
        />
      )}
    </div>
  );
}
