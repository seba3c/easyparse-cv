"use client";

import { useState, type ReactNode } from "react";
import { Collapsible } from "@base-ui/react/collapsible";
import { ChevronDown } from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function SectionCard({
  title,
  accentClassName,
  isEmpty,
  emptyMessage,
  children,
}: {
  title: string;
  accentClassName: string;
  isEmpty: boolean;
  emptyMessage: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(true);

  return (
    <Card className={cn("border-l-4", accentClassName)}>
      <Collapsible.Root open={open} onOpenChange={setOpen}>
        <Collapsible.Trigger
          className={cn(
            "group flex w-full items-center justify-between gap-2 rounded-t-xl px-(--card-spacing) py-(--card-spacing) text-left transition-colors",
            "hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
          )}
        >
          <CardTitle>{title}</CardTitle>
          <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[panel-open]:rotate-180" />
        </Collapsible.Trigger>
        <Collapsible.Panel className="h-[var(--collapsible-panel-height)] overflow-hidden transition-[height] duration-200 ease-out data-[ending-style]:h-0 data-[starting-style]:h-0">
          <CardContent>
            {isEmpty ? <p className="text-sm text-muted-foreground">{emptyMessage}</p> : children}
          </CardContent>
        </Collapsible.Panel>
      </Collapsible.Root>
    </Card>
  );
}
