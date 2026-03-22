import { useState, useRef, useEffect } from "react";

import { cn } from "../../lib/utils";
import { Button } from "../../components/ui/button";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onCancel?: () => void;
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
  isLoading?: boolean;
}

export default function AutoResizeTextarea({
  value,
  onChange,
  onSubmit,
  onCancel,
  placeholder = "Write something...",
  maxLength = 500,
  disabled,
  isLoading,
}: Props) {
  const [focused, setFocused] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  /* -------------------------
     Auto resize
  -------------------------- */
  const adjustHeight = () => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  useEffect(() => {
    adjustHeight();
  }, [value]);

  /* -------------------------
     Submit handler
  -------------------------- */
  const handleSubmit = () => {
    if (!value.trim()) return;

    onSubmit();
    setFocused(false);
  };

  return (
    <div
      className={cn(
        "rounded-lg border bg-background px-3 py-2 transition",
        focused && "ring-1 ring-primary",
      )}
    >
      {/* TEXTAREA */}
      <textarea
        ref={textareaRef}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        rows={focused ? 3 : 1}
        maxLength={maxLength}
        onFocus={() => setFocused(true)}
        onChange={(e) => onChange(e.target.value)}
        onInput={adjustHeight}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
          }
        }}
        className="
          w-full resize-none text-sm
          outline-none bg-transparent
          min-h-6 max-h-50
          overflow-y-auto
          placeholder:text-muted-foreground
        "
      />

      {/* ACTION BAR */}
      {focused && (
        <div className="flex items-center justify-between mt-2">
          {/* Character count */}
          <span className="text-xs text-muted-foreground">
            {value.length} / {maxLength}
          </span>

          {/* Actions */}
          <div className="flex gap-2">
            {onCancel && (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => {
                  setFocused(false);
                  onCancel();
                }}
              >
                Cancel
              </Button>
            )}

            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={!value.trim() || isLoading}
            >
              {isLoading ? "Posting..." : "Post"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
