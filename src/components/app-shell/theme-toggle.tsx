"use client";

import { useSyncExternalStore } from "react";
import { Switch } from "@base-ui/react/switch";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";
import { cn } from "@/lib/utils";

function subscribeNever() {
  return () => {};
}

/** True once mounted on the client - lets us defer theme-dependent rendering past hydration. */
function useIsMounted() {
  return useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false,
  );
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useIsMounted();

  const isDark = mounted && theme === "dark";

  return (
    <Switch.Root
      checked={isDark}
      onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "relative inline-flex h-6 w-9 shrink-0 cursor-pointer items-center rounded-full border border-border bg-muted transition-colors",
        "data-[checked]:bg-primary",
        "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
      )}
    >
      <Switch.Thumb
        className={cn(
          "flex size-5 translate-x-0.5 items-center justify-center rounded-full bg-background text-foreground shadow-sm transition-transform",
          "data-[checked]:translate-x-3.5 data-[checked]:bg-primary-foreground data-[checked]:text-primary",
        )}
      >
        {isDark ? <Moon className="size-3" /> : <Sun className="size-3" />}
      </Switch.Thumb>
    </Switch.Root>
  );
}
