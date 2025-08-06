import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { PredictionStore } from './types';
import { 
  GWNBRPrediction, 
  PredictionFilters, 
  RegionInterpretation, 
  EquationDisplay, 
  GlobalModelSummary,
  PredictionResult
} from '@/types/prediction';
import { 
  calculateGWNBRPrediction,
  generateEquationDisplay,
  generateRegionInterpretation
} from '@/lib/prediction/gwnbrModel';
import { useDataStore } from './dataStore';

const initialFilters: PredictionFilters = {
  sortBy: 'accuracy',
  viewMode: 'grid',
  showOnlySignificant: false,
  accuracyThreshold: 0.8
};

const initialState = {
  predictions: [],
  equations: [],
  interpretations: [],
  globalSummary: null,
  filters: initialFilters,
  isLoading: false,
  error: null
};

export const usePredictionStore = create<PredictionStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Actions
        setPredictions: (predictions: GWNBRPrediction[]) => {
          set({ predictions });
        },

        setEquations: (equations: EquationDisplay[]) => {
          set({ equations });
        },

        setInterpretations: (interpretations: RegionInterpretation[]) => {
          set({ interpretations });
        },

        setGlobalSummary: (summary: GlobalModelSummary | null) => {
          set({ globalSummary: summary });
        },

        updateFilters: (newFilters: Partial<PredictionFilters>) => {
          set((state) => ({ filters: { ...state.filters, ...newFilters } }));
        },

        setLoading: (loading: boolean) => {
          set({ isLoading: loading });
        },

        setError: (error: string | null) => {
          set({ error });
        },

        refreshPredictions: async () => {
          const { setLoading, setError, setPredictions, setEquations, setInterpretations, setGlobalSummary } = get() as PredictionStore;
          
          try {
            setLoading(true);
            setError(null);
            
            // Get data from data store
            const { researchData, coefficients } = useDataStore.getState();
            
            if (researchData.length === 0 || coefficients.length === 0) {
              throw new Error('Research data or coefficients not available');
            }
            
            // Generate predictions for all regions
            const predictions: GWNBRPrediction[] = [];
            const equations: EquationDisplay[] = [];
            const interpretations: RegionInterpretation[] = [];
            
            for (const regionData of researchData) {
              const regionCoeff = coefficients.find(c => c.Region === regionData.NAMOBJ);
              if (!regionCoeff) continue;

              try {
                const predictedValue = calculateGWNBRPrediction(regionData, regionCoeff);
                if (predictedValue === null) continue;

                const predictionResult: PredictionResult = {
                  regionName: regionData.NAMOBJ,
                  predictedValue: predictedValue,
                  actualValue: regionData.Penemuan,
                  residual: regionData.Penemuan - predictedValue,
                  standardError: 0, // Placeholder
                  confidenceInterval: { lower: 0, upper: 0 }, // Placeholder
                  predictionDate: new Date().toISOString(), // Placeholder
                };

                const newPrediction: GWNBRPrediction = {
                  regionId: regionData.No,
                  regionName: regionData.NAMOBJ,
                  prediction: predictionResult,
                  coefficients: {
                    intercept: regionCoeff.Intercept,
                    giziKurang: regionCoeff.GiziKurangKoef,
                    imd: regionCoeff.IMDKoef,
                    rokokPerkapita: regionCoeff.RokokPerkapitaKoef,
                    kepadatan: regionCoeff.KepadatanKoef,
                    airMinum: regionCoeff.AirMinumKoef,
                    sanitasi: regionCoeff.SanitasiKoef,
                  },
                  localMetrics: {
                    r2: 0, // Placeholder
                    aic: 0, // Placeholder
                    bic: 0, // Placeholder
                    rmse: 0, // Placeholder
                    mae: 0, // Placeholder
                    mape: 0, // Placeholder
                  }
                };
                predictions.push(newPrediction);

                const equation = generateEquationDisplay(regionCoeff, regionData.NAMOBJ);
                equations.push(equation);

                const interpretation = generateRegionInterpretation(regionCoeff, predictedValue);
                interpretations.push(interpretation);
              } catch (regionError) {
                console.warn(`Failed to process region ${regionData.NAMOBJ}:`, regionError);
              }
            }
            
            // Calculate global summary
            const globalSummary: GlobalModelSummary = {
              totalRegions: predictions.length,
              averageAccuracy: predictions.reduce((sum, p) => {
                const accuracy = 1 - Math.abs(p.prediction.residual) / p.prediction.actualValue;
                return sum + Math.max(0, accuracy);
              }, 0) / predictions.length,
              bestPredictionRegion: predictions.reduce((best, current) => {
                const currentAccuracy = 1 - Math.abs(current.prediction.residual) / current.prediction.actualValue;
                const bestAccuracy = 1 - Math.abs(best.prediction.residual) / best.prediction.actualValue;
                return currentAccuracy > bestAccuracy ? current : best;
              }).regionName,
              worstPredictionRegion: predictions.reduce((worst, current) => {
                const currentAccuracy = 1 - Math.abs(current.prediction.residual) / current.prediction.actualValue;
                const worstAccuracy = 1 - Math.abs(worst.prediction.residual) / worst.prediction.actualValue;
                return currentAccuracy < worstAccuracy ? current : worst;
              }).regionName,
              globalMetrics: {
                r2: 0.85, // These would be calculated from actual model
                rmse: 0,
                mae: 0,
                mape: 0,
                aic: 0,
                bic: 0
              },
              significantVariablesCount: {
                giziKurang: equations.filter(e => e.coefficients.giziKurang.significant).length,
                imd: equations.filter(e => e.coefficients.imd.significant).length,
                rokokPerkapita: equations.filter(e => e.coefficients.rokokPerkapita.significant).length,
                kepadatan: equations.filter(e => e.coefficients.kepadatan.significant).length,
                airMinum: equations.filter(e => e.coefficients.airMinum.significant).length,
                sanitasi: equations.filter(e => e.coefficients.sanitasi.significant).length
              }
            };
            
            setPredictions(predictions);
            setEquations(equations);
            setInterpretations(interpretations);
            setGlobalSummary(globalSummary);
            
          } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to generate predictions';
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
        name: 'prediction-store',
        partialize: (state: PredictionStore) => ({ filters: state.filters })
      }
    )
  )
);

