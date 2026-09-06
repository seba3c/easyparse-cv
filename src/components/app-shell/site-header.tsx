import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-4">
        <span className="text-sm font-bold tracking-widest uppercase">
          easyparse<span className="text-primary">.cv</span>
        </span>
        <ThemeToggle />
      </div>
    </header>
  );
}
