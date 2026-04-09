"use client";

import type { ReactNode } from "react";

import { motion } from "framer-motion";

import type { ThemeMode } from "@/hooks/use-theme-preference";
import { formatMonthYear } from "@/lib/calendar";

import { ThemeToggle } from "./theme-toggle";

type MonthHeaderProps = {
  currentMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
};

export function MonthHeader({
  currentMonth,
  onPrevMonth,
  onNextMonth,
  theme,
  onThemeChange
}: MonthHeaderProps) {
  const monthKey = `${currentMonth.getFullYear()}-${currentMonth.getMonth()}`;

  return (
    <div className="paper-wash rounded-[1.65rem] border border-ink/10 px-4 py-4 shadow-inset backdrop-blur sm:px-5 sm:py-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[0.68rem] uppercase tracking-[0.32em] text-ink/45">WallStory Edition</p>
          <motion.h2
            key={monthKey}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="mt-2 font-serif text-[1.95rem] leading-none text-ink sm:text-[2.2rem]"
          >
            {formatMonthYear(currentMonth)}
          </motion.h2>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:justify-end">
          <ThemeToggle onChange={onThemeChange} theme={theme} />
          <NavigationButton label="Previous month" onClick={onPrevMonth}>
            &#8592;
          </NavigationButton>
          <NavigationButton label="Next month" onClick={onNextMonth}>
            &#8594;
          </NavigationButton>
        </div>
      </div>
    </div>
  );
}

type NavigationButtonProps = {
  children: ReactNode;
  label: string;
  onClick: () => void;
};

function NavigationButton({ children, label, onClick }: NavigationButtonProps) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ink/10 bg-panel/85 text-lg text-ink shadow-[0_8px_18px_rgb(var(--shadow)_/_0.08)] transition duration-200 hover:bg-panel"
    >
      <span aria-hidden="true">{children}</span>
    </motion.button>
  );
}
