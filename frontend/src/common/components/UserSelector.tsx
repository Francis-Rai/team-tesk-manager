import { ChevronsUpDown, Check } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import type { TeamMember } from "../../features/teams/types/memberTypes";
import { cn } from "../../lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../../components/ui/command";
import { Button } from "../../components/ui/button";
import { useState } from "react";

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
  placeholder = "Select user",
  allowClear = false,
  onChange,
}: Props) {
  const [open, setOpen] = useState(false);

  const selectedUser = users.find((u) => u.userId === value);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            "w-full justify-between overflow-x-hidden",
            !value && "text-muted-foreground",
          )}
        >
          {selectedUser
            ? `${selectedUser.firstName} ${selectedUser.lastName}`
            : placeholder}

          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search user..." />

          <CommandEmpty>No user found.</CommandEmpty>

          <CommandGroup>
            {/* Optional clear */}
            {allowClear && (
              <CommandItem
                value="none"
                onSelect={() => {
                  onChange(null);
                  setOpen(false);
                }}
              >
                None
              </CommandItem>
            )}

            {users.map((user) => {
              const label = `${user.firstName} ${user.lastName}`;

              return (
                <CommandItem
                  key={user.userId}
                  value={label}
                  onSelect={() => {
                    onChange(user.userId);
                    setOpen(false);
                  }}
                >
                  {label}

                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === user.userId ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              );
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
