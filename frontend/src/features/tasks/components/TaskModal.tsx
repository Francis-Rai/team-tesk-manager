import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "../../../components/ui/dialog";
import { useTeamMe } from "../../teams/hooks/useTeamMe";
import { useTask } from "../hooks/useTask";
import { getTaskPermissions } from "../utils/taskPermissions";
import TaskDescription from "./TaskDescription";
import TaskHeader from "./TaskHeader";
import TaskMetadata from "./TaskMetadata";
import TaskTimeline from "./TaskActivity";
import TaskUpdateForm from "./TaskUpdateForm";

interface Props {
  open: boolean;
  onClose: () => void;
  taskId: string;
  teamId: string;
  projectId: string;
  onTaskDeleted: () => void;
}

export default function TaskModal({
  open,
  onClose,
  taskId,
  teamId,
  projectId,
  onTaskDeleted,
}: Props) {
  const { data: task, isLoading } = useTask(teamId, projectId, taskId);
  const { data: teamMe } = useTeamMe(teamId);

  if (isLoading || !task) {
    return <div className="p-6">Loading task...</div>;
  }

  const permissions = getTaskPermissions({
    role: teamMe?.role ?? null,
    userId: teamMe?.userId,
    assigneeId: task?.assignedUser?.id,
    supportId: task?.supportUser?.id,
  });
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="sm:min-w-[70vw] xl:min-w-[40vw] max-h-[90vh] sm:h-full lg:h-fit lg:max-h-[80vh] p-0 overflow-auto"
        aria-describedby={undefined}
      >
        <div className="flex flex-col h-full">
          <DialogTitle>
            <TaskHeader
              task={task}
              teamId={teamId}
              projectId={projectId}
              permissions={permissions}
              onTaskDeleted={onTaskDeleted}
            />
          </DialogTitle>
          <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8">
            <TaskMetadata teamId={teamId} projectId={projectId} task={task} />

            <TaskDescription
              teamId={teamId}
              projectId={projectId}
              task={task}
              permissions={permissions}
            />

            <TaskUpdateForm
              teamId={teamId}
              projectId={projectId}
              taskId={task.id}
              permissions={permissions}
            />

            <TaskTimeline
              teamId={teamId}
              projectId={projectId}
              taskId={task.id}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
