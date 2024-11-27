"use client";
export const dynamic = "error";
import { useState, useEffect } from "react";
import { Plus, Download, Upload, Sun, Moon } from "lucide-react";
import NoteList from "../components/NoteList";
import NoteEditor from "../components/NoteEditor";
import TagList from "../components/TagList";
import ShareButton from "../components/ShareButton";
import { Button } from "../components/ui/button";
import { Note, NoteBuild } from "../types/Note";
import {
  saveNotesToHistory,
  getNotesFromHistory,
  exportNotes,
  getPreferredColorScheme,
} from "../utils/storage";
import { extractTags } from "../utils/noteUtils";

export default function NoteTakingApp() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const { notes: storedNotes, isDarkMode: storedDarkMode } =
      getNotesFromHistory();
    setNotes(storedNotes);

    if (storedDarkMode !== undefined) {
      setIsDarkMode(storedDarkMode);
    } else {
      const systemPreference = getPreferredColorScheme();
      setIsDarkMode(systemPreference === "dark");
    }
  }, []);

  useEffect(() => {
    saveNotesToHistory(notes, isDarkMode);
  }, [notes, isDarkMode]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const addNote = () => {
    const newNote: Note = {
      id: Date.now(),
      updatedAt: Date.now(),
      content: "# New Note\n#tag1 #tag2\nStart writing your note here...",
    };
    setNotes([newNote, ...notes]);
    setSelectedNoteId(newNote.id);
  };

  const updateNote = (updatedNote: Note) => {
    const updatedNotes = notes.map((note) =>
      note.id === updatedNote.id ? updatedNote : note
    );
    setNotes(updatedNotes);
  };

  const deleteNote = (id: number) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
    setSelectedNoteId(null);
  };

  const handleExport = () => {
    exportNotes(notes);
  };

  const handleImport = async () => {
    try {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".json";
      input.onchange = async (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
          const text = await file.text();
          const importedNotes = NoteBuild(JSON.parse(text));

          const newNotes = [...notes];
          for (const importedNote of importedNotes) {
            // Skip any import whose date is in the future
            if (importedNote.updatedAt > Date.now()) continue;
            const existingNote = newNotes.find(
              (note) => +note.id === +importedNote.id
            );
            if (existingNote) {
              if (existingNote.updatedAt < importedNote.updatedAt) {
                existingNote.updatedAt = importedNote.updatedAt;
                existingNote.content = importedNote.content;
              }
            } else {
              newNotes.push(importedNote);
            }
          }
          setNotes(newNotes);
        }
      };
      input.click();
      // }
    } catch (error) {
      console.error("Error importing notes:", error);
      alert("Error importing notes. Please check the file format.");
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag)
        : [...prevTags, tag]
    );
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const filteredNotes =
    selectedTags.length > 0
      ? notes.filter((note) =>
          selectedTags.every((tag) => extractTags(note.content).includes(tag))
        )
      : notes;

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="flex h-screen">
      <div className="w-64 p-3 bg-white dark:bg-gray-800 border-r dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold dark:text-white">Notes</h1>
          <div className="flex space-x-2">
            <ShareButton url={shareUrl} notes={notes} />
            <Button
              variant="outline"
              size="icon"
              className="w-10 h-10 p-0 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              onClick={toggleDarkMode}
              title={`Toggle ${isDarkMode ? "light" : "dark"} mode`}
            >
              {isDarkMode ? (
                <Sun className="h-4 w-4 text-gray-700 dark:text-gray-200" />
              ) : (
                <Moon className="h-4 w-4 text-gray-700 dark:text-gray-200" />
              )}
              <span className="sr-only">Toggle dark mode</span>
            </Button>
          </div>
        </div>
        <div className="flex justify-between mb-4">
          <Button
            variant="outline"
            size="icon"
            className="w-10 h-10 p-0 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            onClick={addNote}
            title="Add note"
          >
            <Plus className="h-4 w-4 text-gray-700 dark:text-gray-200" />
            <span className="sr-only">Add note</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="w-10 h-10 p-0 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            onClick={handleExport}
            title="Export notes"
          >
            <Download className="h-4 w-4 text-gray-700 dark:text-gray-200" />
            <span className="sr-only">Export notes</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="w-10 h-10 p-0 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            onClick={handleImport}
            title="Import notes"
          >
            <Upload className="h-4 w-4 text-gray-700 dark:text-gray-200" />
            <span className="sr-only">Import notes</span>
          </Button>
        </div>
        <TagList
          notes={notes}
          selectedTags={selectedTags}
          onToggleTag={toggleTag}
        />
        <NoteList
          notes={filteredNotes}
          selectedNoteId={selectedNoteId}
          onSelectNote={setSelectedNoteId}
          onDeleteNote={deleteNote}
        />
      </div>
      <div className="flex-1 p-4 bg-gray-100 dark:bg-gray-900">
        {selectedNoteId && (
          <NoteEditor
            note={notes.find((note) => note.id === selectedNoteId)!}
            onUpdateNote={updateNote}
            isDarkMode={isDarkMode}
          />
        )}
      </div>
    </div>
  );
}
