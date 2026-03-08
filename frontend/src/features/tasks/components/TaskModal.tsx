import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";

import type { Task } from "../types/taskTypes";

interface Props {
  task: Task | null;
  open: boolean;
  onClose: () => void;
}

export default function TaskModal({ task, open, onClose }: Props) {
  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            #{task.taskNumber} {task.title}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-6">
          {/* LEFT SIDE */}
          <div className="col-span-2 space-y-6">
            <section>
              <h3 className="text-sm font-semibold text-muted-foreground">
                Description
              </h3>

              <p className="mt-2 text-sm">
                {task.description || "No description"}
              </p>
            </section>

            <section>
              <h3 className="text-sm font-semibold text-muted-foreground">
                Activity
              </h3>

              {/* timeline goes here later */}
            </section>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-4">
            <SidebarField label="Status">{task.status}</SidebarField>

            <SidebarField label="Priority">{task.priority}</SidebarField>

            <SidebarField label="Assignee">
              {task.assignedUser?.firstName || "Unassigned"}
            </SidebarField>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SidebarField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <div className="text-xs text-muted-foreground">{label}</div>

      <div className="text-sm font-medium">{children}</div>
    </div>
  );
}
