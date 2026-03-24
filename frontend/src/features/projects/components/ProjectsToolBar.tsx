import { Input } from "../../../components/ui/input";

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
}

export default function ProjectsToolbar({ search, onSearchChange }: Props) {
  return (
    <div className="flex items-center justify-between">
      <Input
        placeholder="Search projects..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="max-w-sm"
      />
    </div>
  );
}
