/**
 * Konstanta umum untuk aplikasi dashboard
 * Mengurangi duplikasi nilai yang berulang di berbagai komponen
 */

// Konstanta animasi
export const ANIMATION_CONSTANTS = {
  DURATION: 0.6,
  EASE: [0.4, 0, 0.2, 1] as const,
  STAGGER_DELAY: 0.1,
  HOVER_SCALE: 1.02,
  TAP_SCALE: 0.98,
} as const;

// Konstanta grid layout
export const GRID_LAYOUTS = {
  STATS_GRID: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4",
  COMPARISON_GRID: "grid grid-cols-2 gap-4",
  CORRELATION_GRID: "grid grid-cols-1 md:grid-cols-3 gap-4",
  SUMMARY_GRID: "grid grid-cols-2 md:grid-cols-6 gap-4",
} as const;

// Konstanta warna untuk status
export const STATUS_COLORS = {
  SUCCESS: "text-green-500",
  WARNING: "text-orange-500", 
  ERROR: "text-red-500",
  INFO: "text-blue-500",
  PRIMARY: "text-primary",
  PURPLE: "text-purple-500",
} as const;

// Konstanta background gradients
export const GRADIENTS = {
  PURPLE: "bg-gradient-to-br from-purple-50 to-violet-50",
  BLUE: "bg-gradient-to-br from-blue-50 to-indigo-50",
  GREEN: "bg-gradient-to-br from-green-50 to-emerald-50",
  RED: "bg-gradient-to-br from-red-50 to-rose-50",
  ORANGE: "bg-gradient-to-br from-orange-50 to-amber-50",
} as const;

// Konstanta timeframe default
export const DEFAULT_TIMEFRAME = "6months";

// Konstanta untuk threshold korelasi
export const CORRELATION_THRESHOLDS = {
  STRONG: 0.7,
  MODERATE: 0.5,
  WEAK: 0.3,
} as const;