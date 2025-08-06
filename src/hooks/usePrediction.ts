/**
 * Custom hook untuk mengelola prediksi GWNBR
 * Menyediakan data prediksi, interpretasi, dan equation untuk semua region
 */

import { useState, useMemo } from 'react';
import { 
  GWNBRPrediction, 
  PredictionResult, 
  EquationDisplay, 
  RegionInterpretation,
  GlobalModelSummary,
  PredictionFilters,
  ChartDataPoint,
  ModelMetrics
} from '@/types/prediction';
import { 
  calculateGWNBRPrediction,
  calculateConfidenceInterval,
  calculateStandardError,
  calculateModelMetrics,
  calculateGlobalModelMetrics,
  generateEquationDisplay,
  generateRegionInterpretation
} from '@/lib/prediction/gwnbrModel';
import { useResearchData } from './useResearchData';
import { GWNBRCoefficient } from '@/lib/data/research-data';

export interface UsePredictionReturn {
  // Data
  predictions: GWNBRPrediction[];
  equations: EquationDisplay[];
  interpretations: RegionInterpretation[];
  globalSummary: GlobalModelSummary | null;
  chartData: ChartDataPoint[];
  
  // State
  isLoading: boolean;
  error: string | null;
  selectedRegion: string | null;
  filters: PredictionFilters;
  
  // Actions
  selectRegion: (regionId: string | null) => void;
  updateFilters: (newFilters: Partial<PredictionFilters>) => void;
  refreshPredictions: () => void;
  
  // Computed
  filteredPredictions: GWNBRPrediction[];
  selectedRegionData: {
    prediction: GWNBRPrediction | null;
    equation: EquationDisplay | null;
    interpretation: RegionInterpretation | null;
  };
}

const defaultFilters: PredictionFilters = {
  sortBy: 'accuracy',
  viewMode: 'grid',
  showOnlySignificant: false,
  accuracyThreshold: 0.8
};

// Sample data untuk variabel independen (dalam implementasi nyata, ini akan diambil dari data CSV)
// Fungsi untuk mendapatkan data variabel dari data penelitian aktual
const getActualVariables = (regionName: string, researchData: any[]) => {
  const regionData = researchData.find(data => 
    data.NAMOBJ && data.NAMOBJ.toLowerCase() === regionName.toLowerCase()
  );
  
  if (!regionData) {
    console.warn(`Data tidak ditemukan untuk region: ${regionName}`);
    return {
      giziKurang: 0,
      imd: 0,
      rokokPerkapita: 0,
      kepadatan: 0,
      airMinum: 0,
      sanitasi: 0
    };
  }
  
  return {
    giziKurang: regionData.GiziKurang || 0,
    imd: regionData.IMD || 0,
    rokokPerkapita: regionData.RokokPerkapita || 0,
    kepadatan: regionData.Kepadatan || 0,
    airMinum: regionData.AirMinumLayak || regionData.AirMinum || 0,
    sanitasi: regionData.Sanitasi || 0
  };
};

// Fungsi untuk mendapatkan nilai aktual dari data penelitian
const getActualValue = (regionName: string, researchData: any[]): number => {
  const regionData = researchData.find(data => 
    data.NAMOBJ && data.NAMOBJ.toLowerCase() === regionName.toLowerCase()
  );
  
  return regionData?.Penemuan || 0;
};

