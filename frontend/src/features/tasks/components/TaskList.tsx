import { useNavigate } from "react-router-dom";

import type { Task } from "../types/taskTypes";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { formatDateTimeShort } from "../../../common/utils/date";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { TaskStatusLabel, TaskStatusStyles } from "../utils/taskStatus";
import Pagination from "../../../common/components/Pagination";
import PriorityBadge from "../../../common/components/PriorityBadge";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

interface Props {
  tasks: Task[];
  teamId: string;
  projectId: string;
  pagination: PaginationProps;
  sort: string;
  onSortChange: (sort: string) => void;
}

export default function TaskList({
  tasks,
  teamId,
  projectId,
  pagination,
  sort,
  onSortChange,
}: Props) {
  const navigate = useNavigate();

  function openTask(taskId: string) {
    navigate(`/teams/${teamId}/projects/${projectId}/tasks/${taskId}`);
  }

  function handleSort(field: string) {
    const [currentField, direction] = sort.split(",");

    if (currentField === field) {
      const newDir = direction === "asc" ? "desc" : "asc";
      onSortChange(`${field},${newDir}`);
    } else {
      onSortChange(`${field},asc`);
    }
  }

  return (
    <div className="border rounded-md">
      <Table>
        {/* HEADER */}

        <TableHeader>
          <TableRow>
            <TableHead className="w-20">#</TableHead>

            <TableHead
              className="cursor-pointer select-none"
              onClick={() => handleSort("title")}
            >
              Title
            </TableHead>

            <TableHead
              className="cursor-pointer select-none"
              onClick={() => handleSort("priority")}
            >
              Priority
            </TableHead>

            <TableHead
              className="cursor-pointer select-none"
              onClick={() => handleSort("status")}
            >
              Status
            </TableHead>

            <TableHead
              className="cursor-pointer select-none"
              onClick={() => handleSort("assignee")}
            >
              Assignee
            </TableHead>

            <TableHead
              className="cursor-pointer select-none"
              onClick={() => handleSort("support")}
            >
              Support
            </TableHead>

            <TableHead
              className="cursor-pointer select-none"
              onClick={() => handleSort("plannedStartDate")}
            >
              Start
            </TableHead>

            <TableHead
              className="cursor-pointer select-none"
              onClick={() => handleSort("plannedDueDate")}
            >
              Due
            </TableHead>
          </TableRow>
        </TableHeader>

        {/* BODY */}

        <TableBody>
          {tasks.map((task) => (
            <TableRow
              key={task.id}
              onClick={() => openTask(task.id)}
              className="cursor-pointer hover:bg-muted/50"
            >
              {/* NUMBER */}

              <TableCell className="text-muted-foreground">
                #{task.taskNumber}
              </TableCell>

              {/* TITLE */}

              <TableCell className="max-w-[320px]">
                <div className="font-medium truncate">{task.title}</div>

                {task.description && (
                  <div className="text-xs text-muted-foreground truncate">
                    {task.description}
                  </div>
                )}
              </TableCell>

              {/* PRIORITY */}

              <TableCell>
                <PriorityBadge priority={task.priority ?? "LOW"} />
              </TableCell>

              {/* STATUS */}

              <TableCell>
                <div
                  className={`inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium ${
                    TaskStatusStyles[task.status]
                  }`}
                >
                  {TaskStatusLabel[task.status]}
                </div>
              </TableCell>

              {/* ASSIGNEE */}

              <TableCell>
                {task.assignedUser ? (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-5 w-5">
                      <AvatarFallback>
                        {task.assignedUser.firstName[0]}
                        {task.assignedUser.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span>
                      {task.assignedUser.firstName +
                        " " +
                        task.assignedUser.lastName}
                    </span>
                  </div>
                ) : (
                  "—"
                )}
              </TableCell>

              {/* SUPPORT */}

              <TableCell>
                {task.supportUser ? (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-5 w-5">
                      <AvatarFallback>
                        {task.supportUser.firstName[0]}
                        {task.supportUser.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span>
                      {task.supportUser.firstName +
                        " " +
                        task.supportUser.lastName}
                    </span>
                  </div>
                ) : (
                  "—"
                )}
              </TableCell>
              {/* START DATE */}

              <TableCell>
                {formatDateTimeShort(task.plannedStartDate)}
              </TableCell>

              {/* DUE DATE */}

              <TableCell>{formatDateTimeShort(task.plannedDueDate)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {pagination.totalPages > 1 && (
        <div className="border-t p-4">
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={pagination.onPageChange}
          />
        </div>
      )}
    </div>
  );
}
