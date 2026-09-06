"use client";

import { useRef, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { MAX_FILE_SIZE_BYTES } from "@/lib/cv-upload-constraints";

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

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const file = inputRef.current?.files?.[0];

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

    onSubmit(file);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        disabled={isLoading}
        className="block w-full text-sm text-foreground file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-2 file:text-sm file:font-medium file:text-secondary-foreground"
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Parsing..." : "Parse CV"}
      </Button>
    </form>
  );
}
