import { differenceInCalendarDays } from "date-fns";

import { isDateAfter, isDateBefore, isSameCalendarDay, normalizeDate } from "./date-utils";

export function isRangeStart(date: Date, startDate: Date | null): boolean {
  return isSameCalendarDay(date, startDate);
}

export function isRangeEnd(date: Date, endDate: Date | null): boolean {
  return isSameCalendarDay(date, endDate);
}

// Excludes the start and end dates so UI can style endpoints separately.
export function isDateWithinRange(
  date: Date,
  startDate: Date | null,
  endDate: Date | null
): boolean {
  if (!startDate || !endDate) {
    return false;
  }

  const current = normalizeDate(date);
  return isDateAfter(current, startDate) && isDateBefore(current, endDate);
}

export function countSelectedDays(startDate: Date | null, endDate: Date | null): number {
  if (!startDate) {
    return 0;
  }

  const lastDate = endDate ?? startDate;
  return differenceInCalendarDays(normalizeDate(lastDate), normalizeDate(startDate)) + 1;
}

export const isWithinRange = isDateWithinRange;
export const countDays = countSelectedDays;
