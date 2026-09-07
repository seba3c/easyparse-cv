import type { PersonalInfo } from "@/domain/value-objects/personal-info";
import { SectionCard } from "./section-card";

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="break-words">{value}</dd>
    </div>
  );
}

export function PersonalInfoSection({
  personalInfo,
  open,
  onOpenChange,
}: {
  personalInfo: PersonalInfo;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const rows: { label: string; value: string }[] = [
    ...(personalInfo.fullName ? [{ label: "Name", value: personalInfo.fullName }] : []),
    ...(personalInfo.email ? [{ label: "Email", value: personalInfo.email }] : []),
    ...(personalInfo.phone ? [{ label: "Phone", value: personalInfo.phone }] : []),
    ...(personalInfo.location ? [{ label: "Location", value: personalInfo.location }] : []),
    ...(personalInfo.links.linkedin
      ? [{ label: "LinkedIn", value: personalInfo.links.linkedin }]
      : []),
    ...(personalInfo.links.github ? [{ label: "GitHub", value: personalInfo.links.github }] : []),
    ...personalInfo.links.other.map((url) => ({ label: "Link", value: url })),
  ];

  return (
    <SectionCard
      title="Personal Info"
      accentClassName="bg-violet-500"
      isEmpty={rows.length === 0}
      emptyMessage="No personal information was found."
      open={open}
      onOpenChange={onOpenChange}
    >
      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        {rows.map((row, index) => (
          <InfoRow key={`${row.label}-${index}`} label={row.label} value={row.value} />
        ))}
      </dl>
    </SectionCard>
  );
}
