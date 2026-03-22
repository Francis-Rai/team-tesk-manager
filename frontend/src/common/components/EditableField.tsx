import { useState, useRef, useEffect } from "react";

import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";

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
  maxLength?: number;
  displayClassName?: string;
  inputClassName?: string;
  onSave: (value: string) => void;
  disabled?: boolean;
}

export default function EditableField({
  value = "",
  placeholder = "Click to edit",
  multiline = false,
  maxLength,
  displayClassName,
  inputClassName,
  onSave,
  disabled,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [focused, setFocused] = useState(false);

  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  const handleAutoResize = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  const save = () => {
    const trimmed = draft.trim();

    if (trimmed !== value) {
      onSave(trimmed);
    }

    setEditing(false);
    setFocused(false);
  };

  const cancel = () => {
    setDraft(value);
    setEditing(false);
    setFocused(false);
  };

  if (editing) {
    if (multiline) {
      return (
        <div className="space-y-2">
          <Textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={draft}
            maxLength={maxLength}
            onChange={(e) => setDraft(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => {
              if (!focused) save();
            }}
            onInput={(e) => handleAutoResize(e.currentTarget)}
            className={`
              resize-none text-sm
              min-h-10 max-h-50
              overflow-y-auto
              ${inputClassName}
            `}
          />

          {focused && (
            <div className="flex items-center justify-between">
              {maxLength && (
                <span className="text-xs text-muted-foreground">
                  {draft.length} / {maxLength}
                </span>
              )}

              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={cancel}
                >
                  Cancel
                </Button>

                <Button size="sm" onClick={save} disabled={!draft.trim()}>
                  Save
                </Button>
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <Input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        value={draft}
        maxLength={maxLength}
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
            onClick={() => {
              if (disabled) return;
              setEditing(true);
            }}
            className={`
              group flex items-start gap-2 px-2 py-1 rounded-md
              transition-colors
              ${
                disabled ? "cursor-default" : "cursor-pointer hover:bg-muted/50"
              }
            `}
          >
            <span className={displayClassName}>
              {value || (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </span>

            {!disabled && (
              <Pencil className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </div>
        </TooltipTrigger>

        {!disabled && <TooltipContent>Click to edit</TooltipContent>}
      </Tooltip>
    </TooltipProvider>
  );
}
