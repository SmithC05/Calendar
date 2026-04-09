"use client";

import { motion } from "framer-motion";

import type { ThemeMode } from "@/hooks/use-theme-preference";

type ThemeToggleProps = {
  theme: ThemeMode;
  onChange: (theme: ThemeMode) => void;
};

const OPTIONS: Array<{ label: string; value: ThemeMode }> = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" }
];

export function ThemeToggle({ theme, onChange }: ThemeToggleProps) {
  return (
    <div className="inline-flex items-center rounded-full border border-ink/10 bg-panel/75 p-1 shadow-inset backdrop-blur">
      {OPTIONS.map((option) => {
        const isActive = theme === option.value;

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(option.value)}
            className="relative isolate inline-flex h-9 items-center justify-center overflow-hidden rounded-full px-3.5 text-xs font-medium tracking-[0.18em] text-ink/70 transition duration-200 hover:text-ink sm:px-4"
          >
            {isActive ? (
              <motion.span
                layoutId="theme-pill"
                transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 rounded-full bg-ink/8 dark:bg-paper/10"
              />
            ) : null}
            <span className="relative z-10 uppercase">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
