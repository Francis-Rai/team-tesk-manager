import { Button } from "../../../components/ui/button";

interface Props {
  onCreateProject: () => void;
}

export function ProjectsHeader({ onCreateProject }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">Projects</h1>
        <p className="text-sm text-muted-foreground">
          Manage your team’s projects
        </p>
      </div>

      <Button onClick={onCreateProject}>Create Project</Button>
    </div>
  );
}
