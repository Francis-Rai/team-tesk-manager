import type { TeamMember } from "../../features/teams/types/memberTypes";

interface Props {
  users: TeamMember[];
  onSelect: (userId: string) => void;
}

export default function UserSelector({ users, onSelect }: Props) {
  return (
    <select
      onChange={(e) => onSelect(e.target.value)}
      className="border p-2 rounded"
    >
      <option value="">Select user</option>

      {users.map((user) => (
        <option key={user.userId} value={user.userId}>
          {user.firstName} {user.lastName} ({user.role})
        </option>
      ))}
    </select>
  );
}
