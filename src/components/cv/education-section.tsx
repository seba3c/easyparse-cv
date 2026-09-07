import type { EducationEntry } from "@/domain/value-objects/education-entry";
import { SectionCard } from "./section-card";
import { WarningAlert } from "./warning-alert";

function EducationEntryView({ entry }: { entry: EducationEntry }) {
  const isUnstructured = !entry.degree && !entry.institution;

  if (isUnstructured) {
    return (
      <div className="rounded-md border border-dashed p-3 text-sm">
        <p className="mb-1 text-xs font-medium text-muted-foreground">
          Could not identify structured fields for this entry - showing the original text
        </p>
        <pre className="whitespace-pre-wrap font-sans">{entry.raw}</pre>
      </div>
    );
  }

  return (
    <div className="border-b pb-3 last:border-none last:pb-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <p className="font-medium">
          {entry.degree ?? "Unknown degree"}
          {entry.institution && (
            <span className="text-muted-foreground"> - {entry.institution}</span>
          )}
        </p>
        {(entry.startDate || entry.endDate) && (
          <p className="text-xs whitespace-nowrap text-muted-foreground">
            {entry.startDate ?? "?"} - {entry.endDate ?? "?"}
          </p>
        )}
      </div>
      {entry.fieldOfStudy && (
        <p className="mt-1 text-sm text-muted-foreground">{entry.fieldOfStudy}</p>
      )}
    </div>
  );
}

export function EducationSection({
  entries,
  warning,
  open,
  onOpenChange,
}: {
  entries: readonly EducationEntry[];
  warning?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <SectionCard
      title="Education"
      accentClassName="bg-emerald-500"
      isEmpty={entries.length === 0}
      emptyMessage="No education entries were found."
      open={open}
      onOpenChange={onOpenChange}
    >
      <div className="space-y-4">
        {warning && <WarningAlert message={warning} />}
        {entries.map((entry, index) => (
          <EducationEntryView key={index} entry={entry} />
        ))}
      </div>
    </SectionCard>
  );
}
