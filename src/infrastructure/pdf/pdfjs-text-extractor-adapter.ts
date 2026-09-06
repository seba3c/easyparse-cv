import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import {
  NoTextLayerError,
  type ExtractedText,
  type TextExtractorPort,
} from "../../domain/ports/text-extractor-port";

interface PositionedTextItem {
  readonly str: string;
  readonly y: number;
}

const SAME_LINE_Y_TOLERANCE = 2;

function groupItemsIntoLines(items: readonly PositionedTextItem[]): string[] {
  const lines: string[] = [];
  let currentY: number | null = null;
  let currentParts: string[] = [];

  const flush = () => {
    if (currentParts.length > 0) {
      const line = currentParts.join(" ").trim();
      if (line) lines.push(line);
    }
  };

  for (const item of items) {
    if (!item.str.trim()) continue;
    if (currentY === null || Math.abs(item.y - currentY) > SAME_LINE_Y_TOLERANCE) {
      flush();
      currentParts = [item.str];
      currentY = item.y;
    } else {
      currentParts.push(item.str);
    }
  }
  flush();

  return lines;
}

/**
 * Extracts text from a PDF's embedded text layer using pdfjs-dist,
 * reconstructing lines from each text item's y-position (pdfjs otherwise
 * returns a flat list of positioned fragments, not lines - see design.md -
 * Decisions). Throws NoTextLayerError when the PDF has no extractable
 * text (e.g. a scanned/image-only PDF).
 */
export class PdfjsTextExtractorAdapter implements TextExtractorPort {
  async extract(fileBytes: Buffer): Promise<ExtractedText> {
    const doc = await getDocument({
      data: new Uint8Array(fileBytes),
      useWorkerFetch: false,
    }).promise;

    const lines: string[] = [];
    for (let pageNumber = 1; pageNumber <= doc.numPages; pageNumber++) {
      const page = await doc.getPage(pageNumber);
      // getTextContent() defaults to includeMarkedContent: false, so every
      // item here is a TextItem (str + transform), never a TextMarkedContent.
      const content = (await page.getTextContent()) as unknown as {
        items: readonly { str: string; transform: number[] }[];
      };
      const items: PositionedTextItem[] = content.items.map((item) => ({
        str: item.str,
        y: item.transform[5],
      }));
      lines.push(...groupItemsIntoLines(items));
    }

    if (lines.length === 0) {
      throw new NoTextLayerError();
    }

    return { lines };
  }
}
