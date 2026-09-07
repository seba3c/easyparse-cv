import { ArrowUpRight } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { Wordmark } from "./wordmark";

export function SiteHeader() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-4">
        <Wordmark className="h-3 w-auto" />
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/seba3c/easyparse-cv"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-0.5 text-xs tracking-wide text-muted-foreground uppercase transition-colors hover:text-foreground"
          >
            GitHub
            <ArrowUpRight className="size-3" />
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
