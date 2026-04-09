import { isSameCalendarDay, normalizeDate, sortDates } from "./date-utils";
import type { DateRangeState } from "./types";

export function createEmptyDateRange(): DateRangeState {
  return {
    startDate: null,
    endDate: null
  };
}

export function selectStartDate(
  _currentState: DateRangeState,
  clickedDate: Date
): DateRangeState {
  return {
    startDate: normalizeDate(clickedDate),
    endDate: null
  };
}

export function selectEndDate(
  currentState: DateRangeState,
  clickedDate: Date
): DateRangeState {
  const nextDate = normalizeDate(clickedDate);

  if (!currentState.startDate) {
    return {
      startDate: nextDate,
      endDate: null
    };
  }

  const startDate = normalizeDate(currentState.startDate);

  if (isSameCalendarDay(startDate, nextDate)) {
    return {
      startDate,
      endDate: startDate
    };
  }

  const [normalizedStart, normalizedEnd] = sortDates(startDate, nextDate);

  return {
    startDate: normalizedStart,
    endDate: normalizedEnd
  };
}

export function selectRangeDate(
  currentState: DateRangeState,
  clickedDate: Date
): DateRangeState {
  if (!currentState.startDate || currentState.endDate) {
    return selectStartDate(currentState, clickedDate);
  }

  return selectEndDate(currentState, clickedDate);
}

export function resetDateRange(): DateRangeState {
  return createEmptyDateRange();
}
