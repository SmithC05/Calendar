"use client";

import { isValid, parseISO } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useId, useMemo, useState } from "react";

import { formatLongDate, formatMonthYear, formatRangeLabel } from "@/lib/calendar";

type NotesPanelProps = {
  currentMonth: Date;
  monthNoteKey: string;
  selectedRangeKey: string | null;
  notes: Record<string, string>;
  onOpenNote: (key: string) => void;
  onSave: (key: string, value: string) => void;
};

export function NotesPanel({
  currentMonth,
  monthNoteKey,
  selectedRangeKey,
  notes,
  onOpenNote,
  onSave
}: NotesPanelProps) {
  const noteFieldId = useId();
  const [activeMode, setActiveMode] = useState<"month" | "selection">(
    selectedRangeKey ? "selection" : "month"
  );
  const activeKey = activeMode === "selection" ? selectedRangeKey : monthNoteKey;
  const currentValue = activeKey ? notes[activeKey] ?? "" : "";
  const [draft, setDraft] = useState(currentValue);

  useEffect(() => {
    if (selectedRangeKey) {
      setActiveMode("selection");
      return;
    }

    setActiveMode((previous) => (previous === "selection" ? "month" : previous));
  }, [selectedRangeKey]);

  useEffect(() => {
    setDraft(currentValue);
  }, [activeKey, currentValue]);

  const selectionLabel = useMemo(
    () => formatSelectionLabel(selectedRangeKey),
    [selectedRangeKey]
  );
  const monthLabel = useMemo(
    () => ({
      title: `${formatMonthYear(currentMonth)} memo`,
      description: "A broader note board for reminders, intent, and month-wide planning."
    }),
    [currentMonth]
  );
  const panelLabel = activeMode === "selection" ? selectionLabel : monthLabel;
  const isDirty = Boolean(activeKey) && draft !== currentValue;
  const savedNoteCount = Object.keys(notes).length;
  const savedNotes = useMemo(() => buildSavedNotes(notes), [notes]);

  function handleSave() {
    if (!activeKey) {
      return;
    }

    onSave(activeKey, draft);
  }

  function handleClear() {
    if (!activeKey) {
      return;
    }

    setDraft("");
    onSave(activeKey, "");
  }

  return (
    <aside className="paper-wash rounded-[1.95rem] border border-ink/10 p-4 shadow-paper backdrop-blur sm:p-5 xl:sticky xl:top-6 xl:self-start">
      <div className="flex flex-wrap items-center gap-2">
        <ModeButton
          isActive={activeMode === "month"}
          label="Month memo"
          onClick={() => setActiveMode("month")}
          status={notes[monthNoteKey] ? "Saved" : "Open"}
        />
        <ModeButton
          disabled={!selectedRangeKey}
          isActive={activeMode === "selection"}
          label="Selection note"
          onClick={() => setActiveMode("selection")}
          status={
            !selectedRangeKey
              ? "Pick"
              : notes[selectedRangeKey]
                ? "Saved"
                : "Ready"
          }
        />
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`${activeMode}-${panelLabel.title}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 overflow-hidden rounded-[1.55rem] border border-ink/10 bg-[linear-gradient(165deg,rgb(var(--blush)_/_0.72),rgb(var(--paper)_/_0.9))] p-5 shadow-inset dark:bg-[linear-gradient(165deg,rgb(var(--blush)_/_0.18),rgb(var(--panel)_/_0.94))]"
        >
          <p className="text-[0.68rem] uppercase tracking-[0.32em] text-ink/45">Notes</p>
          <h3 className="mt-3 font-serif text-[2rem] leading-none text-ink">
            {panelLabel.title}
          </h3>
          <p className="mt-3 text-sm leading-6 text-ink/68">{panelLabel.description}</p>
        </motion.div>
      </AnimatePresence>

      <div className="mt-4 rounded-[1.55rem] border border-ink/10 bg-panel/82 p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[0.68rem] uppercase tracking-[0.28em] text-ink/45">Planner Note</p>
            <p className="mt-1 text-sm leading-6 text-ink/68">
              {activeMode === "month"
                ? "Keep a broad memo for the month, then switch into a date-linked note whenever you select a day or range."
                : currentValue
                  ? "Edit and save changes to keep this note tied to the selected moment."
                  : "Capture a reminder, plan, or memory for this exact selection."}
            </p>
          </div>
          <span className="inline-flex h-8 w-fit items-center rounded-full bg-ink/6 px-3 text-xs text-ink/58">
            {isDirty ? "Unsaved" : "Saved locally"}
          </span>
        </div>

        {!selectedRangeKey ? (
          <div className="mt-4 rounded-[1.25rem] border border-dashed border-ink/12 bg-paper/66 px-4 py-3 text-sm leading-6 text-ink/62">
            Select a day or drag out a range to unlock a second note stream tied to that exact span.
          </div>
        ) : null}

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="inline-flex h-8 items-center rounded-full bg-rust/10 px-3 text-xs font-medium uppercase tracking-[0.2em] text-rust">
            {activeMode === "month" ? "Month-wide memo" : "Range-linked note"}
          </span>
          <span className="inline-flex h-8 items-center rounded-full bg-ink/6 px-3 text-xs text-ink/58">
            {savedNoteCount
              ? `${savedNoteCount} saved note${savedNoteCount === 1 ? "" : "s"}`
              : "No saved notes yet"}
          </span>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[0.68rem] uppercase tracking-[0.28em] text-ink/45">Saved Notes</p>
            {savedNoteCount ? (
              <span className="text-xs text-ink/48">Tap any entry to reopen it.</span>
            ) : null}
          </div>

          {savedNotes.length ? (
            <div className="mt-3 grid gap-2">
              {savedNotes.map((note) => {
                const isActive = note.key === activeKey;

                return (
                  <button
                    key={note.key}
                    type="button"
                    onClick={() => {
                      setActiveMode(note.kind === "month" ? "month" : "selection");
                      onOpenNote(note.key);
                    }}
                    className={[
                      "rounded-[1.2rem] border px-4 py-3 text-left transition duration-200",
                      isActive
                        ? "border-rust/25 bg-rust/8 shadow-[0_10px_24px_rgb(var(--shadow)_/_0.08)]"
                        : "border-ink/10 bg-paper/70 hover:bg-paper"
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-ink">{note.title}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-ink/45">
                          {note.badge}
                        </p>
                      </div>
                      {isActive ? (
                        <span className="inline-flex h-7 items-center rounded-full bg-rust px-2.5 text-[0.65rem] font-medium uppercase tracking-[0.18em] text-white">
                          Open
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 overflow-hidden text-sm leading-6 text-ink/65 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
                      {note.preview}
                    </p>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="mt-3 rounded-[1.2rem] border border-dashed border-ink/12 bg-paper/62 px-4 py-3 text-sm leading-6 text-ink/58">
              Saved notes will appear here so you can revisit older month memos and date ranges.
            </div>
          )}
        </div>

        <label
          htmlFor={noteFieldId}
          className="mt-5 block text-[0.68rem] uppercase tracking-[0.28em] text-ink/45"
        >
          Journal Entry
        </label>
        <textarea
          id={noteFieldId}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          rows={10}
          placeholder={
            activeMode === "month"
              ? "Write a theme for the month, a running memo, or a list of priorities."
              : "Write a quiet reminder, a travel plan, or the story behind these dates."
          }
          className="mt-3 min-h-[220px] w-full resize-none rounded-[1.3rem] border border-ink/10 bg-paper/94 px-4 py-3 text-sm leading-6 text-ink shadow-inset outline-none transition placeholder:text-ink/35 focus:border-ink/16 focus:ring-4 focus:ring-ink/5 sm:min-h-[250px]"
        />

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-ink/52">
            Notes are persisted in local storage through the calendar shell, so the experience stays immediate and frontend-only.
          </p>
          <div className="flex flex-wrap gap-2">
            <motion.button
              type="button"
              onClick={handleClear}
              disabled={!currentValue && !draft}
              whileHover={currentValue || draft ? { y: -1 } : undefined}
              whileTap={currentValue || draft ? { scale: 0.985 } : undefined}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex h-11 items-center justify-center rounded-full border border-ink/10 bg-transparent px-5 text-sm font-medium text-ink/70 transition duration-200 hover:bg-paper disabled:cursor-not-allowed disabled:opacity-45"
            >
              Clear
            </motion.button>
            <motion.button
              type="button"
              onClick={handleSave}
              disabled={!isDirty}
              whileHover={isDirty ? { y: -1 } : undefined}
              whileTap={isDirty ? { scale: 0.985 } : undefined}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex h-11 items-center justify-center rounded-full border border-ink/10 bg-panel px-5 text-sm font-medium text-ink transition duration-200 hover:bg-paper disabled:cursor-not-allowed disabled:opacity-50"
            >
              Save note
            </motion.button>
          </div>
        </div>
      </div>
    </aside>
  );
}

type ModeButtonProps = {
  disabled?: boolean;
  isActive: boolean;
  label: string;
  onClick: () => void;
  status: string;
};

function ModeButton({
  disabled = false,
  isActive,
  label,
  onClick,
  status
}: ModeButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={[
        "inline-flex min-w-[9.5rem] items-center justify-between gap-3 rounded-full border px-4 py-2 text-left transition duration-200",
        isActive
          ? "border-ink/12 bg-panel text-ink shadow-[0_10px_22px_rgb(var(--shadow)_/_0.08)]"
          : "border-ink/10 bg-panel/55 text-ink/68 hover:bg-panel/72",
        disabled ? "cursor-not-allowed opacity-45" : ""
      ].join(" ")}
    >
      <span className="text-sm font-medium">{label}</span>
      <span className="text-[0.65rem] uppercase tracking-[0.2em] text-ink/42">{status}</span>
    </button>
  );
}

function formatSelectionLabel(selectedRangeKey: string | null) {
  if (!selectedRangeKey) {
    return {
      title: "No selection yet",
      description: "Pick a date or range to start writing."
    };
  }

  const [startValue, endValue] = selectedRangeKey.split("_");
  const startDate = parseISO(startValue);

  if (!isValid(startDate)) {
    return {
      title: "Selected note",
      description: selectedRangeKey
    };
  }

  if (!endValue) {
    return {
      title: formatLongDate(startDate),
      description: "A focused note for one specific day."
    };
  }

  const endDate = parseISO(endValue);

  if (!isValid(endDate)) {
    return {
      title: formatLongDate(startDate),
      description: "A focused note for one specific day."
    };
  }

  return {
    title: formatRangeLabel(startDate, endDate),
    description: "A shared note for the full selected date range."
  };
}

type SavedNoteEntry = {
  key: string;
  kind: "month" | "selection";
  title: string;
  badge: string;
  preview: string;
  sortValue: number;
};

function buildSavedNotes(notes: Record<string, string>): SavedNoteEntry[] {
  return Object.entries(notes)
    .map(([key, value]) => createSavedNoteEntry(key, value))
    .filter((entry): entry is SavedNoteEntry => entry !== null)
    .sort((first, second) => second.sortValue - first.sortValue);
}

function createSavedNoteEntry(key: string, value: string): SavedNoteEntry | null {
  const preview = value.trim();

  if (!preview) {
    return null;
  }

  const monthMatch = /^month-(\d{4})-(\d{2})$/.exec(key);

  if (monthMatch) {
    const [, year, month] = monthMatch;
    const monthDate = new Date(Number(year), Number(month) - 1, 1);

    return {
      key,
      kind: "month",
      title: `${formatMonthYear(monthDate)} memo`,
      badge: "Month memo",
      preview,
      sortValue: monthDate.getTime()
    };
  }

  const [startValue, endValue] = key.split("_");
  const startDate = parseStoredDate(startValue);

  if (!startDate) {
    return null;
  }

  const endDate = parseStoredDate(endValue) ?? startDate;

  return {
    key,
    kind: "selection",
    title: formatRangeLabel(startDate, endDate),
    badge: startValue === endValue || !endValue ? "Date note" : "Range note",
    preview,
    sortValue: startDate.getTime()
  };
}

function parseStoredDate(value?: string) {
  if (!value) {
    return null;
  }

  const parsedDate = parseISO(value);
  return isValid(parsedDate) ? parsedDate : null;
}
