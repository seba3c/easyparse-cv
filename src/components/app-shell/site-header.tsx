import { ThemeToggle } from "./theme-toggle";
import { Wordmark } from "./wordmark";

export function SiteHeader() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-4">
        <Wordmark className="h-3 w-auto" />
        <ThemeToggle />
      </div>
    </header>
  );
}
