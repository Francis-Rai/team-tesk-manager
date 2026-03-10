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
      <DialogContent className="w-full sm:min-w-180  max-h-[90vh] lg:max-h-fit p-0 overflow-auto">
        <TaskWorkspace teamId={teamId} projectId={projectId} taskId={taskId} />
      </DialogContent>
    </Dialog>
  );
}
