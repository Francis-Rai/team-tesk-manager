import EditableField from "../../../common/components/EditableField";
import { Button } from "../../../components/ui/button";
import { useUpdateProject } from "../hooks/useUpdateProject";
import type { ProjectPermissions } from "../utils/projectPermissions";
import { DeleteProjectButton } from "./DeleteProjectButton";

interface Props {
  teamId: string;
  projectId: string;
  name: string;
  description?: string;
  permissions: ProjectPermissions;
  onCreateTask: () => void;
  onProjectDeleted?: () => void;
}

export default function ProjectHeader({
  teamId,
  projectId,
  name,
  description,
  permissions,
  onCreateTask,
  onProjectDeleted,
}: Props) {
  const updateProject = useUpdateProject(teamId, projectId);

  return (
    <div className="flex items-start justify-between gap-6">
      <div className="flex-1 space-y-2">
        <EditableField
          displayClassName="w-full text-2xl font-semibold tracking-tight"
          inputClassName="w-full text-2xl font-semibold"
          value={name}
          maxLength={100}
          onSave={(value) => updateProject.mutate({ name: value })}
          disabled={!permissions.canEditProjectDetails}
        />

        <EditableField
          displayClassName="w-full text-sm leading-relaxed text-muted-foreground"
          inputClassName="w-full text-sm"
          multiline
          value={description}
          maxLength={2000}
          onSave={(value) => updateProject.mutate({ description: value })}
          disabled={!permissions.canEditProjectDetails}
        />
      </div>

      <div className="flex items-center gap-2">
        <Button onClick={onCreateTask}>Create Task</Button>
        <DeleteProjectButton
          teamId={teamId}
          projectId={projectId}
          projectName={name}
          onProjectDeleted={onProjectDeleted}
        />
      </div>
    </div>
  );
}
