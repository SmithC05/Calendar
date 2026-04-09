"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

import { formatMonthYear } from "@/lib/calendar";

type HeroPanelProps = {
  month: Date;
  imageUrl: string;
  description: string;
  caption: string;
  accent: string;
  credit?: {
    photographerName: string;
    photographerUrl: string;
    sourceUrl: string;
  } | null;
};

const TRANSITION = {
  duration: 0.42,
  ease: [0.22, 1, 0.36, 1] as const
};

export function HeroPanel({ month, imageUrl, description, caption, accent, credit }: HeroPanelProps) {
  const monthKey = `${month.getFullYear()}-${month.getMonth()}`;

  return (
    <div className="group relative overflow-hidden rounded-[2rem] border border-ink/10 bg-panel shadow-paper">
      <div className="pointer-events-none absolute left-1/2 top-0 z-20 flex -translate-x-1/2 -translate-y-1/2 gap-4 sm:gap-6">
        {[0, 1, 2].map((ring) => (
          <span
            key={ring}
            className="relative h-8 w-8 rounded-full border-[5px] border-paper/90 bg-paper/15 shadow-[0_10px_24px_rgb(var(--shadow)_/_0.18)] backdrop-blur-sm sm:h-9 sm:w-9"
          >
            <span className="absolute inset-[4px] rounded-full border border-ink/8 bg-paper/45" />
          </span>
        ))}
      </div>

      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={monthKey}
          initial={{ opacity: 0, y: 8, scale: 1.015 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 1.01 }}
          transition={TRANSITION}
          className="absolute inset-0"
        >
          <Image
            alt={`${formatMonthYear(month)} hero artwork. ${description}`}
            className="object-cover transition duration-700 group-hover:scale-[1.02]"
            fill
            priority
            sizes="(min-width: 1280px) 780px, (min-width: 1024px) 68vw, 100vw"
            src={imageUrl}
            unoptimized={imageUrl.startsWith("data:")}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,18,16,0.08),rgba(20,18,16,0.52))] dark:bg-[linear-gradient(180deg,rgba(5,5,5,0.16),rgba(5,5,5,0.68))]" />
        </motion.div>
      </AnimatePresence>

      <div className="pointer-events-none absolute inset-0 bg-grain [background-size:14px_14px] opacity-[0.12]" />
      <div className="pointer-events-none absolute inset-x-6 bottom-0 z-10 flex translate-y-1/2 items-center justify-between gap-1.5 sm:gap-2">
        {Array.from({ length: 12 }, (_, index) => (
          <span
            key={index}
            className="h-3 w-3 rounded-full border border-paper/60 bg-paper shadow-[0_6px_10px_rgb(var(--shadow)_/_0.1)] sm:h-3.5 sm:w-3.5"
          />
        ))}
      </div>

      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={`content-${monthKey}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ ...TRANSITION, delay: 0.04 }}
          className="relative flex min-h-[250px] flex-col justify-between p-5 text-white sm:min-h-[315px] sm:p-7 lg:min-h-[360px] lg:p-8"
        >
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/18 bg-studio/18 px-3 py-1.5 text-[0.68rem] uppercase tracking-[0.32em] text-white/82 backdrop-blur-sm">
            <span
              aria-hidden="true"
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: accent }}
            />
            WallStory Calendar
          </div>

          <div className="flex flex-col gap-4 sm:gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <p className="text-xs uppercase tracking-[0.28em] text-white/72">Monthly Story</p>
              <h2 className="mt-3 font-serif text-4xl leading-none text-white sm:text-5xl lg:text-6xl">
                {formatMonthYear(month)}
              </h2>
              <p className="mt-3 max-w-md text-sm leading-6 text-white/82 sm:text-base">
                {description}
              </p>
            </div>

            <div className="max-w-sm lg:text-right">
              <blockquote className="rounded-[1.35rem] border border-white/16 bg-studio/16 px-4 py-4 text-sm leading-6 text-white/82 backdrop-blur-sm sm:px-5">
                <p className="text-[0.68rem] uppercase tracking-[0.28em] text-white/62">Seasonal Note</p>
                <p className="mt-2 font-serif text-lg leading-snug text-white/90">{caption}</p>
              </blockquote>

              {credit ? (
                <p className="mt-3 text-xs leading-5 text-white/64">
                  Photo by{" "}
                  <a
                    className="transition hover:text-white"
                    href={credit.photographerUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {credit.photographerName}
                  </a>{" "}
                  on{" "}
                  <a
                    className="transition hover:text-white"
                    href={credit.sourceUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Unsplash
                  </a>
                </p>
              ) : null}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
