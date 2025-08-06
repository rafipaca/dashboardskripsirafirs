import { Feature, FeatureCollection } from 'geojson';
import { ResearchDataPoint, GWNBRCoefficient } from '@/lib/data/research-data';
import { GWNBRPrediction, PredictionFilters, RegionInterpretation, EquationDisplay, GlobalModelSummary } from '@/types/prediction';
import { DashboardFilters, DashboardMetrics } from '@/types/dashboard';

// Dashboard Store Types
export interface DashboardState {
  selectedRegion: string | null;
  selectedPredictionRegion: string | null;
  activeLayer: string;
  filters: DashboardFilters;
  metrics: DashboardMetrics | null;
  isLoading: boolean;
  error: string | null;
}

export interface DashboardActions {
  setSelectedRegion: (region: string | null) => void;
  setSelectedPredictionRegion: (region: string | null) => void;
  setActiveLayer: (layer: string) => void;
  updateFilters: (filters: Partial<DashboardFilters>) => void;
  setMetrics: (metrics: DashboardMetrics) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

// Map Store Types
export interface MapState {
  geojsonData: FeatureCollection | null;
  selectedFeature: Feature | null;
  mapCenter: [number, number];
  mapZoom: number;
  isLoading: boolean;
  error: string | null;
}

export interface MapActions {
  setGeojsonData: (data: FeatureCollection | null) => void;
  setSelectedFeature: (feature: Feature | null) => void;
  setMapCenter: (center: [number, number]) => void;
  setMapZoom: (zoom: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

// Data Store Types
export interface DataState {
  researchData: ResearchDataPoint[];
  coefficients: GWNBRCoefficient[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export interface DataActions {
  setResearchData: (data: ResearchDataPoint[]) => void;
  setCoefficients: (coefficients: GWNBRCoefficient[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setLastUpdated: (date: Date) => void;
  refreshData: () => Promise<void>;
  reset: () => void;
}

// Prediction Store Types
export interface PredictionState {
  predictions: GWNBRPrediction[];
  equations: EquationDisplay[];
  interpretations: RegionInterpretation[];
  globalSummary: GlobalModelSummary | null;
  filters: PredictionFilters;
  isLoading: boolean;
  error: string | null;
}

export interface PredictionActions {
  setPredictions: (predictions: GWNBRPrediction[]) => void;
  setEquations: (equations: EquationDisplay[]) => void;
  setInterpretations: (interpretations: RegionInterpretation[]) => void;
  setGlobalSummary: (summary: GlobalModelSummary | null) => void;
  updateFilters: (filters: Partial<PredictionFilters>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  refreshPredictions: () => Promise<void>;
  reset: () => void;
}

// UI Store Types
export interface UIState {
  theme: 'light' | 'dark' | 'system';
  sidebarOpen: boolean;
  activeTab: string;
  notifications: Notification[];
  modals: {
    equationModal: boolean;
    interpretationModal: boolean;
    settingsModal: boolean;
  };
}

export interface UIActions {
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setActiveTab: (tab: string) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  openModal: (modal: keyof UIState['modals']) => void;
  closeModal: (modal: keyof UIState['modals']) => void;
  closeAllModals: () => void;
  reset: () => void;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  timestamp: Date;
}

// Combined Store Types
export type DashboardStore = DashboardState & DashboardActions;
export type MapStore = MapState & MapActions;
export type DataStore = DataState & DataActions;
export type PredictionStore = PredictionState & PredictionActions;
export type UIStore = UIState & UIActions;