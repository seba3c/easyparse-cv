import type { ExperienceEntry } from "@/domain/value-objects/experience-entry";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SectionCard } from "./section-card";

function ExperienceEntryView({ entry }: { entry: ExperienceEntry }) {
  const isUnstructured = !entry.title && !entry.company;

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
          {entry.title ?? "Unknown role"}
          {entry.company && <span className="text-muted-foreground"> at {entry.company}</span>}
        </p>
        {(entry.startDate || entry.endDate) && (
          <p className="text-xs whitespace-nowrap text-muted-foreground">
            {entry.startDate ?? "?"} - {entry.endDate ?? "?"}
          </p>
        )}
      </div>
      {entry.description && (
        <p className="mt-1 text-sm whitespace-pre-wrap text-muted-foreground">
          {entry.description}
        </p>
      )}
    </div>
  );
}

export function ExperienceSection({
  entries,
  warning,
  open,
  onOpenChange,
}: {
  entries: readonly ExperienceEntry[];
  warning?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <SectionCard
      title="Experience"
      accentClassName="bg-blue-500"
      isEmpty={entries.length === 0}
      emptyMessage="No experience entries were found."
      open={open}
      onOpenChange={onOpenChange}
    >
      <div className="space-y-4">
        {warning && (
          <Alert>
            <AlertDescription>{warning}</AlertDescription>
          </Alert>
        )}
        {entries.map((entry, index) => (
          <ExperienceEntryView key={index} entry={entry} />
        ))}
      </div>
    </SectionCard>
  );
}
