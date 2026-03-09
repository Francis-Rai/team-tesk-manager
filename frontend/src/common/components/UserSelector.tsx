import type { TeamMember } from "../../features/teams/types/memberTypes";

interface Props {
  users: TeamMember[];
  value?: string;
  onSelect: (userId: string) => void;
}

export default function UserSelector({ users, value, onSelect }: Props) {
  const handleChange = (userId: string) => {
    if (userId === value) return;

    onSelect(userId);
  };

  return (
    <select
      value={value ?? ""}
      onChange={(e) => handleChange(e.target.value)}
      className="border p-2 rounded"
    >
      {users.map((user) => (
        <option key={user.userId} value={user.userId}>
          {user.firstName} {user.lastName} ({user.role})
        </option>
      ))}
    </select>
  );
}
