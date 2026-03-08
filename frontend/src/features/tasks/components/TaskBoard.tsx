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
} from "../utils/taskStatus";

interface Props {
  tasks: Task[];
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onOpenTask: (task: Task) => void;
}

export default function TaskBoard({
  tasks,
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

  const columns: Record<TaskStatus, Task[]> = {
    TODO: tasks.filter((t) => t.status === "TODO"),
    IN_PROGRESS: tasks.filter((t) => t.status === "IN_PROGRESS"),
    DONE: tasks.filter((t) => t.status === "DONE"),
  };

  function handleDragStart(event: DragStartEvent) {
    const task = tasks.find((t) => t.id === event.active.id);

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

    const activeTask = tasks.find((t) => t.id === activeId);

    if (!activeTask) return;

    if (isTaskStatus(overId)) {
      const newStatus = overId;

      if (!canTransition(activeTask.status, newStatus)) {
        console.warn("Invalid transition");
        return;
      }

      onStatusChange(activeId, newStatus);
    }
  }

  return (
    <div className="w-full overflow-x-auto">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6 min-w-[900px] items-start p-4">
          <BoardColumn
            id="TODO"
            title="Todo"
            tasks={columns.TODO}
            onOpenTask={onOpenTask}
          />

          <BoardColumn
            id="IN_PROGRESS"
            title="In Progress"
            tasks={columns.IN_PROGRESS}
            onOpenTask={onOpenTask}
          />

          <BoardColumn
            id="DONE"
            title="Done"
            tasks={columns.DONE}
            onOpenTask={onOpenTask}
          />
        </div>

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
  title,
  tasks,
  onOpenTask,
}: {
  id: TaskStatus;
  title: string;
  tasks: Task[];
  onOpenTask: (task: Task) => void;
}) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className="flex flex-col w-[300px] shrink-0 bg-muted/40 rounded-xl border p-4 shadow-sm"
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold tracking-tight">
          {title}
          <span className="ml-2 text-muted-foreground">({tasks.length})</span>
        </h3>
      </div>

      {/* Tasks */}
      <div className="flex flex-col gap-3">
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <SortableTask key={task.id} task={task} onOpenTask={onOpenTask} />
          ))}
        </SortableContext>
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
    animateLayoutChanges: () => false,
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
