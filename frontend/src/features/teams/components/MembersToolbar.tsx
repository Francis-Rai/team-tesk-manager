import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
  role: string;
  onRoleChange: (value: string) => void;
}

export default function MembersToolbar({
  search,
  onSearchChange,
  role,
  onRoleChange,
}: Props) {
  return (
    <div className="flex items-center gap-3">
      <Input
        placeholder="Search members..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="max-w-sm"
      />

      <Select value={role} onValueChange={onRoleChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Role" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="ALL">All Roles</SelectItem>
          <SelectItem value="MEMBER">Member</SelectItem>
          <SelectItem value="ADMIN">Admin</SelectItem>
          <SelectItem value="OWNER">Owner</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
