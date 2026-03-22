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
    <div className="flex items-start justify-between">
      <div className="space-y-6">
        <h1 className="text-xl font-semibold">{name}</h1>

        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <Button onClick={onCreateTask}>Create Task</Button>
    </div>
  );
}
