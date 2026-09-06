export interface ExtractedText {
  readonly lines: readonly string[];
}

export class NoTextLayerError extends Error {
  constructor() {
    super("No extractable text layer found in the PDF");
    this.name = "NoTextLayerError";
  }
}

export interface TextExtractorPort {
  extract(fileBytes: Buffer): Promise<ExtractedText>;
}
