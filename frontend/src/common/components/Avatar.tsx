interface Props {
  name: string;
}

function getInitials(name: string) {
  const parts = name.split(" ");
  return parts
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function Avatar({ name }: Props) {
  const initials = getInitials(name);

  return (
    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
      {initials}
    </div>
  );
}
