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
  onStatusChange: (taskId: string, status: string) => void;
}

export default function TaskBoard({ tasks, onStatusChange }: Props) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 2,
      },
    }),
  );

  const columns = {
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

    // If dropped on a column → change status
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
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-3 gap-4">
        <BoardColumn id="TODO" title="TODO" tasks={columns.TODO} />

        <BoardColumn
          id="IN_PROGRESS"
          title="IN PROGRESS"
          tasks={columns.IN_PROGRESS}
        />

        <BoardColumn id="DONE" title="DONE" tasks={columns.DONE} />
      </div>

      {/* Floating Drag Preview */}
      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  );
}

function BoardColumn({
  id,
  title,
  tasks,
}: {
  id: TaskStatus;
  title: string;
  tasks: Task[];
}) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef} className="bg-gray-50 p-4 rounded space-y-3 min-h-75">
      <h3 className="font-semibold text-sm text-gray-600">{title}</h3>

      <SortableContext
        items={tasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        {tasks.map((task) => (
          <SortableTask key={task.id} task={task} />
        ))}
      </SortableContext>
    </div>
  );
}

function SortableTask({ task }: { task: Task }) {
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
      <TaskCard task={task} />
    </div>
  );
}
