import { addDays, isSameMonth, startOfMonth, startOfWeek } from "date-fns";

import { isSameCalendarDay, normalizeDate } from "./date-utils";
import { getCalendarMarker } from "./events";
import type { CalendarDay, CalendarGrid, GenerateMonthGridOptions } from "./types";

const GRID_SIZE = 42;
const DAYS_IN_WEEK = 7;
const DEFAULT_WEEK_STARTS_ON = 0;

export function generateMonthGrid(
  monthDate: Date,
  options: GenerateMonthGridOptions = {}
): CalendarGrid {
  const monthStart = startOfMonth(normalizeDate(monthDate));
  const today = options.today ? normalizeDate(options.today) : normalizeDate(new Date());
  const weekStartsOn = options.weekStartsOn ?? DEFAULT_WEEK_STARTS_ON;
  const gridStart = startOfWeek(monthStart, { weekStartsOn });

  const days = Array.from({ length: GRID_SIZE }, (_, index) => {
    const date = addDays(gridStart, index);

    return {
      date,
      dayNumber: date.getDate(),
      isCurrentMonth: isSameMonth(date, monthStart),
      isToday: isSameCalendarDay(date, today),
      marker: getCalendarMarker(date)
    } satisfies CalendarDay;
  });

  return chunkIntoWeeks(days);
}

export function generateMonthCells(
  monthDate: Date,
  options: GenerateMonthGridOptions = {}
): CalendarDay[] {
  return generateMonthGrid(monthDate, options).flat();
}

export function createMonthMatrix(monthDate: Date) {
  return generateMonthCells(monthDate).map((day) => ({
    date: day.date,
    dayNumber: day.dayNumber,
    inMonth: day.isCurrentMonth,
    isCurrentMonth: day.isCurrentMonth,
    isToday: day.isToday,
    marker: day.marker
  }));
}

function chunkIntoWeeks(days: CalendarDay[]): CalendarGrid {
  return Array.from({ length: GRID_SIZE / DAYS_IN_WEEK }, (_, index) =>
    days.slice(index * DAYS_IN_WEEK, index * DAYS_IN_WEEK + DAYS_IN_WEEK)
  );
}
