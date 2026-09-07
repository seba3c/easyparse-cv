"use client";

import { useRef, useState, type ChangeEvent, type DragEvent, type KeyboardEvent } from "react";
import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MAX_FILE_SIZE_BYTES } from "@/lib/cv-upload-constraints";
import { cn } from "@/lib/utils";

export function CvUploadForm({
  isLoading,
  onSubmit,
  onValidationError,
}: {
  isLoading: boolean;
  onSubmit: (file: File) => void;
  onValidationError: (message: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  function handleFile(file: File | undefined) {
    if (!file) {
      onValidationError("Please choose a PDF file first.");
      return;
    }
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      onValidationError("Only PDF files are supported.");
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      onValidationError(
        `File exceeds the maximum allowed size of ${MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB.`,
      );
      return;
    }

    setSelectedFile(file);
  }

  function openFilePicker() {
    if (!isLoading) inputRef.current?.click();
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    handleFile(event.target.files?.[0]);
    event.target.value = "";
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openFilePicker();
    }
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    if (!isLoading) setIsDragActive(true);
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragActive(false);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragActive(false);
    if (isLoading) return;
    handleFile(event.dataTransfer.files?.[0]);
  }

  function handleParseClick() {
    if (selectedFile) onSubmit(selectedFile);
  }

  function handleClearClick() {
    setSelectedFile(null);
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        role="button"
        tabIndex={isLoading ? -1 : 0}
        aria-disabled={isLoading}
        aria-label="Drag and drop a PDF here, or press Enter to browse for a file"
        onClick={openFilePicker}
        onKeyDown={handleKeyDown}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed border-border bg-muted/30 px-6 py-10 text-center transition-colors",
          "hover:border-primary/50 hover:bg-muted/50",
          "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
          isDragActive && "border-primary bg-primary/5",
          isLoading && "pointer-events-none opacity-60",
        )}
      >
        <UploadCloud className="size-8 text-muted-foreground" />
        <p className="text-sm font-medium">
          {selectedFile?.name ?? "Drag & drop your CV here, or click to browse"}
        </p>
        <p className="text-xs tracking-wide text-muted-foreground uppercase">
          PDF only, up to {MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          disabled={isLoading}
          onChange={handleInputChange}
          className="sr-only"
          tabIndex={-1}
        />
      </div>
      <div className="flex items-center justify-between gap-4">
        <p className="min-w-0 flex-1 text-xs text-muted-foreground">
          Your CV is processed in memory for this request only and is never stored, logged, or
          shared with any third party.
        </p>
        {isLoading ? (
          <p
            role="status"
            aria-live="polite"
            className="animate-pulse shrink-0 text-sm font-medium text-muted-foreground"
          >
            Parsing file...
          </p>
        ) : (
          <div className="flex shrink-0 items-center gap-2">
            {selectedFile && (
              <Button type="button" variant="link" onClick={handleClearClick} className="text-xs">
                Clear
              </Button>
            )}
            <Button type="button" onClick={handleParseClick} disabled={!selectedFile}>
              Parse CV
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
