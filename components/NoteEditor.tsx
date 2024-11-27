"use client";

import { useState, useEffect } from "react";
import MDEditor from "@uiw/react-md-editor";
import { Note } from "../types/Note";

interface NoteEditorProps {
  note: Note;
  onUpdateNote: (note: Note) => void;
  isDarkMode: boolean;
}

export default function NoteEditor({
  note,
  onUpdateNote,
  isDarkMode,
}: NoteEditorProps) {
  const [content, setContent] = useState(note?.content);

  useEffect(() => {
    setContent(note?.content);
  }, [note, note?.content]);

  const handleContentChange = (value: string | undefined) => {
    if (value !== undefined) {
      setContent(value);
      onUpdateNote({
        ...note,
        updatedAt: Date.now(),
        content: value,
      });
    }
  };

  return (
    <div
      className="h-full flex flex-col"
      data-color-mode={isDarkMode ? "dark" : "light"}
    >
      <MDEditor
        value={content}
        onChange={handleContentChange}
        className="flex-grow"
        preview="edit"
      />
    </div>
  );
}
