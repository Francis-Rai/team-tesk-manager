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
      <DialogContent className="sm:min-w-[70vw] xl:min-w-[40vw] max-h-[90vh] sm:h-full lg:h-fit lg:max-h-[80vh] p-0 overflow-auto">
        <TaskWorkspace teamId={teamId} projectId={projectId} taskId={taskId} />
      </DialogContent>
    </Dialog>
  );
}
