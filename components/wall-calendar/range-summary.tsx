"use client";

import { motion } from "framer-motion";

import { countDays, formatLongDate, formatRangeLabel, sameDay } from "@/lib/calendar";

type RangeSummaryProps = {
  startDate: Date | null;
  endDate: Date | null;
  onJumpToToday: () => void;
  onClearSelection: () => void;
};

export function RangeSummary({
  startDate,
  endDate,
  onJumpToToday,
  onClearSelection
}: RangeSummaryProps) {
  const hasSelection = Boolean(startDate || endDate);
  const isSingleDay = Boolean(startDate && endDate && sameDay(startDate, endDate));
  const totalDays = countDays(startDate, endDate);
  const summaryKey = `${startDate?.toISOString() ?? "none"}-${endDate?.toISOString() ?? "none"}`;

  return (
    <div className="paper-wash rounded-[1.55rem] border border-ink/10 p-4 shadow-inset sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[0.68rem] uppercase tracking-[0.32em] text-ink/45">Selected Range</p>
          <motion.p
            key={summaryKey}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="mt-2 font-serif text-[1.65rem] leading-tight text-ink sm:text-[1.9rem]"
          >
            {!hasSelection
              ? "Choose a date to begin."
              : startDate && (!endDate || isSingleDay)
                ? formatLongDate(startDate)
                : formatRangeLabel(startDate, endDate)}
          </motion.p>
        </div>

        {hasSelection ? (
          <div className="inline-flex h-9 w-fit items-center rounded-full bg-rust/12 px-3 text-xs font-medium uppercase tracking-[0.22em] text-rust">
            {totalDays} {totalDays === 1 ? "Day" : "Days"}
          </div>
        ) : null}
      </div>

      <p className="mt-2 text-sm leading-6 text-ink/62 sm:mt-3">
        {!hasSelection
          ? "Tap a day to begin, then add a second date if you want an elegant connected range."
          : totalDays > 1
            ? "A continuous range stays visually linked across the month, making plans easier to scan."
            : "A single-day selection keeps notes focused and easy to revisit."}
      </p>

      <div className="mt-4 flex flex-wrap gap-2.5">
        <ActionButton label="Jump to today" onClick={onJumpToToday} />
        {hasSelection ? <ActionButton label="Clear selection" onClick={onClearSelection} /> : null}
      </div>
    </div>
  );
}

type ActionButtonProps = {
  label: string;
  onClick: () => void;
};

function ActionButton({ label, onClick }: ActionButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      className="inline-flex h-10 items-center justify-center rounded-full border border-ink/10 bg-panel/82 px-4 text-sm font-medium text-ink transition duration-200 hover:bg-paper"
    >
      {label}
    </motion.button>
  );
}
