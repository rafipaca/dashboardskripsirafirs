export interface DashboardFilters {
  selectedRegion: string | null;
  selectedTimeframe: string;
}

export interface DashboardState extends DashboardFilters {
  isLoading: boolean;
  error: string | null;
}

export interface TimeframeOption {
  value: string;
  label: string;
  months: number;
}

export interface RegionData {
  id: string;
  name: string;
  value: number;
  coordinates: [number, number];
}

export interface ChartData {
  label: string;
  value: number;
  color?: string;
}

export interface MapFeature {
  id: string;
  name: string;
  properties: Record<string, unknown>;
  geometry: GeoJSON.Geometry;
}

export interface DashboardMetrics {
  totalCases: number;
  activeCases: number;
  recoveryRate: number;
  mortalityRate: number;
  lastUpdated: string;
}
