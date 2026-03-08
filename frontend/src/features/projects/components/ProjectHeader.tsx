import { Button } from "../../../components/ui/button";

interface Props {
  name?: string;
  description?: string;
  onCreateTask: () => void;
}

export default function ProjectHeader({
  name,
  description,
  onCreateTask,
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold">{name}</h1>

        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      <div className="flex items-center gap-4">
        <Button onClick={onCreateTask}>Create Task</Button>
      </div>
    </div>
  );
}
