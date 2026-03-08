import { Dialog, DialogContent } from "../../../components/ui/dialog";
import TaskWorkspace from "./TaskWorkspace";

interface Props {
  open: boolean;
  onClose: () => void;
  teamId: string;
  projectId: string;
  taskId: string;
}

export default function TaskModal({
  open,
  onClose,
  teamId,
  projectId,
  taskId,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="!max-w-[1200px] w-[95vw] h-[90vh] p-0 overflow-hidden">
        {/* Important: min-h-0 fixes flex scroll issues */}
        <div className="flex flex-col h-full min-h-0">
          <TaskWorkspace
            teamId={teamId}
            projectId={projectId}
            taskId={taskId}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
