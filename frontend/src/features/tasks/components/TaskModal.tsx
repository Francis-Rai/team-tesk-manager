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
      <DialogContent className="max-w-225 w-[95vw] h-[90vh] p-0 overflow-hidden">
        <TaskWorkspace teamId={teamId} projectId={projectId} taskId={taskId} />
      </DialogContent>
    </Dialog>
  );
}
