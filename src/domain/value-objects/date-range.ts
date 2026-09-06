export interface DateRange {
  readonly startDate: string | null;
  readonly endDate: string | null;
  readonly raw: string;
}

export function createDateRange(params: {
  startDate?: string | null;
  endDate?: string | null;
  raw: string;
}): DateRange {
  if (!params.raw.trim()) {
    throw new Error("DateRange requires non-empty raw text");
  }
  return {
    startDate: params.startDate ?? null,
    endDate: params.endDate ?? null,
    raw: params.raw,
  };
}
