import { Card, CardContent } from "../../../components/ui/card";

interface Props {
  name: string;
  description?: string;
  onClick: () => void;
}

export default function ProjectCard({ name, description, onClick }: Props) {
  return (
    <Card
      onClick={onClick}
      className="
        cursor-pointer group transition
        hover:shadow-sm hover:border-muted-foreground/20
      "
    >
      <CardContent className="p-4">
        <h3 className="font-semibold text-base truncate">{name}</h3>

        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
          {description || "No description"}
        </p>

        {/* <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
          <span>Updated recently</span>

          <span className="opacity-0 group-hover:opacity-100 transition">
            →
          </span>
        </div> */}
      </CardContent>
    </Card>
  );
}
