import type { MonthTheme } from "./types";

const MONTH_THEME_SOURCES: Array<Omit<MonthTheme, "image"> & { palette: [string, string, string] }> = [
  {
    accent: "#c96e4f",
    label: "January",
    description: "Quiet mornings, crisp light, and room to reset.",
    caption: "Let the room stay quiet long enough for a new plan.",
    photoQuery: "snowy mountain cabin winter landscape",
    palette: ["#e5d7cf", "#bb6d4d", "#4d6770"]
  },
  {
    accent: "#d49068",
    label: "February",
    description: "Warm interiors and softly lit winter afternoons.",
    caption: "Keep the lights low and the intentions clear.",
    photoQuery: "cozy winter window warm interior",
    palette: ["#f2d7c5", "#d49068", "#6f5f7e"]
  },
  {
    accent: "#85936b",
    label: "March",
    description: "Fresh greenery and the first signs of longer days.",
    caption: "Open a window and let the month rearrange the pace.",
    photoQuery: "early spring meadow morning light",
    palette: ["#e2ead8", "#85936b", "#dcb48b"]
  },
  {
    accent: "#c57e5a",
    label: "April",
    description: "Garden air, brushed petals, and bright windows.",
    caption: "Fresh air, wet stone, and something beginning again.",
    photoQuery: "spring garden blossoms rain window",
    palette: ["#f5e4d8", "#c57e5a", "#84a698"]
  },
  {
    accent: "#738d5f",
    label: "May",
    description: "Late spring energy with botanical calm.",
    caption: "Green things grow best with a little patience.",
    photoQuery: "lush botanical garden late spring",
    palette: ["#edf1e2", "#738d5f", "#d2ab74"]
  },
  {
    accent: "#658f99",
    label: "June",
    description: "Lake-blue skies, linen textures, and long evenings.",
    caption: "Longer light makes even small plans feel expansive.",
    photoQuery: "blue lake summer sky linen picnic",
    palette: ["#dfecef", "#658f99", "#f0c18b"]
  },
  {
    accent: "#cc8156",
    label: "July",
    description: "Sun-warmed color, road trips, and open air dinners.",
    caption: "Stay out a little longer while the light still holds.",
    photoQuery: "summer road trip golden hour landscape",
    palette: ["#f6dfcf", "#cc8156", "#577e92"]
  },
  {
    accent: "#b67a53",
    label: "August",
    description: "Golden hour light and a slower summer rhythm.",
    caption: "Let golden hour do most of the talking.",
    photoQuery: "late summer golden field evening light",
    palette: ["#f2dcc5", "#b67a53", "#7f8f63"]
  },
  {
    accent: "#8a7d55",
    label: "September",
    description: "New routines, paper textures, and cooler mornings.",
    caption: "Start neatly, but leave enough room for surprise.",
    photoQuery: "autumn study desk paper coffee morning",
    palette: ["#efe8d8", "#8a7d55", "#6e836d"]
  },
  {
    accent: "#9f6446",
    label: "October",
    description: "Amber leaves, wool layers, and earthy contrast.",
    caption: "Gather warmth early and make the evenings count.",
    photoQuery: "autumn leaves forest amber sweater",
    palette: ["#f1dfd2", "#9f6446", "#55654d"]
  },
  {
    accent: "#77695f",
    label: "November",
    description: "Muted light, reflective evenings, and calm interiors.",
    caption: "Keep the day simple and the table full.",
    photoQuery: "moody november interior candle table",
    palette: ["#e8e0db", "#77695f", "#7d8b8e"]
  },
  {
    accent: "#5b7188",
    label: "December",
    description: "Deep blue evenings and polished holiday warmth.",
    caption: "Soft lights, deep blue evenings, and a slower finish.",
    photoQuery: "holiday lights winter evening home",
    palette: ["#dde6ef", "#5b7188", "#c78b64"]
  }
];

const MONTH_THEMES: MonthTheme[] = MONTH_THEME_SOURCES.map((theme) => ({
  accent: theme.accent,
  label: theme.label,
  description: theme.description,
  caption: theme.caption,
  photoQuery: theme.photoQuery,
  image: buildMonthImage(theme.palette, theme.label)
}));

export function getMonthTheme(date: Date): MonthTheme {
  return MONTH_THEMES[date.getMonth()];
}

function buildMonthImage([light, accent, contrast]: [string, string, string], label: string) {
  const svg = `
    <svg width="1200" height="720" viewBox="0 0 1200 720" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sky" x1="60" y1="40" x2="1120" y2="680" gradientUnits="userSpaceOnUse">
          <stop stop-color="${light}" />
          <stop offset="0.55" stop-color="#f7efe4" />
          <stop offset="1" stop-color="${accent}" />
        </linearGradient>
        <filter id="blur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="36" />
        </filter>
      </defs>
      <rect width="1200" height="720" rx="40" fill="url(#sky)" />
      <circle cx="980" cy="128" r="74" fill="${contrast}" fill-opacity="0.18" />
      <circle cx="260" cy="118" r="92" fill="${accent}" fill-opacity="0.2" filter="url(#blur)" />
      <path d="M0 560C120 500 240 500 360 544C470 584 566 598 690 556C860 498 974 518 1200 628V720H0V560Z" fill="${contrast}" fill-opacity="0.22"/>
      <path d="M0 592C128 534 266 532 406 592C520 640 632 650 770 602C918 550 1034 562 1200 650V720H0V592Z" fill="${accent}" fill-opacity="0.3"/>
      <rect x="84" y="90" width="312" height="124" rx="28" fill="white" fill-opacity="0.22" />
      <text x="120" y="162" fill="#1b1a18" font-family="Georgia, serif" font-size="58" letter-spacing="1.5">${label}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
