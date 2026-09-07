export function SiteFooter() {
  return (
    <footer className="mx-auto w-full max-w-3xl border-t border-border px-6 py-6 text-center text-xs text-muted-foreground">
      ©{" "}
      <a
        href="https://sebastiancastaneda.dev"
        target="_blank"
        rel="noopener noreferrer"
        className="underline-offset-4 hover:underline"
      >
        Sebastián Castañeda
      </a>{" "}
      2026 - Built with{" "}
      <a
        href="https://claude.com/claude-code"
        target="_blank"
        rel="noopener noreferrer"
        className="underline-offset-4 hover:underline"
      >
        Claude
      </a>
      ,{" "}
      <a
        href="https://openspec.dev"
        target="_blank"
        rel="noopener noreferrer"
        className="underline-offset-4 hover:underline"
      >
        OpenSpec
      </a>{" "}
      and ❤️
    </footer>
  );
}
