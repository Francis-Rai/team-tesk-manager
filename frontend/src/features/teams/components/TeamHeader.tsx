import { Button } from "../../../components/ui/button";

interface Props {
  team: {
    name: string;
    description?: string;
  };
}

export default function TeamHeader({ team }: Props) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-xl font-semibold">{team.name}</h1>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {team.description}
        </p>
      </div>

      <Button size="sm">Invite Member</Button>
    </div>
  );
}
