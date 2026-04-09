"use client";

import { motion } from "framer-motion";

import {
  getDayNames,
  isRangeEnd,
  isRangeStart,
  isWithinRange,
  toISODate,
  type CalendarDay
} from "@/lib/calendar";

import { DayCell } from "./day-cell";

type CalendarGridProps = {
  days: CalendarDay[];
  startDate: Date | null;
  endDate: Date | null;
  onDateClick: (date: Date) => void;
};

export function CalendarGrid({
  days,
  startDate,
  endDate,
  onDateClick
}: CalendarGridProps) {
  const weekdayLabels = getDayNames(0);
  const monthAnchor = days.find((day) => day.isCurrentMonth)?.date ?? days[0]?.date;
  const gridKey = monthAnchor ? toISODate(monthAnchor) : "calendar-grid";
  const showRangeFill = Boolean(startDate && endDate);

  return (
    <div className="space-y-2.5 sm:space-y-3">
      <div className="grid grid-cols-7 gap-1.5 px-1 sm:gap-2.5 lg:gap-3">
        {weekdayLabels.map((label) => (
          <div
            key={label}
            className="py-2 text-center text-[0.65rem] uppercase tracking-[0.28em] text-ink/42 sm:text-[0.7rem]"
          >
            {label}
          </div>
        ))}
      </div>

      <motion.div
        key={gridKey}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="grid grid-cols-7 gap-1.5 sm:gap-2.5 lg:gap-3"
      >
        {days.map((day) => (
          <DayCell
            key={toISODate(day.date)}
            date={day.date}
            isCurrentMonth={day.isCurrentMonth}
            isEnd={isRangeEnd(day.date, endDate)}
            isInRange={isWithinRange(day.date, startDate, endDate)}
            isStart={isRangeStart(day.date, startDate)}
            isToday={day.isToday}
            marker={day.marker}
            showRangeFill={showRangeFill}
            onClick={() => onDateClick(day.date)}
          />
        ))}
      </motion.div>
    </div>
  );
}
