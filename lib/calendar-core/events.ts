import { format } from "date-fns";

import type { CalendarMarker } from "./types";

const FIXED_MARKERS: Record<string, CalendarMarker> = {
  "01-01": { label: "New Year's Day", shortLabel: "NY", tone: "holiday" },
  "02-14": { label: "Valentine's Day", shortLabel: "V", tone: "event" },
  "04-22": { label: "Earth Day", shortLabel: "ED", tone: "event" },
  "07-04": { label: "Independence Day", shortLabel: "US", tone: "holiday" },
  "10-31": { label: "Halloween", shortLabel: "H", tone: "event" },
  "12-25": { label: "Christmas Day", shortLabel: "X", tone: "holiday" },
  "12-31": { label: "New Year's Eve", shortLabel: "E", tone: "event" }
};

export function getCalendarMarker(date: Date): CalendarMarker | null {
  return FIXED_MARKERS[format(date, "MM-dd")] ?? null;
}