// Selectors
export const usePredictionSelectors = () => {
  const store = usePredictionStore();
  
  const filteredPredictions = store.predictions.filter(prediction => {
    if (store.filters.showOnlySignificant) {
      const equation = store.equations.find(e => e.regionName === prediction.regionName);
      if (!equation) return false;
      
      const hasSignificantFactors = Object.values(equation.coefficients)
        .some(coeff => coeff.significant);
      if (!hasSignificantFactors) return false;
    }
    
    const accuracy = 1 - Math.abs(prediction.prediction.residual) / prediction.prediction.actualValue;
    if (accuracy < store.filters.accuracyThreshold) return false;
    
    return true;
  }).sort((a, b) => {
    switch (store.filters.sortBy) {
      case 'accuracy':
        const accuracyA = 1 - Math.abs(a.prediction.residual) / a.prediction.actualValue;
        const accuracyB = 1 - Math.abs(b.prediction.residual) / b.prediction.actualValue;
        return accuracyB - accuracyA;
      case 'residual':
        return Math.abs(a.prediction.residual) - Math.abs(b.prediction.residual);
      case 'region':
        return a.regionName.localeCompare(b.regionName);
      case 'predicted':
        return b.prediction.predictedValue - a.prediction.predictedValue;
      case 'actual':
        return b.prediction.actualValue - a.prediction.actualValue;
      default:
        return 0;
    }
  });
  
  return {
    // Basic selectors
    predictions: store.predictions,
    equations: store.equations,
    interpretations: store.interpretations,
    globalSummary: store.globalSummary,
    filters: store.filters,
    isLoading: store.isLoading,
    error: store.error,
    
    // Computed selectors
    filteredPredictions,
    hasPredictions: store.predictions.length > 0,
    hasError: store.error !== null,
    isReady: !store.isLoading && !store.error && store.predictions.length > 0,
    
    // Statistics
    totalPredictions: store.predictions.length,
    filteredCount: filteredPredictions.length,
    averageAccuracy: store.globalSummary?.averageAccuracy || 0
  };
};

// Helper functions
export const usePredictionActions = () => {
  const {
    setPredictions,
    setEquations,
    setInterpretations,
    setGlobalSummary,
    updateFilters,
    setLoading,
    setError,
    refreshPredictions,
    reset
  } = usePredictionStore();

  return {
    // Basic actions
    setPredictions,
    setEquations,
    setInterpretations,
    setGlobalSummary,
    updateFilters,
    setLoading,
    setError,
    refreshPredictions,
    reset,
    
    // Helper actions
    getPredictionByRegion: (regionName: string): GWNBRPrediction | null => {
      const { predictions } = usePredictionStore.getState();
      return predictions.find(p => p.regionName === regionName) || null;
    },
    
    getEquationByRegion: (regionName: string): EquationDisplay | null => {
      const { equations } = usePredictionStore.getState();
      return equations.find(e => e.regionName === regionName) || null;
    },
    
    getInterpretationByRegion: (regionName: string): RegionInterpretation | null => {
      const { interpretations } = usePredictionStore.getState();
      return interpretations.find(i => i.regionName === regionName) || null;
    },
    
    resetFilters: () => {
      updateFilters(initialFilters);
    }
  };
};