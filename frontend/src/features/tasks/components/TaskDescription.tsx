interface Props {
  description?: string;
}

export default function TaskDescription({ description }: Props) {
  return (
    <div className="space-y-2">
      <h2 className="text-sm font-medium text-muted-foreground">Description</h2>

      <p className="text-sm leading-relaxed text-muted-foreground">
        {description || "No description"}
      </p>
    </div>
  );
}
