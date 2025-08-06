import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { DashboardStore } from './types';
import { DashboardFilters, DashboardMetrics } from '@/types/dashboard';

const initialState = {
  selectedRegion: null,
  selectedPredictionRegion: null,
  activeLayer: 'signifikansi',
  filters: {
    selectedRegion: null,
    selectedTimeframe: 'all'
  } as DashboardFilters,
  metrics: null,
  isLoading: false,
  error: null
};

export const useDashboardStore = create<DashboardStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Actions
        setSelectedRegion: (region) => {
          set(
            (state) => ({
              selectedRegion: region,
              filters: { ...state.filters, selectedRegion: region },
            }),
            false,
            'setSelectedRegion'
          );
        },

        setSelectedPredictionRegion: (region) => {
          set({ selectedPredictionRegion: region }, false, 'setSelectedPredictionRegion');
        },

        setActiveLayer: (layer) => {
          set({ activeLayer: layer }, false, 'setActiveLayer');
        },

        updateFilters: (newFilters) => {
          set(
            (state) => ({
              filters: { ...state.filters, ...newFilters },
            }),
            false,
            'updateFilters'
          );
        },

        setMetrics: (metrics) => {
          set({ metrics }, false, 'setMetrics');
        },

        setLoading: (loading) => {
          set({ isLoading: loading }, false, 'setLoading');
        },

        setError: (error) => {
          set({ error }, false, 'setError');
        },

        reset: () => {
          set(initialState, false, 'reset');
        },
      }),
      {
        name: 'dashboard-store',
        partialize: (state) => ({
          selectedRegion: state.selectedRegion,
          activeLayer: state.activeLayer,
          filters: state.filters,
        }),
      }
    ),
    { name: 'DashboardStore' }
  )
);

// Selectors
export const useDashboardSelectors = () => {
  const store = useDashboardStore();
  
  return {
    // Basic selectors
    selectedRegion: store.selectedRegion,
    selectedPredictionRegion: store.selectedPredictionRegion,
    activeLayer: store.activeLayer,
    filters: store.filters,
    metrics: store.metrics,
    isLoading: store.isLoading,
    error: store.error,
    
    // Computed selectors
    hasSelectedRegion: store.selectedRegion !== null,
    hasError: store.error !== null,
    isReady: !store.isLoading && !store.error
  };
};