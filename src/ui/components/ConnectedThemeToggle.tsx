import { useTheme } from "@/core/context/ThemeContext";
import { ThemeToggle } from "./ThemeToggle";

/** Wires presentational `ThemeToggle` to app theme context. */
export function ConnectedThemeToggle({ className }: { className?: string }) {
  const { effectiveMode, toggleTheme } = useTheme();
  return <ThemeToggle mode={effectiveMode} onToggle={toggleTheme} className={className} />;
}
