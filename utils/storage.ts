"use client";

import { Note, NoteBuild } from "../types/Note";
import LZString from "lz-string";

// export function saveNotesToHistoryB64(
//   notes: Note[],
//   isDarkMode: boolean
// ): void {
//   const encodedData = btoa(JSON.stringify({ notes, isDarkMode }));
//   const newUrl = `${window.location.pathname}#data=${encodedData}`;
//   window.history.pushState({ data: encodedData }, "", newUrl);
// }

// export function getNotesFromHistoryB64(): {
//   notes: Note[];
//   isDarkMode?: boolean;
// } {
//   const hash = window.location.hash;
//   if (hash.startsWith("#data=")) {
//     const encodedData = hash.slice(6);
//     try {
//       const decodedData = atob(encodedData);
//       const parsedData = JSON.parse(decodedData || "{}");
//       return {
//         notes: parsedData.n || [],
//         isDarkMode: parsedData.d,
//       };
//     } catch (error) {
//       console.error("Error parsing data from URL:", error);
//     }
//   }
//   return { notes: [] };
// }

export function saveNotesToHistory(notes: Note[], isDarkMode: boolean): void {
  // return saveNotesToHistoryB64(notes, isDarkMode);
  const compressedData = LZString.compressToEncodedURIComponent(
    JSON.stringify({ n: notes, d: isDarkMode })
  );
  const newUrl = `${window.location.pathname}#data=${compressedData}`;
  window.history.pushState({ data: compressedData }, "", newUrl);
}

export function getNotesFromHistory(): { notes: Note[]; isDarkMode?: boolean } {
  const hash = window.location.hash;
  if (hash.startsWith("#data=")) {
    const compressedData = hash.slice(6);
    try {
      const decompressedData =
        LZString.decompressFromEncodedURIComponent(compressedData);
      const parsedData = JSON.parse(decompressedData || "{}");
      return {
        notes: parsedData.n || [],
        isDarkMode: parsedData.d,
      };
    } catch (error) {
      console.error("Error decompressing data from URL:", error);
    }
  }
  return { notes: [] };
}

export function exportNotes(notes: Note[]): void {
  const dataStr = JSON.stringify(NoteBuild(notes));
  const dataUri =
    "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
  const exportFileDefaultName = "notes.json";

  const linkElement = document.createElement("a");
  linkElement.setAttribute("href", dataUri);
  linkElement.setAttribute("download", exportFileDefaultName);
  linkElement.click();
}

export function getPreferredColorScheme(): "light" | "dark" {
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }
  return "light";
}
