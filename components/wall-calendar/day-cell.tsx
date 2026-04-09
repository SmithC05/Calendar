"use client";

import { motion } from "framer-motion";

import type { CalendarMarker } from "@/lib/calendar";
import { format } from "date-fns";

type DayCellProps = {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isStart: boolean;
  isEnd: boolean;
  isInRange: boolean;
  marker: CalendarMarker | null;
  showRangeFill: boolean;
  onClick: () => void;
};

export function DayCell({
  date,
  isCurrentMonth,
  isToday,
  isStart,
  isEnd,
  isInRange,
  marker,
  showRangeFill,
  onClick
}: DayCellProps) {
  const isSingleDay = isStart && isEnd;
  const isEndpoint = isStart || isEnd;
  const isSelected = isSingleDay || isEndpoint || isInRange;
  const markerLabel = marker ? `. ${marker.label}` : "";
  const shouldRenderRangeFill = showRangeFill && !isSingleDay && (isEndpoint || isInRange);

  return (
    <motion.button
      type="button"
      aria-label={`${format(date, "MMMM d, yyyy")}${markerLabel}`}
      aria-pressed={isSelected}
      onClick={onClick}
      whileHover={isCurrentMonth ? { y: -2 } : { y: -1 }}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      className={[
        "group relative flex aspect-square min-h-[4.2rem] w-full touch-manipulation items-start justify-start overflow-visible rounded-[1.2rem] border p-2.5 text-left sm:min-h-[5.2rem] sm:rounded-[1.35rem] sm:p-3 lg:min-h-[5.55rem]",
        isCurrentMonth
          ? "calendar-cell-shadow border-ink/8 bg-panel/84 text-ink hover:border-ink/14 hover:bg-panel"
          : "border-transparent bg-panel/40 text-ink/34 hover:bg-panel/55"
      ].join(" ")}
    >
      {shouldRenderRangeFill ? (
        <span
          aria-hidden="true"
          className={[
            "pointer-events-none absolute top-1/2 h-9 -translate-y-1/2 rounded-full bg-range/95 sm:h-10",
            isInRange ? "-left-1.5 -right-1.5" : "",
            isStart ? "left-1/2 -right-1.5" : "",
            isEnd ? "-left-1.5 right-1/2" : ""
          ].join(" ")}
        />
      ) : null}

      <span
        className={[
          "relative z-10 inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition sm:h-10 sm:w-10 sm:text-base",
          isSingleDay || isEndpoint
            ? "bg-rust text-white ring-4 ring-paper/65 dark:ring-panel/80 shadow-glow"
            : isToday
              ? "border border-pine/45 bg-panel/75 text-ink"
              : "bg-transparent text-current group-hover:bg-ink/5"
        ].join(" ")}
      >
        {date.getDate()}
      </span>

      {marker && isCurrentMonth ? (
        <span
          title={marker.label}
          className="absolute right-2.5 top-2.5 z-10 inline-flex h-2.5 w-2.5 items-center justify-center"
        >
          <span
            className={[
              "h-2 w-2 rounded-full ring-2 ring-paper/80 dark:ring-panel/80",
              marker.tone === "holiday" ? "bg-rust" : "bg-pine"
            ].join(" ")}
          />
        </span>
      ) : null}

      {isToday && isEndpoint ? (
        <span className="absolute left-9 top-2.5 z-10 h-2 w-2 rounded-full bg-pine ring-2 ring-paper/80 dark:ring-panel/80 sm:left-10" />
      ) : null}

      <span
        className={[
          "relative z-10 mt-auto hidden text-[0.65rem] uppercase tracking-[0.23em] transition sm:block sm:text-[0.7rem]",
          isCurrentMonth ? "text-current opacity-60" : "text-current opacity-45"
        ].join(" ")}
      >
        {isToday ? "Today" : date.getDay() === 0 ? "Reset" : date.getDay() === 6 ? "Ease" : "Plan"}
      </span>
    </motion.button>
  );
}
