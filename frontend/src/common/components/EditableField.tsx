import { useState, useRef, useEffect } from "react";
import { Textarea } from "../../components/ui/textarea";
import { Input } from "../../components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import { Pencil } from "lucide-react";

interface Props {
  value?: string;
  placeholder?: string;
  multiline?: boolean;
  displayClassName?: string;
  inputClassName?: string;
  onSave: (value: string) => void;
}

export default function EditableField({
  value = "",
  placeholder = "Click to edit",
  multiline = false,
  displayClassName,
  inputClassName,
  onSave,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  const save = () => {
    const trimmed = draft.trim();

    if (trimmed !== value) {
      onSave(trimmed);
    }

    setEditing(false);
  };

  const cancel = () => {
    setDraft(value);
    setEditing(false);
  };

  if (editing) {
    if (multiline) {
      return (
        <Textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={save}
          onKeyDown={(e) => {
            if (e.key === "Escape") cancel();
          }}
          className={inputClassName}
        />
      );
    }

    return (
      <Input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={save}
        onKeyDown={(e) => {
          if (e.key === "Enter") save();
          if (e.key === "Escape") cancel();
        }}
        className={inputClassName}
      />
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            onClick={() => setEditing(true)}
            className="group flex items-center gap-2 cursor-pointer hover:bg-muted px-2 py-1 rounded transition-colors"
          >
            <span className={displayClassName}>{value || placeholder}</span>

            <Pencil className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </TooltipTrigger>

        <TooltipContent>Click to edit</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
