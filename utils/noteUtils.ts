"use client";

export function extractTags(content: string): string[] {
  const lines = content.split("\n");
  if (lines.length > 1) {
    const tagLine = lines[1].trim();
    if (tagLine.startsWith("#")) {
      return tagLine
        .split(" ")
        .filter((tag) => tag.startsWith("#"))
        .map((tag) => tag.slice(1));
    }
  }
  return [];
}

export function extractTitle(content: string): string {
  const lines = content.split("\n");
  if (lines.length > 0) {
    const firstLine = lines[0].trim();
    if (firstLine.startsWith("# ")) {
      return firstLine.slice(2);
    }
  }
  return "Untitled";
}
