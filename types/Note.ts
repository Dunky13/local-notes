"use client";

export interface Note {
  id: number;
  updatedAt: number;
  content: string;
}

export function NoteBuild(
  jsonNotes: Array<Record<keyof Note, string | number>>
): Note[] {
  const parsed: Note[] = [];

  for (const item of jsonNotes) {
    parsed.push({
      id: +item.id,
      updatedAt: +item.updatedAt || Date.now(),
      content: item.content + "",
    });
  }

  return parsed;
}
