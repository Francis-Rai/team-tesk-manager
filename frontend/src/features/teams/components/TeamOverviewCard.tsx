import { Card, CardContent } from "../../../components/ui/card";

interface Props {
  title: string;
  description: string;
  onClick: () => void;
}

export default function OverviewCard({ title, description, onClick }: Props) {
  return (
    <Card
      onClick={onClick}
      className="
        cursor-pointer transition
        hover:shadow-sm hover:border-primary/30
        group
      "
    >
      <CardContent className="p-4 space-y-1">
        <h3 className="font-medium group-hover:text-primary transition">
          {title}
        </h3>

        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
