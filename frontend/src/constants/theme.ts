export const THEME_CONFIG = {
  STORAGE_KEY: "crowdshield-theme",
  DEFAULT: "system",
} as const;

export const COLOR_PALETTE = {
  PRIMARY: "hsl(var(--primary))",
  SECONDARY: "hsl(var(--secondary))",
  BACKGROUND: "hsl(var(--background))",
  FOREGROUND: "hsl(var(--foreground))",
  DESTRUCTIVE: "hsl(var(--destructive))",
} as const;

export const STATUS_COLORS = {
  SAFE: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-500",
    border: "border-emerald-500/20",
    hex: "#10b981",
  },
  WARNING: {
    bg: "bg-amber-500/10",
    text: "text-amber-500",
    border: "border-amber-500/20",
    hex: "#f59e0b",
  },
  CRITICAL: {
    bg: "bg-rose-500/10",
    text: "text-rose-500",
    border: "border-rose-500/20",
    hex: "#f43f5e",
  },
} as const;

export const CHART_COLORS = [
  "#2563eb", // blue
  "#10b981", // emerald
  "#f59e0b", // amber
  "#f43f5e", // rose
  "#8b5cf6", // violet
  "#06b6d4", // cyan
] as const;
