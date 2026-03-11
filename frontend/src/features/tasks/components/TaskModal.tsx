import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "../../../components/ui/dialog";
import { useTask } from "../hooks/useTask";
import TaskDescription from "./TaskDescription";
import TaskHeader from "./TaskHeader";
import TaskMetadata from "./TaskMetadata";
import TaskTimeline from "./TaskTimeline";
import TaskUpdateForm from "./TaskUpdateForm";

interface Props {
  open: boolean;
  onClose: () => void;
  taskId: string;
  teamId: string;
  projectId: string;
}

export default function TaskModal({
  open,
  onClose,
  taskId,
  teamId,
  projectId,
}: Props) {
  const { data: task, isLoading } = useTask(teamId, projectId, taskId);
  if (isLoading || !task) {
    return <div className="p-6">Loading task...</div>;
  }
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="sm:min-w-[70vw] xl:min-w-[40vw] max-h-[90vh] sm:h-full lg:h-fit lg:max-h-[80vh] p-0 overflow-auto"
        aria-describedby={undefined}
      >
        <div className="flex flex-col h-full">
          <DialogTitle>
            <TaskHeader task={task} />
          </DialogTitle>
          <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8">
            <TaskMetadata teamId={teamId} projectId={projectId} task={task} />

            <TaskDescription description={task.description} />

            <TaskUpdateForm
              teamId={teamId}
              projectId={projectId}
              taskId={task.id}
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
