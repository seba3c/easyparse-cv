export function DisclaimerBanner() {
  return (
    <div className="w-full border-b border-border bg-accent px-6 py-2 text-center text-xs tracking-wide text-accent-foreground uppercase">
      <span className="mr-2 inline-block size-1.5 bg-primary align-middle" aria-hidden />
      Not a production tool - built for experimentation and learning
    </div>
  );
}
