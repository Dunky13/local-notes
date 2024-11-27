"use client";

import React, { useState } from "react";
import { Download, Share2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { exportNotes } from "../utils/storage";
import { Note } from "../types/Note";

interface ShareButtonProps {
  url: string;
  notes: Note[];
}

export default function ShareButton({ url, notes }: ShareButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="w-10 h-10 p-0 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          title="Share"
        >
          <Share2 className="h-4 w-4 text-gray-700 dark:text-gray-200" />
          <span className="sr-only">Share</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 animate-in fade-in-50 zoom-in-95">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Share this note</h4>
            <p className="text-sm text-muted-foreground">
              Anyone with this link can view this note.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="flex items-center space-x-2">
              <input
                id="share-link"
                value={url}
                className="flex-1 px-3 py-2 text-sm border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                readOnly
              />
              <Button onClick={handleCopy}>
                {isCopied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </div>
          <div className="flex justify-center">
            {url.length > 3000 ? (
              <Button
                variant="outline"
                size="icon"
                className="w-10 h-10 p-0 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                onClick={() => exportNotes(notes)}
              >
                <Download className="h-4 w-4 text-gray-700 dark:text-gray-200" />
                <span className="sr-only">Export notes</span>
              </Button>
            ) : (
              <QRCodeSVG
                value={url}
                size={256}
                level={"L"}
                style={{ padding: "2px", backgroundColor: "white" }}
              />
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
