export type ISODate = `${number}-${number}-${number}`;

export type WeekStartsOn = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface CalendarMarker {
  label: string;
  shortLabel: string;
  tone: "holiday" | "event";
}

export interface CalendarDay {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  marker: CalendarMarker | null;
}

export type CalendarGrid = CalendarDay[][];

export interface GenerateMonthGridOptions {
  weekStartsOn?: WeekStartsOn;
  today?: Date;
}

export interface DateRangeState {
  startDate: Date | null;
  endDate: Date | null;
}

export interface StoredSelection {
  anchor: ISODate | null;
  start: ISODate | null;
  end: ISODate | null;
}

export interface MonthTheme {
  accent: string;
  label: string;
  description: string;
  caption: string;
  photoQuery: string;
  image: string;
}
