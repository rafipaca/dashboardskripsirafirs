/**
 * Type definitions untuk fitur prediksi GWNBR
 * Analisis spasial kasus pneumonia balita
 */

export interface PredictionResult {
  regionName: string;
  actualValue: number;
  predictedValue: number;
  residual: number;
  standardError: number;
  confidenceInterval: {
    lower: number;
    upper: number;
  };
  predictionDate: string;
}

export interface ModelMetrics {
  r2: number;
  rmse: number;
  mae: number;
  mape: number;
  aic: number;
  bic: number;
}

export interface GWNBRPrediction {
  regionId: string;
  regionName: string;
  coefficients: {
    intercept: number;
    giziKurang: number;
    imd: number;
    rokokPerkapita: number;
    kepadatan: number;
    airMinum: number;
    sanitasi: number;
  };
  prediction: PredictionResult;
  localMetrics: ModelMetrics;
}

export interface EquationDisplay {
  regionName: string;
  coefficients: {
    intercept: { value: number; zValue: number; significant: boolean };
    giziKurang: { value: number; zValue: number; significant: boolean };
    imd: { value: number; zValue: number; significant: boolean };
    rokokPerkapita: { value: number; zValue: number; significant: boolean };
    kepadatan: { value: number; zValue: number; significant: boolean };
    airMinum: { value: number; zValue: number; significant: boolean };
    sanitasi: { value: number; zValue: number; significant: boolean };
  };
  theta: number;
  equation: string;
}

export interface InterpretationResult {
  variableName: string;
  coefficient: number;
  zValue: number;
  isSignificant: boolean;
  effect: 'meningkatkan' | 'menurunkan';
  magnitude: 'rendah' | 'sedang' | 'tinggi';
  percentChange: string;
  interpretation: string;
  implication: string;
}

export interface RegionInterpretation {
  regionName: string;
  interpretations: InterpretationResult[];
  significantFactors: InterpretationResult[];
  dominantFactor: InterpretationResult | null;
  recommendations: string[];
  summary: string;
}

export interface PredictionFilters {
  sortBy: 'accuracy' | 'residual' | 'region' | 'predicted' | 'actual';
  viewMode: 'grid' | 'chart' | 'table';
  showOnlySignificant: boolean;
  accuracyThreshold: number;
}

export interface ChartDataPoint {
  regionName: string;
  actual: number;
  predicted: number;
  residual: number;
  accuracy: number;
}

export interface GlobalModelSummary {
  totalRegions: number;
  averageAccuracy: number;
  bestPredictionRegion: string;
  worstPredictionRegion: string;
  globalMetrics: ModelMetrics;
  significantVariablesCount: {
    giziKurang: number;
    imd: number;
    rokokPerkapita: number;
    kepadatan: number;
    airMinum: number;
    sanitasi: number;
  };
}