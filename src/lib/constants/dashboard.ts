export const DASHBOARD_CONSTANTS = {
  TIME_FRAMES: [
    { value: "1m", label: "1 Bulan", months: 1 },
    { value: "3m", label: "3 Bulan", months: 3 },
    { value: "6m", label: "6 Bulan", months: 6 },
    { value: "1y", label: "1 Tahun", months: 12 },
    { value: "all", label: "Semua Data", months: 0 },
  ] as const,

  COLORS: {
    primary: "hsl(var(--primary))",
    secondary: "hsl(var(--secondary))",
    accent: "hsl(var(--accent))",
    destructive: "hsl(var(--destructive))",
    chart: [
      "#3b82f6", // blue-500
      "#ef4444", // red-500
      "#22c55e", // green-500
      "#f97316", // orange-500
      "#8b5cf6", // purple-500
      "#ec4899", // pink-500
    ],
  },

  API: {
    GEOJSON_URL: "/data/rbipulaujawa.geojson",
    MAX_RETRIES: 3,
    RETRY_DELAY_MS: 3000,
  },
} as const;
