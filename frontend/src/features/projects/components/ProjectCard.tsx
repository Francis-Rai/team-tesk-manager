import { formatDateTimeShort } from "../../../common/utils/dateFormatter";
import { Card, CardContent } from "../../../components/ui/card";
import type { Project } from "../types/projectTypes";
import {
  ProjectStatusLabel,
  ProjectStatusStyles,
} from "../utils/projectStatus";

interface Props {
  project: Project;
  onClick: () => void;
}

export default function ProjectCard({ project, onClick }: Props) {
  return (
    <Card
      onClick={onClick}
      className="
    cursor-pointer group transition
    hover:shadow-sm hover:border-muted-foreground/20
  "
    >
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-base leading-tight line-clamp-2">
            {project.name}
          </h3>

          <span
            className={`
          shrink-0 inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium
          ${ProjectStatusStyles[project.status]}
        `}
          >
            {ProjectStatusLabel[project.status]}
          </span>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {project.description || "No description"}
        </p>

        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
          <span>Updated {formatDateTimeShort(project.updatedAt)}</span>

          <span>
            Created by{" "}
            <span className="font-medium text-foreground">
              {project.createdBy.firstName} {project.createdBy.lastName}
            </span>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
