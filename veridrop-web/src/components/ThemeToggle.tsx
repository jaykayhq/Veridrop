"use client";

import { useTheme } from "@/lib/theme/ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      className={`relative h-9 w-9 shrink-0 rounded-lg border transition-all duration-300 ${
        isDark
          ? "border-default bg-surface text-text-primary hover:border-hover"
          : "border-[#e2e8f0] bg-[#f8f9fa] text-text-primary hover:border-[#cbd5e1]"
      }`}
    >
      <span
        className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
          isDark ? "scale-100 rotate-0 opacity-100" : "scale-50 rotate-90 opacity-0"
        }`}
      >
        ☾
      </span>
      <span
        className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
          isDark ? "scale-50 -rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
        }`}
      >
        ☀
      </span>
    </button>
  );
}
