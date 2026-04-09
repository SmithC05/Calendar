import { addMonths as addMonthsDateFns, format, isAfter, isBefore, isSameDay, parseISO, startOfDay } from "date-fns";

import type { ISODate } from "./types";

export function normalizeDate(date: Date): Date {
  return startOfDay(date);
}

export function isSameCalendarDay(first: Date | null, second: Date | null): boolean {
  if (!first || !second) {
    return false;
  }

  return isSameDay(normalizeDate(first), normalizeDate(second));
}

export function isDateBefore(first: Date, second: Date): boolean {
  return isBefore(normalizeDate(first), normalizeDate(second));
}

export function isDateAfter(first: Date, second: Date): boolean {
  return isAfter(normalizeDate(first), normalizeDate(second));
}

export function sortDates(first: Date, second: Date): [Date, Date] {
  const normalizedFirst = normalizeDate(first);
  const normalizedSecond = normalizeDate(second);

  return isDateAfter(normalizedFirst, normalizedSecond)
    ? [normalizedSecond, normalizedFirst]
    : [normalizedFirst, normalizedSecond];
}

export function addCalendarMonths(date: Date, amount: number): Date {
  return normalizeDate(addMonthsDateFns(normalizeDate(date), amount));
}

export function toISODate(date: Date): ISODate {
  return format(normalizeDate(date), "yyyy-MM-dd") as ISODate;
}

export function fromISODate(value: ISODate | null): Date | null {
  if (!value) {
    return null;
  }

  return normalizeDate(parseISO(value));
}

export const sameDay = isSameCalendarDay;
export const addMonths = addCalendarMonths;
