import { SectionCard } from "./section-card";

export function SkillsSection({ skills }: { skills: readonly string[] }) {
  return (
    <SectionCard
      title="Skills"
      accentClassName="border-l-pink-500"
      isEmpty={skills.length === 0}
      emptyMessage="No skills were found."
    >
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className="rounded-full bg-pink-100 px-3 py-1 text-xs font-medium text-pink-800 dark:bg-pink-950 dark:text-pink-200"
          >
            {skill}
          </span>
        ))}
      </div>
    </SectionCard>
  );
}
