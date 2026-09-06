import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { ParseCvErrorCode } from "@/app/api/parse-cv/route";

export type CvErrorCode = ParseCvErrorCode | "client_validation";

const ERROR_TITLES: Record<CvErrorCode, string> = {
  missing_file: "No file provided",
  invalid_file_type: "Unsupported file type",
  file_too_large: "File too large",
  no_text_layer: "Scanned PDFs aren't supported",
  processing_failed: "Something went wrong",
  client_validation: "Check your file",
};

export function ErrorBanner({ code, message }: { code: CvErrorCode; message: string }) {
  return (
    <Alert variant="destructive">
      <AlertTitle>{ERROR_TITLES[code]}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
