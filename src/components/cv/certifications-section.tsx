import type { CertificationEntry } from "@/domain/value-objects/certification-entry";
import { SectionCard } from "./section-card";

function CertificationEntryView({ entry }: { entry: CertificationEntry }) {
  if (!entry.name) {
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
        <p className="font-medium">{entry.name}</p>
        {entry.date && <p className="text-xs whitespace-nowrap text-muted-foreground">{entry.date}</p>}
      </div>
      {entry.issuer && <p className="mt-1 text-sm text-muted-foreground">{entry.issuer}</p>}
    </div>
  );
}

export function CertificationsSection({ entries }: { entries: readonly CertificationEntry[] }) {
  return (
    <SectionCard
      title="Certifications"
      accentClassName="border-l-amber-500"
      isEmpty={entries.length === 0}
      emptyMessage="No certifications were found."
    >
      <div className="space-y-3">
        {entries.map((entry, index) => (
          <CertificationEntryView key={index} entry={entry} />
        ))}
      </div>
    </SectionCard>
  );
}
