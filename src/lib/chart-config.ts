import { ChartConfig } from "@/components/ui/chart";

// Bar chart configuration
export const barChartConfig = {
  value: {
    label: "Jumlah Kasus",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

// Pie chart configuration
export const pieChartConfig = {
  "High Risk": { label: "High Risk", color: "var(--risk-high)" },
  "Medium-High Risk": { label: "Medium-High Risk", color: "var(--risk-medium-high)" },
  "Medium Risk": { label: "Medium Risk", color: "var(--risk-medium)" },
  "Low Risk": { label: "Low Risk", color: "var(--risk-low)" },
} satisfies ChartConfig;

// Create line chart configuration dynamically
export const createLineChartConfig = (topRegions: string[]): ChartConfig => {
  const colors = ["var(--primary)", "var(--destructive)", "var(--risk-low)"];
  const config: ChartConfig = {};
  
  topRegions.forEach((region, index) => {
    config[region] = {
      label: region,
      color: colors[index] || "var(--muted-foreground)"
    };
  });
  
  return config;
};

// Chart colors for consistent styling
export const CHART_COLORS = {
  primary: "hsl(var(--chart-1))",
  secondary: "hsl(var(--chart-2))",
  tertiary: "hsl(var(--chart-3))",
  quaternary: "hsl(var(--chart-4))",
  quinary: "hsl(var(--chart-5))",
};

// Risk level colors
export const RISK_COLORS = {
  high: "var(--risk-high)",
  mediumHigh: "var(--risk-medium-high)",
  medium: "var(--risk-medium)",
  low: "var(--risk-low)",
};
