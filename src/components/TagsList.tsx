import TagPill from "./TagPill";

interface TagsListProps {
  tags: string[];
  maxVisible?: number;
}

export default function TagsList({ tags, maxVisible = 2 }: TagsListProps) {
  if (tags.length === 0) return null;

  const visible = tags.slice(0, maxVisible);
  const overflow = tags.length - maxVisible;

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {visible.map((tag) => (
        <TagPill key={tag} tag={tag} />
      ))}
      {overflow > 0 && (
        <span className="text-[9px] text-gray-400 dark:text-gray-500 font-medium">
          +{overflow}
        </span>
      )}
    </div>
  );
}
