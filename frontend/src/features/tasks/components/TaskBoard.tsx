import { useState } from "react";

import type { Task } from "../types/taskTypes";
import TaskCard from "./TaskCard";

import {
  DndContext,
  type DragEndEvent,
  type DragStartEvent,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  DragOverlay,
  useDroppable,
} from "@dnd-kit/core";

import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

import {
  isTaskStatus,
  canTransition,
  type TaskStatus,
  TaskStatusLabel,
  TaskStatusStyles,
} from "../utils/taskStatus";
import { cn } from "../../../lib/utils";
import {
  useInfiniteTasks,
  type TaskQueryParams,
} from "../hooks/useInfiniteTasks";

interface Props {
  teamId: string;
  projectId: string;
  params: TaskQueryParams;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onOpenTask: (task: Task) => void;
}

export default function TaskBoard({
  teamId,
  projectId,
  params,
  onStatusChange,
  onOpenTask,
}: Props) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
  );

  function handleDragStart(event: DragStartEvent) {
    const task = event.active.data.current?.task;

    if (task) {
      setActiveTask(task);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    setActiveTask(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTask = active.data.current?.task as Task | undefined;

    if (!activeTask) return;

    if (isTaskStatus(overId)) {
      const newStatus = overId;

      if (!canTransition(activeTask.status, newStatus)) {
        console.warn("Invalid transition");
        return;
      }

      if (activeTask.status !== newStatus) {
        onStatusChange(activeId, newStatus);
      }
    }
  }

  const commonProps = {
    teamId,
    projectId,
    params,
    onOpenTask,
  };

  return (
    <div className="flex h-full min-h-0 overflow-x-auto gap-6 p-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <BoardColumn id="TODO" {...commonProps} />
        <BoardColumn id="IN_PROGRESS" {...commonProps} />
        <BoardColumn id="IN_REVIEW" {...commonProps} />
        <BoardColumn id="ON_HOLD" {...commonProps} />
        <BoardColumn id="DONE" {...commonProps} />
        <BoardColumn id="CANCELLED" {...commonProps} />
        <DragOverlay>
          {activeTask ? (
            <TaskCard task={activeTask} onOpen={onOpenTask} />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

function BoardColumn({
  id,
  teamId,
  projectId,
  params,
  onOpenTask,
}: {
  id: TaskStatus;
  teamId: string;
  projectId: string;
  params: TaskQueryParams;
  onOpenTask: (task: Task) => void;
}) {
  const { setNodeRef } = useDroppable({ id });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteTasks(teamId, projectId, id, params);

  const tasks = data?.pages.flatMap((page) => page.content) ?? [];

  const total = data?.pages[0]?.totalElements ?? 0;

  function handleScroll(e: React.UIEvent<HTMLDivElement>) {
    const el = e.currentTarget;

    const isNearBottom =
      el.scrollHeight - el.scrollTop <= el.clientHeight + 100;

    if (isNearBottom && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }

  return (
    <div
      ref={setNodeRef}
      className="flex flex-col min-w-70 max-w-95 flex-1 rounded-xl border bg-muted/40 shadow-sm h-full min-h-0"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b bg-background/80 sticky top-0 z-10">
        <span
          className={cn(
            "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
            TaskStatusStyles[id],
          )}
        >
          {TaskStatusLabel[id]}
        </span>

        <span className="text-xs text-muted-foreground">{total}</span>
      </div>

      <div
        onScroll={handleScroll}
        className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3"
      >
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <SortableTask key={task.id} task={task} onOpenTask={onOpenTask} />
          ))}
        </SortableContext>

        {isFetchingNextPage && (
          <div className="text-center text-xs py-2">Loading more...</div>
        )}
      </div>
    </div>
  );
}

function SortableTask({
  task,
  onOpenTask,
}: {
  task: Task;
  onOpenTask: (task: Task) => void;
}) {
  const { attributes, listeners, setNodeRef, transform } = useSortable({
    id: task.id,
    data: { task },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: "none",
    willChange: "transform",
    touchAction: "none",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} onOpen={onOpenTask} />
    </div>
  );
}
