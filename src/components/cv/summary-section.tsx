import { SectionCard } from "./section-card";

export function SummarySection({
  summary,
  open,
  onOpenChange,
}: {
  summary: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <SectionCard
      title="Summary"
      accentClassName="bg-teal-500"
      isEmpty={!summary}
      emptyMessage="No summary was found."
      open={open}
      onOpenChange={onOpenChange}
    >
      <p className="text-sm whitespace-pre-wrap">{summary}</p>
    </SectionCard>
  );
}
