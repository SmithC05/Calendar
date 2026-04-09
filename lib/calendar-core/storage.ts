import { format } from "date-fns";

import { isSameCalendarDay, normalizeDate, sortDates, toISODate } from "./date-utils";

export function createDateStorageKey(date: Date): string {
  return toISODate(date);
}

export function createRangeStorageKey(startDate: Date, endDate: Date): string {
  const [firstDate, lastDate] = sortDates(startDate, endDate);
  return `${toISODate(firstDate)}_${toISODate(lastDate)}`;
}

export function createSelectionStorageKey(
  startDate: Date | null,
  endDate: Date | null
): string {
  const firstDate = startDate ?? endDate;
  const lastDate = endDate ?? startDate;

  if (!firstDate || !lastDate) {
    return "month";
  }

  if (isSameCalendarDay(firstDate, lastDate)) {
    return createDateStorageKey(firstDate);
  }

  return createRangeStorageKey(firstDate, lastDate);
}

export function createMonthStorageKey(monthDate: Date): string {
  return `month-${format(normalizeDate(monthDate), "yyyy-MM")}`;
}

export function getSelectionKey(startDate: Date | null, endDate: Date | null): string {
  return createSelectionStorageKey(startDate, endDate);
}

export function getMonthSelectionKey(monthDate: Date): string {
  return createMonthStorageKey(monthDate);
}
