import { TriangleAlert } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

const WARNING_TEXT_CLASS = "text-[#e8d17a]";

export function WarningAlert({ message, className }: { message: string; className?: string }) {
  return (
    <Alert className={cn(WARNING_TEXT_CLASS, className)}>
      <TriangleAlert className="size-4 shrink-0" />
      <AlertDescription className={WARNING_TEXT_CLASS}>{message}</AlertDescription>
    </Alert>
  );
}
