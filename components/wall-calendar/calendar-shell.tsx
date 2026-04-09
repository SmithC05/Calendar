"use client";

import { startOfMonth } from "date-fns";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

import { useMonthHeroImage } from "@/hooks/use-month-hero-image";
import { useThemePreference } from "@/hooks/use-theme-preference";
import {
  addMonths,
  fromISODate,
  generateMonthCells,
  getMonthSelectionKey,
  getMonthTheme,
  getSelectionKey,
  selectRangeDate,
  toISODate,
  type DateRangeState,
  type ISODate
} from "@/lib/calendar";

import { CalendarGrid } from "./calendar-grid";
import { HeroPanel } from "./hero-panel";
import { MonthHeader } from "./month-header";
import { NotesPanel } from "./notes-panel";
import { RangeSummary } from "./range-summary";

const STORAGE_KEY = "wallstory-calendar-state";

const PANEL_TRANSITION = {
  duration: 0.42,
  ease: [0.22, 1, 0.36, 1] as const
};

type PersistedState = {
  currentMonth: ISODate;
  selection: {
    start: ISODate | null;
    end: ISODate | null;
  };
  notes: Record<string, string>;
};

export function CalendarShell() {
  const [currentMonth, setCurrentMonth] = useState(() => startOfMonth(new Date()));
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [isReady, setIsReady] = useState(false);
  const { theme, setTheme } = useThemePreference();

  useEffect(() => {
    try {
      const storedValue = window.localStorage.getItem(STORAGE_KEY);

      if (!storedValue) {
        setIsReady(true);
        return;
      }

      const parsed = JSON.parse(storedValue) as PersistedState;
      const storedMonth = fromISODate(parsed.currentMonth);

      if (storedMonth) {
        setCurrentMonth(startOfMonth(storedMonth));
      }

      setStartDate(fromISODate(parsed.selection.start));
      setEndDate(fromISODate(parsed.selection.end));
      setNotes(parsed.notes ?? {});
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    const payload: PersistedState = {
      currentMonth: toISODate(currentMonth),
      selection: {
        start: startDate ? toISODate(startDate) : null,
        end: endDate ? toISODate(endDate) : null
      },
      notes
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [currentMonth, endDate, isReady, notes, startDate]);

  const monthTheme = useMemo(() => getMonthTheme(currentMonth), [currentMonth]);
  const heroPhoto = useMonthHeroImage(currentMonth, monthTheme.photoQuery, monthTheme.image);
  const days = useMemo(() => generateMonthCells(currentMonth), [currentMonth]);
  const monthNoteKey = useMemo(() => getMonthSelectionKey(currentMonth), [currentMonth]);
  const selectedRangeKey = useMemo(() => {
    if (!startDate && !endDate) {
      return null;
    }

    return getSelectionKey(startDate, endDate);
  }, [endDate, startDate]);

  function handleDateClick(clickedDate: Date) {
    const nextSelection = selectRangeDate(
      {
        startDate,
        endDate
      } satisfies DateRangeState,
      clickedDate
    );

    setStartDate(nextSelection.startDate);
    setEndDate(nextSelection.endDate);

    if (
      clickedDate.getMonth() !== currentMonth.getMonth() ||
      clickedDate.getFullYear() !== currentMonth.getFullYear()
    ) {
      setCurrentMonth(startOfMonth(clickedDate));
    }
  }

  function clearSelection() {
    setStartDate(null);
    setEndDate(null);
  }

  function handlePrevMonth() {
    setCurrentMonth((previous) => addMonths(previous, -1));
    clearSelection();
  }

  function handleNextMonth() {
    setCurrentMonth((previous) => addMonths(previous, 1));
    clearSelection();
  }

  function handleSaveNote(key: string, value: string) {
    setNotes((previous) => {
      const nextNotes = { ...previous };

      if (value.trim()) {
        nextNotes[key] = value;
      } else {
        delete nextNotes[key];
      }

      return nextNotes;
    });
  }

  function handleJumpToToday() {
    const today = fromISODate(toISODate(new Date()));

    if (!today) {
      return;
    }

    setCurrentMonth(startOfMonth(today));
    setStartDate(today);
    setEndDate(today);
  }

  return (
    <div className="space-y-4 sm:space-y-5 lg:space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={PANEL_TRANSITION}
      >
        <MonthHeader
          currentMonth={currentMonth}
          onNextMonth={handleNextMonth}
          onPrevMonth={handlePrevMonth}
          onThemeChange={setTheme}
          theme={theme}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...PANEL_TRANSITION, delay: 0.04 }}
      >
        <HeroPanel
          accent={monthTheme.accent}
          caption={monthTheme.caption}
          credit={heroPhoto.credit}
          description={monthTheme.description}
          imageUrl={heroPhoto.imageUrl}
          month={currentMonth}
        />
      </motion.div>

      <div className="grid gap-4 lg:gap-5 xl:grid-cols-[minmax(0,1fr)_390px]">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...PANEL_TRANSITION, delay: 0.08 }}
          className="rounded-[1.95rem] border border-ink/10 bg-paper/88 p-3 shadow-paper backdrop-blur sm:p-5 lg:p-6"
        >
          <RangeSummary
            endDate={endDate}
            onClearSelection={clearSelection}
            onJumpToToday={handleJumpToToday}
            startDate={startDate}
          />

          <div className="mt-4 sm:mt-5">
            <CalendarGrid
              days={days}
              endDate={endDate}
              onDateClick={handleDateClick}
              startDate={startDate}
            />
          </div>
        </motion.section>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...PANEL_TRANSITION, delay: 0.12 }}
        >
          <NotesPanel
            currentMonth={currentMonth}
            monthNoteKey={monthNoteKey}
            notes={notes}
            onSave={handleSaveNote}
            selectedRangeKey={selectedRangeKey}
          />
        </motion.div>
      </div>
    </div>
  );
}
