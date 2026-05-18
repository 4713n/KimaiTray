import { useState, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import TagPill from "./TagPill";

interface TagsInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  disabled?: boolean;
}

function addTags(existing: string[], raw: string): string[] {
  const next = [...existing];
  const parts = raw.split(",");
  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const duplicate = next.some(
      (t) => t.toLowerCase() === trimmed.toLowerCase(),
    );
    if (!duplicate) next.push(trimmed);
  }
  return next;
}

export default function TagsInput({
  tags,
  onChange,
  disabled,
}: TagsInputProps) {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const commitInput = useCallback(() => {
    if (!input.trim()) return;
    onChange(addTags(tags, input));
    setInput("");
  }, [input, tags, onChange]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commitInput();
    } else if (e.key === "Backspace" && input === "" && tags.length > 0) {
      e.preventDefault();
      onChange(tags.slice(0, -1));
    }
  };

  const removeTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="flex flex-wrap items-center gap-1 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.06] px-2 py-1 min-h-[28px] cursor-text transition-colors focus-within:border-[var(--accent)] focus-within:ring-1 focus-within:ring-[var(--accent)]"
    >
      {tags.map((tag, i) => (
        <TagPill
          key={tag}
          tag={tag}
          onRemove={disabled ? undefined : () => removeTag(i)}
        />
      ))}
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={commitInput}
        disabled={disabled}
        placeholder={tags.length === 0 ? t("tags.placeholder") : ""}
        className="flex-1 min-w-[60px] bg-transparent text-xs text-gray-700 dark:text-gray-300 placeholder:text-gray-300 dark:placeholder:text-gray-600 outline-none disabled:opacity-40"
      />
    </div>
  );
}
