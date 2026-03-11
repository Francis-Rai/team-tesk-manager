import type { TeamMember } from "../../features/teams/types/memberTypes";

interface Props {
  users: TeamMember[];
  value?: string;
  placeholder: string;
  allowClear?: boolean;
  onChange: (userId: string | null) => void;
}

export default function UserSelector({
  users,
  value,
  placeholder,
  allowClear = false,
  onChange,
}: Props) {
  return (
    <select
      value={value ?? ""}
      onChange={(e) => {
        const val = e.target.value;
        onChange(val === "" ? null : val);
      }}
      className="border rounded-md py-1 text-sm w-full"
    >
      {/* Placeholder */}
      <option value="" disabled>
        {placeholder}
      </option>

      {/* Optional clear option */}
      {allowClear && <option value="">None</option>}

      {users.map((user) => (
        <option key={user.userId} value={user.userId}>
          {user.firstName} {user.lastName}
        </option>
      ))}
    </select>
  );
}
