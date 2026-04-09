import { WallCalendar } from "@/components/wall-calendar/wall-calendar";

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-10">
        <section className="relative overflow-hidden rounded-[2.2rem] border border-ink/10 bg-paper/78 px-4 py-5 shadow-card backdrop-blur-sm sm:px-7 sm:py-7 lg:px-10 lg:py-9">
          <div className="pointer-events-none absolute inset-0 bg-grain [background-size:12px_12px] opacity-[0.16]" />
          <div className="pointer-events-none absolute -left-24 top-0 h-52 w-52 rounded-full bg-rust/10 blur-3xl" />
          <div className="pointer-events-none absolute right-0 top-8 h-64 w-64 rounded-full bg-pine/10 blur-3xl" />
          <div className="relative">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.35em] text-ink/50">WallStory Calendar</p>
              <h1 className="mt-3 font-serif text-4xl leading-none text-ink sm:text-5xl lg:text-6xl">
                A premium photo-wall calendar for date ranges, notes, and monthly atmosphere.
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-6 text-ink/70 sm:text-base">
                Select a day or stretch of days, keep thoughtful notes, and move through the year like a gallery of printed months.
              </p>
            </div>
            <div className="mt-7 sm:mt-8 lg:mt-10">
              <WallCalendar />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
