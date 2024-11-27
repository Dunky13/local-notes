"use client";

import { Trash2 } from "lucide-react";
import { Note } from "../types/Note";
import { extractTitle, extractTags } from "../utils/noteUtils";
import { Button } from "./ui/button";

interface NoteListProps {
  notes: Note[];
  selectedNoteId: number | null;
  onSelectNote: (id: number) => void;
  onDeleteNote: (id: number) => void; // New prop for handling note deletion
}

export default function NoteList({
  notes,
  selectedNoteId,
  onSelectNote,
  onDeleteNote,
}: NoteListProps) {
  return (
    <div className="mt-2 space-y-1">
      {notes.map((note) => (
        <div
          key={note.id}
          className={`p-2 flex items-center justify-between rounded-md cursor-pointer transition-colors ${
            note.id === selectedNoteId
              ? "bg-blue-100 dark:bg-blue-900"
              : "hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
          onClick={() => onSelectNote(note.id)}
        >
          {/* Note Content */}
          <div>
            <h3 className="font-medium text-sm truncate dark:text-gray-200">
              {extractTitle(note.content)}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {extractTags(note.content).join(", ")}
            </p>
          </div>

          {/* Trash Button */}
          <Button
            variant={"ghost"}
            className="ml-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400"
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering the note selection
              onDeleteNote(note.id); // Trigger the delete handler
            }}
            aria-label="Delete Note"
            title="Delete note"
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        </div>
      ))}
    </div>
  );
}
