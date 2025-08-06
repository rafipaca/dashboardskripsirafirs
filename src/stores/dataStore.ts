import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { DataStore } from './types';
import { ResearchDataPoint, GWNBRCoefficient, loadResearchData, loadGWNBRCoefficients } from '@/lib/data/research-data';

const initialState = {
  researchData: [],
  coefficients: [],
  isLoading: false,
  error: null,
  lastUpdated: null
};

export const useDataStore = create<DataStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Actions
        setResearchData: (data: ResearchDataPoint[]) => {
          set({ 
            researchData: data,
            lastUpdated: new Date()
          });
        },

        setCoefficients: (coefficients: GWNBRCoefficient[]) => {
          set({ 
            coefficients,
            lastUpdated: new Date()
          });
        },

        setLoading: (loading: boolean) => {
          set({ isLoading: loading });
        },

        setError: (error: string | null) => {
          set({ error });
        },

        setLastUpdated: (date: Date) => {
          set({ lastUpdated: date });
        },

        refreshData: async () => {
          const { setLoading, setError, setResearchData, setCoefficients } = get() as DataStore;
          
          try {
            setLoading(true);
            setError(null);
            
            // Load both datasets in parallel
            const [researchData, coefficients] = await Promise.all([
              loadResearchData(),
              loadGWNBRCoefficients()
            ]);
            
            setResearchData(researchData);
            setCoefficients(coefficients);
          } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
            setError(errorMessage);
          } finally {
            setLoading(false);
          }
        },

        reset: () => {
          set(initialState);
        }
      }),
      {
        name: 'data-store',
        partialize: (state) => ({
          researchData: state.researchData,
          coefficients: state.coefficients,
          lastUpdated: state.lastUpdated
        }),
        // Only persist data for 1 hour
        version: 1,
        migrate: (persistedState: Partial<DataStore>, version: number) => {
          if (version === 0) {
            // Migration logic if needed
            return persistedState;
          }
          return persistedState;
        }
      }
    ),
    {
      name: 'data-store'
    }
  )
);

// Selectors
export const useDataSelectors = () => {
  const store = useDataStore();
  
  return {
    // Basic selectors
    researchData: store.researchData,
    coefficients: store.coefficients,
    isLoading: store.isLoading,
    error: store.error,
    lastUpdated: store.lastUpdated,
    
    // Computed selectors
    hasData: store.researchData.length > 0,
    hasCoefficients: store.coefficients.length > 0,
    hasError: store.error !== null,
    isReady: !store.isLoading && !store.error && store.researchData.length > 0,
    
    // Data statistics
    totalRegions: store.researchData.length,
    totalCases: store.researchData.reduce((sum, item) => sum + (item.Penemuan || 0), 0),
    avgCasesPerRegion: store.researchData.length > 0 
      ? Math.round(store.researchData.reduce((sum, item) => sum + (item.Penemuan || 0), 0) / store.researchData.length)
      : 0,
    
    // Data freshness
    isDataStale: store.lastUpdated 
      ? (Date.now() - store.lastUpdated.getTime()) > (60 * 60 * 1000) // 1 hour
      : true
  };
};

// Helper functions
export const useDataActions = () => {
  const {
    setResearchData,
    setCoefficients,
    setLoading,
    setError,
    refreshData,
    reset
  } = useDataStore();

  return {
    // Basic actions
    setResearchData,
    setCoefficients,
    setLoading,
    setError,
    refreshData,
    reset,
    
    // Helper actions
    getRegionData: (regionName: string): ResearchDataPoint | null => {
      const { researchData } = useDataStore.getState();
      return researchData.find(item => 
        item.NAMOBJ === regionName ||
        item.NAMOBJ?.toLowerCase().includes(regionName.toLowerCase())
      ) || null;
    },
    
    getRegionCoefficients: (regionName: string): GWNBRCoefficient | null => {
      const { coefficients } = useDataStore.getState();
      return coefficients.find(coef => 
        coef.Region === regionName ||
        coef.Region?.toLowerCase().includes(regionName.toLowerCase())
      ) || null;
    },
    
    getTopRegionsByMetric: (metric: keyof ResearchDataPoint, limit: number = 10): ResearchDataPoint[] => {
      const { researchData } = useDataStore.getState();
      return [...researchData]
        .filter(item => item[metric] !== undefined && item[metric] !== null)
        .sort((a, b) => (b[metric] as number) - (a[metric] as number))
        .slice(0, limit);
    },
    
    filterByRiskLevel: (level: 'high' | 'medium' | 'low'): ResearchDataPoint[] => {
      const { researchData } = useDataStore.getState();
      const totalCases = researchData.reduce((sum, item) => sum + (item.Penemuan || 0), 0);
      const avgCases = totalCases / researchData.length;
      
      return researchData.filter(item => {
        const cases = item.Penemuan || 0;
        switch (level) {
          case 'high':
            return cases > avgCases * 1.5;
          case 'medium':
            return cases >= avgCases * 0.5 && cases <= avgCases * 1.5;
          case 'low':
            return cases < avgCases * 0.5;
          default:
            return true;
        }
      });
    }
  };
};