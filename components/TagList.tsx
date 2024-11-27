"use client";

import { Note } from "../types/Note";
import { Button } from "./ui/button";
import { extractTags } from "../utils/noteUtils";

interface TagListProps {
  notes: Note[];
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
}

export default function TagList({
  notes,
  selectedTags,
  onToggleTag,
}: TagListProps) {
  const tags = Array.from(
    new Set(notes.flatMap((note) => extractTags(note.content)))
  );

  return (
    <div className="mb-2">
      <h2 className="text-sm font-semibold mb-1 dark:text-gray-200">Tags</h2>
      <div className="flex flex-wrap gap-1">
        {tags.map((tag) => (
          <Button
            key={tag}
            variant={selectedTags.includes(tag) ? "default" : "outline"}
            size="sm"
            onClick={() => onToggleTag(tag)}
            className="text-xs"
          >
            {tag}
          </Button>
        ))}
      </div>
    </div>
  );
}
