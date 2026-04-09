import { addDays, format, isSameYear, startOfWeek } from "date-fns";

import { isSameCalendarDay, normalizeDate } from "./date-utils";
import type { WeekStartsOn } from "./types";

const DEFAULT_WEEK_STARTS_ON = 0;
const DAY_NAME_REFERENCE = new Date(2026, 3, 5);

export function formatMonthYear(date: Date): string {
  return format(normalizeDate(date), "MMMM yyyy");
}

export function formatMonthDay(date: Date): string {
  return format(normalizeDate(date), "MMM d");
}

export function formatLongDate(date: Date): string {
  return format(normalizeDate(date), "EEEE, MMMM d, yyyy");
}

export function formatSelectedRange(
  startDate: Date | null,
  endDate: Date | null
): string {
  if (!startDate && !endDate) {
    return "Select dates";
  }

  const firstDate = startDate ?? endDate;
  const lastDate = endDate ?? startDate;

  if (!firstDate || !lastDate) {
    return "Select dates";
  }

  if (isSameCalendarDay(firstDate, lastDate)) {
    return formatMonthDay(firstDate);
  }

  const firstFormat = isSameYear(firstDate, lastDate) ? "MMM d" : "MMM d, yyyy";
  const lastFormat = isSameYear(firstDate, lastDate) ? "MMM d" : "MMM d, yyyy";

  return `${format(normalizeDate(firstDate), firstFormat)} - ${format(
    normalizeDate(lastDate),
    lastFormat
  )}`;
}

export function formatRangeLabel(
  startDate: Date | null,
  endDate: Date | null
): string {
  return formatSelectedRange(startDate, endDate);
}

export function getDayNames(weekStartsOn: WeekStartsOn = DEFAULT_WEEK_STARTS_ON): string[] {
  const weekStart = startOfWeek(DAY_NAME_REFERENCE, { weekStartsOn });

  return Array.from({ length: 7 }, (_, index) =>
    format(addDays(weekStart, index), "EEE")
  );
}
