interface Props {
  priority: string;
}

export default function PriorityBadge({ priority }: Props) {
  const styles: Record<string, string> = {
    HIGH: "bg-red-100 text-red-700",
    MEDIUM: "bg-yellow-100 text-yellow-700",
    LOW: "bg-green-100 text-green-700",
  };

  return (
    <span
      className={`text-xs px-2 py-1 rounded font-medium ${styles[priority]}`}
    >
      {priority}
    </span>
  );
}
