import { FolderKanban, Plus } from "lucide-react";

import { Button } from "../../../components/ui/button";

interface Props {
  onCreateProject: () => void;
}

export function ProjectsHeader({ onCreateProject }: Props) {
  return (
    <section className="rounded-2xl border border-border/60 bg-background/95 p-4 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            <FolderKanban className="h-3.5 w-3.5" />
            Project workspace
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Projects
          </h1>
          <p className="text-sm text-muted-foreground">
            Review and organize the projects owned by this team.
          </p>
        </div>

        <Button className="rounded-xl" onClick={onCreateProject}>
          <Plus className="h-4 w-4" />
          Create project
        </Button>
      </div>
    </section>
  );
}