export function usePrediction(): UsePredictionReturn {
  const { coefficients, rawData, error: dataError } = useResearchData();
  
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [filters, setFilters] = useState<PredictionFilters>(defaultFilters);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Generate predictions untuk semua region
  const predictions = useMemo(() => {
    if (!coefficients || coefficients.length === 0 || !rawData || rawData.length === 0) return [];
    
    setIsLoading(true);
    setError(null);
    
    try {
      const results: GWNBRPrediction[] = coefficients.map((coef: GWNBRCoefficient) => {
        const regionName = coef.Region || 'Unknown Region';
        const variables = getActualVariables(regionName, rawData);
        const actualValue = getActualValue(regionName, rawData);
        
        // Hitung prediksi
        const predictedValue = calculateGWNBRPrediction(coef, variables);
        
        // Hitung standard error dan confidence interval
        const standardError = calculateStandardError(predictedValue, coef.Theta || 1);
        const confidenceInterval = calculateConfidenceInterval(predictedValue, standardError);
        
        // Buat prediction result
        const prediction: PredictionResult = {
          regionName,
          actualValue,
          predictedValue,
          residual: actualValue - predictedValue,
          standardError,
          confidenceInterval,
          predictionDate: new Date().toISOString()
        };
        
        // Hitung local metrics (simplified untuk single data point)
        const residual = actualValue - predictedValue;
        const localMetrics: ModelMetrics = {
          r2: 0, // R² tidak bermakna untuk single point
          rmse: Math.abs(residual),
          mae: Math.abs(residual),
          mape: actualValue !== 0 ? Math.abs(residual / actualValue) * 100 : 0,
          aic: 0,
          bic: 0
        };
        
        return {
          regionId: coef.Region || regionName,
          regionName,
          coefficients: {
            intercept: coef.Intercept,
            giziKurang: coef.GiziKurangKoef,
            imd: coef.IMDKoef,
            rokokPerkapita: coef.RokokPerkapitaKoef,
            kepadatan: coef.KepadatanKoef,
            airMinum: coef.AirMinumKoef,
            sanitasi: coef.SanitasiKoef
          },
          prediction,
          localMetrics
        };
      });
      
      setIsLoading(false);
      return results;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error generating predictions');
      setIsLoading(false);
      return [];
    }
  }, [coefficients, rawData]);
  
  // Generate equations untuk semua region
  const equations = useMemo(() => {
    if (!coefficients || coefficients.length === 0) return [];
    
    return coefficients.map((coef: GWNBRCoefficient) => 
      generateEquationDisplay(coef, coef.Region || 'Unknown Region')
    );
  }, [coefficients]);
  
  // Generate interpretations untuk semua region
  const interpretations = useMemo(() => {
    if (!coefficients || coefficients.length === 0) return [];
    
    return coefficients.map((coef: GWNBRCoefficient) => 
      generateRegionInterpretation(coef, coef.Region || 'Unknown Region')
    );
  }, [coefficients]);
  
  // Generate global summary
  const globalSummary = useMemo((): GlobalModelSummary | null => {
    if (predictions.length === 0) return null;
    
    const actualValues = predictions.map(p => p.prediction.actualValue);
    const predictedValues = predictions.map(p => p.prediction.predictedValue);
    const accuracies = predictions.map(p => {
      const mape = Math.abs((p.prediction.actualValue - p.prediction.predictedValue) / p.prediction.actualValue);
      return 1 - mape; // Convert MAPE to accuracy
    });
    
    const averageAccuracy = accuracies.reduce((sum, acc) => sum + acc, 0) / accuracies.length;
    
    const bestIndex = accuracies.indexOf(Math.max(...accuracies));
    const worstIndex = accuracies.indexOf(Math.min(...accuracies));
    
    // Count significant variables
    const significantCounts = {
      giziKurang: 0,
      imd: 0,
      rokokPerkapita: 0,
      kepadatan: 0,
      airMinum: 0,
      sanitasi: 0
    };
    
    interpretations.forEach(interp => {
      interp.significantFactors.forEach(factor => {
        switch (factor.variableName) {
          case 'Gizi Kurang': significantCounts.giziKurang++; break;
          case 'Inisiasi Menyusu Dini': significantCounts.imd++; break;
          case 'Konsumsi Rokok Per Kapita': significantCounts.rokokPerkapita++; break;
          case 'Kepadatan Penduduk': significantCounts.kepadatan++; break;
          case 'Akses Air Minum Layak': significantCounts.airMinum++; break;
          case 'Akses Sanitasi Layak': significantCounts.sanitasi++; break;
        }
      });
    });
    
    return {
      totalRegions: predictions.length,
      averageAccuracy,
      bestPredictionRegion: predictions[bestIndex]?.regionName || '',
      worstPredictionRegion: predictions[worstIndex]?.regionName || '',
      globalMetrics: calculateGlobalModelMetrics(predictions.map(p => ({
        actualValue: p.prediction.actualValue,
        predictedValue: p.prediction.predictedValue
      }))),
      significantVariablesCount: significantCounts
    };
  }, [predictions, interpretations]);
  
  // Generate chart data
  const chartData = useMemo((): ChartDataPoint[] => {
    return predictions.map(p => ({
      regionName: p.regionName,
      actual: p.prediction.actualValue,
      predicted: p.prediction.predictedValue,
      residual: p.prediction.residual,
      accuracy: 1 - Math.abs(p.prediction.residual / p.prediction.actualValue)
    }));
  }, [predictions]);
  
  // Filter predictions berdasarkan filters
  const filteredPredictions = useMemo(() => {
    let filtered = [...predictions];
    
    // Filter by accuracy threshold
    if (filters.accuracyThreshold > 0) {
      filtered = filtered.filter(p => {
        const accuracy = 1 - Math.abs(p.prediction.residual / p.prediction.actualValue);
        return accuracy >= filters.accuracyThreshold;
      });
    }
    
    // Filter by significant factors only
    if (filters.showOnlySignificant) {
      const regionsWithSignificant = interpretations
        .filter(i => i.significantFactors.length > 0)
        .map(i => i.regionName);
      
      filtered = filtered.filter(p => regionsWithSignificant.includes(p.regionName));
    }
    
    // Sort
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'accuracy':
          const accA = 1 - Math.abs(a.prediction.residual / a.prediction.actualValue);
          const accB = 1 - Math.abs(b.prediction.residual / b.prediction.actualValue);
          return accB - accA;
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
    
    return filtered;
  }, [predictions, interpretations, filters]);
  
  // Selected region data
  const selectedRegionData = useMemo(() => {
    if (!selectedRegion) {
      return { prediction: null, equation: null, interpretation: null };
    }
    
    const prediction = predictions.find(p => p.regionId === selectedRegion || p.regionName === selectedRegion) || null;
    const equation = equations.find(e => e.regionName === selectedRegion || e.regionName === prediction?.regionName) || null;
    const interpretation = interpretations.find(i => i.regionName === selectedRegion || i.regionName === prediction?.regionName) || null;
    
    return { prediction, equation, interpretation };
  }, [selectedRegion, predictions, equations, interpretations]);
  
  // Actions
  const selectRegion = (regionId: string | null) => {
    setSelectedRegion(regionId);
  };
  
  const updateFilters = (newFilters: Partial<PredictionFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };
  
  const refreshPredictions = () => {
    // Force re-computation by updating a dependency
    setSelectedRegion(prev => prev);
  };
  
  return {
    // Data
    predictions,
    equations,
    interpretations,
    globalSummary,
    chartData,
    
    // State
    isLoading,
    error: dataError || error,
    selectedRegion,
    filters,
    
    // Actions
    selectRegion,
    updateFilters,
    refreshPredictions,
    
    // Computed
    filteredPredictions,
    selectedRegionData
  };
}