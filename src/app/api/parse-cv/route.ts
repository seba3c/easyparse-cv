import { NextResponse } from "next/server";
import { ParseCvUseCase } from "@/application/use-cases/parse-cv-use-case";
import { PdfjsTextExtractorAdapter } from "@/infrastructure/pdf/pdfjs-text-extractor-adapter";
import { NodeCryptoHasherAdapter } from "@/infrastructure/hashing/node-crypto-hasher-adapter";
import { NoTextLayerError } from "@/domain/ports/text-extractor-port";
import type { ParsedCvResult } from "@/domain/value-objects/parsed-cv-result";
import { MAX_FILE_SIZE_BYTES } from "@/lib/cv-upload-constraints";

export const runtime = "nodejs";
export const maxDuration = 30;

const PDF_MAGIC_BYTES = Buffer.from("%PDF-", "ascii");

export type ParseCvErrorCode =
  | "missing_file"
  | "invalid_file_type"
  | "file_too_large"
  | "no_text_layer"
  | "processing_failed";

export interface ParseCvErrorResponse {
  readonly error: ParseCvErrorCode;
  readonly message: string;
}

export type ParseCvResponse = ParsedCvResult;

function errorResponse(status: number, error: ParseCvErrorCode, message: string): NextResponse {
  return NextResponse.json<ParseCvErrorResponse>({ error, message }, { status });
}

function isPdfMagicBytes(bytes: Buffer): boolean {
  return bytes.subarray(0, PDF_MAGIC_BYTES.length).equals(PDF_MAGIC_BYTES);
}

export async function POST(request: Request): Promise<Response> {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return errorResponse(400, "missing_file", 'Expected multipart/form-data with a "file" field');
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return errorResponse(400, "missing_file", 'No file was provided under the "file" field');
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return errorResponse(
      400,
      "file_too_large",
      `File exceeds the maximum allowed size of ${MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB`,
    );
  }

  const fileBytes = Buffer.from(await file.arrayBuffer());

  const looksLikePdfByName =
    file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  if (!looksLikePdfByName || !isPdfMagicBytes(fileBytes)) {
    return errorResponse(400, "invalid_file_type", "Only PDF files are supported");
  }

  const useCase = new ParseCvUseCase(
    new PdfjsTextExtractorAdapter(),
    new NodeCryptoHasherAdapter(),
  );

  try {
    const result = await useCase.execute({ fileBytes, fileName: file.name });
    return NextResponse.json<ParseCvResponse>(result);
  } catch (error) {
    if (error instanceof NoTextLayerError) {
      return errorResponse(
        422,
        "no_text_layer",
        "No extractable text layer was found in this PDF. Scanned/image-only PDFs are not supported.",
      );
    }
    console.error("Failed to parse CV:", error);
    return errorResponse(500, "processing_failed", "Failed to process the uploaded file");
  }
}
