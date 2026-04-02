import EditableField from "../../../common/components/EditableField";
import { Button } from "../../../components/ui/button";
import { useUpdateTeam } from "../hooks/useUpdateTeam";
import type { TeamPermissions } from "../utils/teamPermissions";

interface Props {
  teamId: string;
  name: string;
  description?: string;
  permissions: TeamPermissions;
}

export default function TeamHeader({
  teamId,
  name,
  description,
  permissions,
}: Props) {
  const updateTeam = useUpdateTeam(teamId);

  return (
    <div className="flex items-start justify-between">
      <div className="flex-1 space-y-2">
        <EditableField
          displayClassName="w-full text-2xl font-semibold tracking-tight"
          inputClassName="w-full text-2xl font-semibold"
          value={name}
          maxLength={100}
          onSave={(value) => updateTeam.mutate({ name: value })}
          disabled={!permissions.canEditTeamDetails}
        />

        <EditableField
          displayClassName="w-full text-sm leading-relaxed text-muted-foreground"
          inputClassName="w-full text-sm"
          multiline
          value={description}
          maxLength={2000}
          onSave={(value) => updateTeam.mutate({ description: value })}
          disabled={!permissions.canEditTeamDetails}
        />
      </div>

      <Button size="sm">Add Member</Button>
    </div>
  );
}
