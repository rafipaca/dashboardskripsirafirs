# Rancangan Detail Fitur Dashboard Analisis GWNBR

## Overview
Dokumen ini berisi rancangan detail untuk menambahkan fitur-fitur baru pada Dashboard Analisis GWNBR (Geographically Weighted Negative Binomial Regression) untuk analisis spasial kasus pneumonia balita di Pulau Jawa.

## Fitur yang Akan Ditambahkan

### 1. Prediksi Model per Daerah (Ongoing)
### 2. Menampilkan Persamaan Ketika Daerah Diklik pada Card (Ongoing)
### 3. Interpretasi Persamaan

---

## 1. PREDIKSI MODEL PER DAERAH

### 1.1 Struktur Data Prediksi

#### File Baru yang Diperlukan:
```
src/
├── lib/
│   ├── prediction/
│   │   ├── gwnbrModel.ts          # Core GWNBR prediction logic
│   │   ├── predictionUtils.ts     # Utility functions for predictions
│   │   └── modelValidation.ts     # Model validation and metrics
│   └── data/
│       └── predictionData.ts      # Data processing for predictions
├── components/
│   ├── prediction/
│   │   ├── PredictionCard.tsx     # Card untuk menampilkan prediksi
│   │   ├── PredictionChart.tsx    # Chart prediksi vs aktual
│   │   ├── ModelMetrics.tsx       # Metrics model (R², RMSE, dll)
│   │   └── PredictionTable.tsx    # Tabel detail prediksi
│   └── cards/
│       └── RegionPredictionCard.tsx # Card prediksi spesifik daerah
├── hooks/
│   ├── usePrediction.ts           # Hook untuk prediksi data
│   └── useModelMetrics.ts         # Hook untuk metrics model
└── types/
    └── prediction.ts              # Type definitions untuk prediksi
```

#### Interface Types (`src/types/prediction.ts`):
```typescript
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
```

### 1.2 Implementasi Core Prediction Logic

#### `src/lib/prediction/gwnbrModel.ts`:
```typescript
import { ResearchDataPoint, GWNBRCoefficient } from '@/lib/data/research-data';
import { PredictionResult, GWNBRPrediction } from '@/types/prediction';

/**
 * Menghitung prediksi GWNBR untuk satu daerah
 */
export function calculateGWNBRPrediction(
  regionData: ResearchDataPoint,
  coefficients: GWNBRCoefficient
): PredictionResult {
  // Implementasi rumus GWNBR:
  // ln(μᵢ) = β₀ᵢ + β₁ᵢX₁ᵢ + β₂ᵢX₂ᵢ + ... + βₖᵢXₖᵢ
  
  const linearPredictor = 
    coefficients.Intercept +
    coefficients.GiziKurangKoef * regionData.GiziKurang +
    coefficients.IMDKoef * regionData.IMD +
    coefficients.RokokPerkapitaKoef * regionData.RokokPerkapita +
    coefficients.KepadatanKoef * regionData.Kepadatan +
    coefficients.AirMinumKoef * regionData.AirMinumLayak +
    coefficients.SanitasiKoef * regionData.Sanitasi;
  
  const predictedValue = Math.exp(linearPredictor);
  const actualValue = regionData.Penemuan;
  const residual = actualValue - predictedValue;
  
  // Hitung confidence interval (95%)
  const standardError = calculateStandardError(coefficients, regionData);
  const criticalValue = 1.96; // untuk 95% CI
  
  return {
    regionName: regionData.NAMOBJ,
    actualValue,
    predictedValue,
    residual,
    standardError,
    confidenceInterval: {
      lower: predictedValue - (criticalValue * standardError),
      upper: predictedValue + (criticalValue * standardError)
    },
    predictionDate: new Date().toISOString()
  };
}

/**
 * Menghitung prediksi untuk semua daerah
 */
export function calculateAllPredictions(
  researchData: ResearchDataPoint[],
  coefficientsData: GWNBRCoefficient[]
): GWNBRPrediction[] {
  return researchData.map(regionData => {
    const coefficients = coefficientsData.find(
      coef => coef.Region === regionData.NAMOBJ
    );
    
    if (!coefficients) {
      throw new Error(`Coefficients not found for region: ${regionData.NAMOBJ}`);
    }
    
    const prediction = calculateGWNBRPrediction(regionData, coefficients);
    
    return {
      regionId: regionData.No.toString(),
      regionName: regionData.NAMOBJ,
      coefficients: {
        intercept: coefficients.Intercept,
        giziKurang: coefficients.GiziKurangKoef,
        imd: coefficients.IMDKoef,
        rokokPerkapita: coefficients.RokokPerkapitaKoef,
        kepadatan: coefficients.KepadatanKoef,
        airMinum: coefficients.AirMinumKoef,
        sanitasi: coefficients.SanitasiKoef
      },
      prediction,
      localMetrics: calculateLocalMetrics(prediction)
    };
  });
}
```

### 1.3 Hook untuk Prediksi (`src/hooks/usePrediction.ts`):
```typescript
import { useState, useEffect, useMemo } from 'react';
import { useResearchData } from './useResearchData';
import { calculateAllPredictions } from '@/lib/prediction/gwnbrModel';
import { GWNBRPrediction } from '@/types/prediction';

export function usePrediction() {
  const { rawData, coefficients, loading, error } = useResearchData();
  const [predictions, setPredictions] = useState<GWNBRPrediction[]>([]);
  const [predictionLoading, setPredictionLoading] = useState(false);
  const [predictionError, setPredictionError] = useState<string | null>(null);
  
  useEffect(() => {
    if (rawData && coefficients && !loading) {
      setPredictionLoading(true);
      try {
        const allPredictions = calculateAllPredictions(rawData, coefficients);
        setPredictions(allPredictions);
        setPredictionError(null);
      } catch (err) {
        setPredictionError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setPredictionLoading(false);
      }
    }
  }, [rawData, coefficients, loading]);
  
  const getPredictionByRegion = useMemo(() => {
    return (regionName: string) => {
      return predictions.find(p => 
        p.regionName.toLowerCase().includes(regionName.toLowerCase())
      );
    };
  }, [predictions]);
  
  const globalMetrics = useMemo(() => {
    if (predictions.length === 0) return null;
    
    const actualValues = predictions.map(p => p.prediction.actualValue);
    const predictedValues = predictions.map(p => p.prediction.predictedValue);
    
    return calculateGlobalMetrics(actualValues, predictedValues);
  }, [predictions]);
  
  return {
    predictions,
    getPredictionByRegion,
    globalMetrics,
    loading: loading || predictionLoading,
    error: error || predictionError
  };
}
```

### 1.4 Komponen Prediksi

#### `src/components/prediction/PredictionCard.tsx`:
```typescript
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Target } from 'lucide-react';
import { GWNBRPrediction } from '@/types/prediction';

interface PredictionCardProps {
  prediction: GWNBRPrediction;
  showDetails?: boolean;
}

export default function PredictionCard({ prediction, showDetails = false }: PredictionCardProps) {
  const { prediction: pred, regionName } = prediction;
  const accuracy = ((1 - Math.abs(pred.residual) / pred.actualValue) * 100).toFixed(1);
  const isOverPredicted = pred.predictedValue > pred.actualValue;
  
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{regionName}</CardTitle>
          <Badge variant={isOverPredicted ? "destructive" : "default"}>
            {isOverPredicted ? (
              <TrendingUp className="w-3 h-3 mr-1" />
            ) : (
              <TrendingDown className="w-3 h-3 mr-1" />
            )}
            {accuracy}% akurat
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">Aktual</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {pred.actualValue.toLocaleString()}
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-muted-foreground">Prediksi</span>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {Math.round(pred.predictedValue).toLocaleString()}
            </p>
          </div>
        </div>
        
        {showDetails && (
          <div className="mt-4 pt-4 border-t">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Residual:</span>
                <span className="ml-2 font-medium">
                  {pred.residual > 0 ? '+' : ''}{Math.round(pred.residual)}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">SE:</span>
                <span className="ml-2 font-medium">
                  {pred.standardError.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="mt-2 text-sm">
              <span className="text-muted-foreground">95% CI:</span>
              <span className="ml-2 font-medium">
                [{Math.round(pred.confidenceInterval.lower)}, {Math.round(pred.confidenceInterval.upper)}]
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

---

## 2. MENAMPILKAN PERSAMAAN KETIKA DAERAH DIKLIK

### 2.1 Komponen Persamaan

#### `src/components/cards/EquationCard.tsx`:
```typescript
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Info } from 'lucide-react';
import { GWNBRCoefficient } from '@/lib/data/research-data';
import { toast } from 'sonner';

interface EquationCardProps {
  regionName: string;
  coefficients: GWNBRCoefficient;
  onInterpretation?: () => void;
}

export default function EquationCard({ 
  regionName, 
  coefficients, 
  onInterpretation 
}: EquationCardProps) {
  
  const formatCoefficient = (value: number, showSign: boolean = true) => {
    const formatted = Math.abs(value).toFixed(4);
    if (!showSign) return formatted;
    return value >= 0 ? `+ ${formatted}` : `- ${formatted}`;
  };
  
  const getSignificanceBadge = (zValue: number) => {
    const absZ = Math.abs(zValue);
    if (absZ >= 2.58) return { label: '***', color: 'destructive', level: '1%' };
    if (absZ >= 1.96) return { label: '**', color: 'default', level: '5%' };
    if (absZ >= 1.65) return { label: '*', color: 'secondary', level: '10%' };
    return { label: 'ns', color: 'outline', level: 'tidak signifikan' };
  };
  
  const copyEquation = () => {
    const equation = `ln(μ) = ${coefficients.Intercept.toFixed(4)} ${formatCoefficient(coefficients.GiziKurangKoef)}(GiziKurang) ${formatCoefficient(coefficients.IMDKoef)}(IMD) ${formatCoefficient(coefficients.RokokPerkapitaKoef)}(RokokPerkapita) ${formatCoefficient(coefficients.KepadatanKoef)}(Kepadatan) ${formatCoefficient(coefficients.AirMinumKoef)}(AirMinum) ${formatCoefficient(coefficients.SanitasiKoef)}(Sanitasi)`;
    
    navigator.clipboard.writeText(equation);
    toast.success('Persamaan berhasil disalin!');
  };
  
  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            Persamaan GWNBR - {regionName}
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={copyEquation}>
              <Copy className="w-4 h-4 mr-1" />
              Salin
            </Button>
            {onInterpretation && (
              <Button variant="outline" size="sm" onClick={onInterpretation}>
                <Info className="w-4 h-4 mr-1" />
                Interpretasi
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Persamaan Matematis */}
        <div className="bg-muted/50 p-4 rounded-lg mb-4">
          <div className="font-mono text-sm leading-relaxed">
            <div className="mb-2 text-center font-semibold">ln(μ) = β₀ + β₁X₁ + β₂X₂ + β₃X₃ + β₄X₄ + β₅X₅ + β₆X₆</div>
            <div className="text-center">
              ln(μ) = <span className="font-bold">{coefficients.Intercept.toFixed(4)}</span>
              <span className="text-blue-600"> {formatCoefficient(coefficients.GiziKurangKoef)}(GiziKurang)</span>
              <span className="text-green-600"> {formatCoefficient(coefficients.IMDKoef)}(IMD)</span>
              <span className="text-purple-600"> {formatCoefficient(coefficients.RokokPerkapitaKoef)}(RokokPerkapita)</span>
              <span className="text-orange-600"> {formatCoefficient(coefficients.KepadatanKoef)}(Kepadatan)</span>
              <span className="text-cyan-600"> {formatCoefficient(coefficients.AirMinumKoef)}(AirMinum)</span>
              <span className="text-pink-600"> {formatCoefficient(coefficients.SanitasiKoef)}(Sanitasi)</span>
            </div>
          </div>
        </div>
        
        {/* Tabel Koefisien */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Detail Koefisien dan Signifikansi:</h4>
          <div className="grid gap-2">
            {[
              { name: 'Intercept (β₀)', coef: coefficients.Intercept, z: coefficients.InterceptZ },
              { name: 'Gizi Kurang (β₁)', coef: coefficients.GiziKurangKoef, z: coefficients.GiziKurangZ },
              { name: 'IMD (β₂)', coef: coefficients.IMDKoef, z: coefficients.IMDZ },
              { name: 'Rokok Perkapita (β₃)', coef: coefficients.RokokPerkapitaKoef, z: coefficients.RokokPerkapitaZ },
              { name: 'Kepadatan (β₄)', coef: coefficients.KepadatanKoef, z: coefficients.KepadatanZ },
              { name: 'Air Minum (β₅)', coef: coefficients.AirMinumKoef, z: coefficients.AirMinumZ },
              { name: 'Sanitasi (β₆)', coef: coefficients.SanitasiKoef, z: coefficients.SanitasiZ }
            ].map((item, index) => {
              const significance = getSignificanceBadge(item.z);
              return (
                <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                  <span className="text-sm font-medium">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm">{item.coef.toFixed(4)}</span>
                    <span className="text-xs text-muted-foreground">(Z: {item.z.toFixed(2)})</span>
                    <Badge variant={significance.color as any} className="text-xs">
                      {significance.label}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Parameter Theta */}
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Parameter Dispersi (θ):</span>
            <span className="font-mono font-bold">{coefficients.Theta.toFixed(4)}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Parameter untuk mengatasi overdispersi dalam model Negative Binomial
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
```

### 2.2 Integrasi dengan Map Component

#### Update `src/components/maps/MapClient.tsx`:
```typescript
// Tambahkan state untuk equation modal
const [showEquation, setShowEquation] = useState(false);
const [selectedRegionCoefficients, setSelectedRegionCoefficients] = useState<GWNBRCoefficient | null>(null);

// Update click handler
click: (e: L.LeafletMouseEvent) => {
  const regionName = properties?.NAMOBJ || properties?.WADMKK || properties?.NAME_2 || "Unknown";
  
  // Find coefficients for selected region
  const coefficients = coefficientsData?.find(
    coef => coef.Region === regionName
  );
  
  if (coefficients) {
    setSelectedRegionCoefficients(coefficients);
    setShowEquation(true);
  }
  
  // Existing click logic...
}
```

---

## 3. INTERPRETASI PERSAMAAN

### 3.1 Komponen Interpretasi

#### `src/components/prediction/InterpretationCard.tsx`:
```typescript
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingUp, TrendingDown, AlertTriangle, Info } from 'lucide-react';
import { GWNBRCoefficient } from '@/lib/data/research-data';

interface InterpretationCardProps {
  regionName: string;
  coefficients: GWNBRCoefficient;
}

export default function InterpretationCard({ regionName, coefficients }: InterpretationCardProps) {
  
  const interpretCoefficient = (coef: number, zValue: number, variableName: string) => {
    const isSignificant = Math.abs(zValue) >= 1.96;
    const effect = coef > 0 ? 'meningkatkan' : 'menurunkan';
    const magnitude = Math.abs(coef);
    const percentChange = ((Math.exp(coef) - 1) * 100).toFixed(1);
    
    let magnitudeLevel = 'rendah';
    if (magnitude > 0.1) magnitudeLevel = 'tinggi';
    else if (magnitude > 0.05) magnitudeLevel = 'sedang';
    
    return {
      effect,
      magnitude,
      magnitudeLevel,
      percentChange,
      isSignificant,
      interpretation: isSignificant 
        ? `Setiap peningkatan 1 unit ${variableName} akan ${effect} jumlah kasus pneumonia sebesar ${percentChange}% (efek ${magnitudeLevel}).`
        : `${variableName} tidak memiliki pengaruh yang signifikan terhadap kasus pneumonia di daerah ini.`
    };
  };
  
  const variables = [
    { name: 'Gizi Kurang', coef: coefficients.GiziKurangKoef, z: coefficients.GiziKurangZ, unit: 'kasus per 1000 balita' },
    { name: 'IMD (Inisiasi Menyusu Dini)', coef: coefficients.IMDKoef, z: coefficients.IMDZ, unit: 'persen' },
    { name: 'Konsumsi Rokok Perkapita', coef: coefficients.RokokPerkapitaKoef, z: coefficients.RokokPerkapitaZ, unit: 'batang per hari' },
    { name: 'Kepadatan Penduduk', coef: coefficients.KepadatanKoef, z: coefficients.KepadatanZ, unit: 'jiwa per km²' },
    { name: 'Akses Air Minum Layak', coef: coefficients.AirMinumKoef, z: coefficients.AirMinumZ, unit: 'persen' },
    { name: 'Akses Sanitasi Layak', coef: coefficients.SanitasiKoef, z: coefficients.SanitasiZ, unit: 'persen' }
  ];
  
  const interpretations = variables.map(variable => ({
    ...variable,
    ...interpretCoefficient(variable.coef, variable.z, variable.name)
  }));
  
  const significantFactors = interpretations.filter(item => item.isSignificant);
  const dominantFactor = significantFactors.reduce((prev, current) => 
    Math.abs(current.coef) > Math.abs(prev.coef) ? current : prev
  , significantFactors[0]);
  
  return (
    <Card className="border-2 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="w-5 h-5 text-blue-500" />
          Interpretasi Model GWNBR - {regionName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Ringkasan Eksekutif */}
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Ringkasan:</strong> Di {regionName}, terdapat {significantFactors.length} faktor yang berpengaruh signifikan terhadap kasus pneumonia balita.
            {dominantFactor && (
              <> Faktor dominan adalah <strong>{dominantFactor.name}</strong> dengan efek {dominantFactor.magnitudeLevel}.
            )}
          </AlertDescription>
        </Alert>
        
        {/* Interpretasi per Variabel */}
        <div className="space-y-4">
          <h4 className="font-semibold text-lg">Interpretasi Koefisien:</h4>
          {interpretations.map((item, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-medium flex items-center gap-2">
                  {item.effect === 'meningkatkan' ? (
                    <TrendingUp className="w-4 h-4 text-red-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-green-500" />
                  )}
                  {item.name}
                </h5>
                <div className="flex gap-2">
                  <Badge variant={item.isSignificant ? "default" : "outline"}>
                    {item.isSignificant ? "Signifikan" : "Tidak Signifikan"}
                  </Badge>
                  <Badge variant="secondary">
                    {item.magnitudeLevel}
                  </Badge>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-2">
                Koefisien: {item.coef.toFixed(4)} | Z-value: {item.z.toFixed(2)} | Unit: {item.unit}
              </p>
              
              <p className="text-sm">{item.interpretation}</p>
              
              {item.isSignificant && (
                <div className="mt-2 p-2 bg-muted/50 rounded text-xs">
                  <strong>Implikasi Praktis:</strong> {getImplication(item.name, item.effect, item.percentChange)}
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Rekomendasi */}
        <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
          <h4 className="font-semibold text-lg mb-2">Rekomendasi Intervensi:</h4>
          <ul className="space-y-2 text-sm">
            {generateRecommendations(significantFactors).map((rec, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Model Fit Information */}
        <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Informasi Model:</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Parameter Dispersi (θ):</span>
              <span className="ml-2 font-mono">{coefficients.Theta.toFixed(4)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Variabel Signifikan:</span>
              <span className="ml-2 font-medium">{significantFactors.length}/6</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Model ini menjelaskan variasi lokal dalam kasus pneumonia balita dengan mempertimbangkan heterogenitas spasial.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper functions
function getImplication(variableName: string, effect: string, percentChange: string): string {
  const implications: Record<string, Record<string, string>> = {
    'Gizi Kurang': {
      'meningkatkan': `Program perbaikan gizi balita dapat mengurangi kasus pneumonia secara signifikan.`,
      'menurunkan': `Paradoks: perlu investigasi lebih lanjut mengenai hubungan gizi kurang dengan pneumonia.`
    },
    'IMD (Inisiasi Menyusu Dini)': {
      'meningkatkan': `Promosi IMD yang lebih intensif dapat membantu mengurangi risiko pneumonia.`,
      'menurunkan': `Perlu evaluasi program IMD dan faktor-faktor yang mempengaruhi efektivitasnya.`
    },
    'Konsumsi Rokok Perkapita': {
      'meningkatkan': `Program pengendalian tembakau dan edukasi bahaya asap rokok perlu diperkuat.`,
      'menurunkan': `Hasil tidak sesuai ekspektasi, perlu analisis lebih mendalam.`
    },
    'Kepadatan Penduduk': {
      'meningkatkan': `Perlu peningkatan fasilitas kesehatan dan program pencegahan di area padat penduduk.`,
      'menurunkan': `Kepadatan penduduk mungkin berkorelasi dengan akses kesehatan yang lebih baik.`
    },
    'Akses Air Minum Layak': {
      'meningkatkan': `Hasil tidak sesuai ekspektasi, perlu evaluasi kualitas air dan sistem distribusi.`,
      'menurunkan': `Program peningkatan akses air bersih dapat mengurangi risiko pneumonia secara efektif.`
    },
    'Akses Sanitasi Layak': {
      'meningkatkan': `Hasil tidak sesuai ekspektasi, perlu evaluasi kualitas dan penggunaan fasilitas sanitasi.`,
      'menurunkan': `Program peningkatan sanitasi dapat mengurangi risiko pneumonia secara efektif.`
    }
  };
  
  return implications[variableName]?.[effect] || `Diperlukan analisis lebih lanjut untuk memahami hubungan ini.`;
}

function generateRecommendations(significantFactors: any[]): string[] {
  const recommendations: string[] = [];
  
  significantFactors.forEach(factor => {
    if (factor.name === 'Gizi Kurang' && factor.effect === 'meningkatkan') {
      recommendations.push('Intensifikasi program pemberian makanan tambahan dan edukasi gizi untuk balita.');
    }
    if (factor.name === 'IMD (Inisiasi Menyusu Dini)' && factor.effect === 'menurunkan') {
      recommendations.push('Perkuat program promosi dan dukungan IMD di fasilitas kesehatan.');
    }
    if (factor.name === 'Konsumsi Rokok Perkapita' && factor.effect === 'meningkatkan') {
      recommendations.push('Implementasi kebijakan kawasan tanpa rokok dan edukasi bahaya asap rokok.');
    }
    if (factor.name === 'Kepadatan Penduduk' && factor.effect === 'meningkatkan') {
      recommendations.push('Peningkatan rasio fasilitas kesehatan per populasi di area padat penduduk.');
    }
    if (factor.name.includes('Air Minum') && factor.effect === 'menurunkan') {
      recommendations.push('Percepatan program penyediaan air bersih dan aman untuk konsumsi.');
    }
    if (factor.name.includes('Sanitasi') && factor.effect === 'menurunkan') {
      recommendations.push('Peningkatan akses dan kualitas fasilitas sanitasi dasar.');
    }
  });
  
  if (recommendations.length === 0) {
    recommendations.push('Lakukan monitoring dan evaluasi berkala terhadap faktor-faktor risiko pneumonia.');
    recommendations.push('Perkuat sistem surveilans dan deteksi dini kasus pneumonia balita.');
  }
  
  return recommendations;
}
```

---

## 4. INTEGRASI DENGAN DASHBOARD UTAMA

### 4.1 Update AnalyticsTabs Component

#### Tambahkan tab baru di `src/components/cards/AnalyticsTabs.tsx`:
```typescript
// Tambahkan import
import PredictionCard from '@/components/prediction/PredictionCard';
import EquationCard from '@/components/cards/EquationCard';
import InterpretationCard from '@/components/prediction/InterpretationCard';
import { usePrediction } from '@/hooks/usePrediction';

// Tambahkan tab baru
<TabsList className="grid w-full grid-cols-6">
  <TabsTrigger value="overview">Ringkasan</TabsTrigger>
  <TabsTrigger value="regions">Wilayah</TabsTrigger>
  <TabsTrigger value="trends">Tren</TabsTrigger>
  <TabsTrigger value="correlation">Korelasi</TabsTrigger>
  <TabsTrigger value="prediction">Prediksi</TabsTrigger>
  <TabsTrigger value="equation">Persamaan</TabsTrigger>
</TabsList>

// Tambahkan TabsContent untuk prediksi
<TabsContent value="prediction" className="space-y-6">
  <PredictionDashboard selectedRegion={selectedRegion} />
</TabsContent>

<TabsContent value="equation" className="space-y-6">
  <EquationDashboard selectedRegion={selectedRegion} />
</TabsContent>
```

### 4.2 Komponen Dashboard Prediksi

#### `src/components/prediction/PredictionDashboard.tsx`:
```typescript
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { usePrediction } from '@/hooks/usePrediction';
import PredictionCard from './PredictionCard';
import PredictionChart from './PredictionChart';
import ModelMetrics from './ModelMetrics';

interface PredictionDashboardProps {
  selectedRegion: string | null;
}

export default function PredictionDashboard({ selectedRegion }: PredictionDashboardProps) {
  const { predictions, globalMetrics, loading, error } = usePrediction();
  const [viewMode, setViewMode] = useState<'grid' | 'chart' | 'table'>('grid');
  const [sortBy, setSortBy] = useState<'accuracy' | 'residual' | 'region'>('accuracy');
  
  if (loading) return <div>Loading predictions...</div>;
  if (error) return <div>Error: {error}</div>;
  
  const filteredPredictions = selectedRegion 
    ? predictions.filter(p => p.regionName.toLowerCase().includes(selectedRegion.toLowerCase()))
    : predictions;
  
  const sortedPredictions = [...filteredPredictions].sort((a, b) => {
    switch (sortBy) {
      case 'accuracy':
        const accuracyA = 1 - Math.abs(a.prediction.residual) / a.prediction.actualValue;
        const accuracyB = 1 - Math.abs(b.prediction.residual) / b.prediction.actualValue;
        return accuracyB - accuracyA;
      case 'residual':
        return Math.abs(a.prediction.residual) - Math.abs(b.prediction.residual);
      case 'region':
        return a.regionName.localeCompare(b.regionName);
      default:
        return 0;
    }
  });
  
  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Prediksi Model GWNBR</CardTitle>
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="accuracy">Akurasi</SelectItem>
                  <SelectItem value="residual">Residual</SelectItem>
                  <SelectItem value="region">Wilayah</SelectItem>
                </SelectContent>
              </Select>
              <Select value={viewMode} onValueChange={setViewMode}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grid">Grid</SelectItem>
                  <SelectItem value="chart">Chart</SelectItem>
                  <SelectItem value="table">Tabel</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>
      
      {/* Global Metrics */}
      {globalMetrics && (
        <ModelMetrics metrics={globalMetrics} />
      )}
      
      {/* Predictions Display */}
      {viewMode === 'grid' && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sortedPredictions.map((prediction) => (
            <PredictionCard 
              key={prediction.regionId} 
              prediction={prediction} 
              showDetails={true}
            />
          ))}
        </div>
      )}
      
      {viewMode === 'chart' && (
        <PredictionChart predictions={sortedPredictions} />
      )}
      
      {viewMode === 'table' && (
        <PredictionTable predictions={sortedPredictions} />
      )}
    </div>
  );
}
```

---

## 5. TESTING DAN VALIDASI

### 5.1 Unit Tests

#### `src/__tests__/prediction/gwnbrModel.test.ts`:
```typescript
import { calculateGWNBRPrediction, calculateAllPredictions } from '@/lib/prediction/gwnbrModel';
import { ResearchDataPoint, GWNBRCoefficient } from '@/lib/data/research-data';

describe('GWNBR Model Calculations', () => {
  const mockRegionData: ResearchDataPoint = {
    No: 1,
    NAMOBJ: 'Test Region',
    Penemuan: 1000,
    GiziKurang: 500,
    IMD: 60,
    RokokPerkapita: 10,
    Kepadatan: 5000,
    AirMinumLayak: 80,
    Sanitasi: 70,
    // ... other required fields
  };
  
  const mockCoefficients: GWNBRCoefficient = {
    Region: 'Test Region',
    Theta: 1.5,
    Intercept: 5.0,
    InterceptZ: 10.0,
    GiziKurangKoef: 0.001,
    GiziKurangZ: 2.5,
    IMDKoef: -0.01,
    IMDZ: -2.0,
    RokokPerkapitaKoef: 0.05,
    RokokPerkapitaZ: 1.8,
    KepadatanKoef: 0.0001,
    KepadatanZ: 3.0,
    AirMinumKoef: -0.02,
    AirMinumZ: -1.5,
    SanitasiKoef: -0.015,
    SanitasiZ: -2.2
  };
  
  test('should calculate prediction correctly', () => {
    const result = calculateGWNBRPrediction(mockRegionData, mockCoefficients);
    
    expect(result.regionName).toBe('Test Region');
    expect(result.actualValue).toBe(1000);
    expect(result.predictedValue).toBeGreaterThan(0);
    expect(result.residual).toBe(result.actualValue - result.predictedValue);
    expect(result.confidenceInterval.lower).toBeLessThan(result.confidenceInterval.upper);
  });
  
  test('should handle edge cases', () => {
    const zeroCoefficients = { ...mockCoefficients };
    Object.keys(zeroCoefficients).forEach(key => {
      if (key.includes('Koef')) {
        (zeroCoefficients as any)[key] = 0;
      }
    });
    
    const result = calculateGWNBRPrediction(mockRegionData, zeroCoefficients);
    expect(result.predictedValue).toBeCloseTo(Math.exp(mockCoefficients.Intercept));
  });
});
```

### 5.2 Integration Tests

#### `src/__tests__/components/PredictionCard.test.tsx`:
```typescript
import { render, screen } from '@testing-library/react';
import PredictionCard from '@/components/prediction/PredictionCard';
import { GWNBRPrediction } from '@/types/prediction';

const mockPrediction: GWNBRPrediction = {
  regionId: '1',
  regionName: 'Test Region',
  coefficients: {
    intercept: 5.0,
    giziKurang: 0.001,
    imd: -0.01,
    rokokPerkapita: 0.05,
    kepadatan: 0.0001,
    airMinum: -0.02,
    sanitasi: -0.015
  },
  prediction: {
    regionName: 'Test Region',
    actualValue: 1000,
    predictedValue: 950,
    residual: 50,
    standardError: 25,
    confidenceInterval: { lower: 900, upper: 1000 },
    predictionDate: '2024-01-01'
  },
  localMetrics: {
    r2: 0.85,
    rmse: 45,
    mae: 35,
    mape: 5.2,
    aic: 120,
    bic: 135
  }
};

describe('PredictionCard', () => {
  test('renders prediction data correctly', () => {
    render(<PredictionCard prediction={mockPrediction} />);
    
    expect(screen.getByText('Test Region')).toBeInTheDocument();
    expect(screen.getByText('1,000')).toBeInTheDocument();
    expect(screen.getByText('950')).toBeInTheDocument();
  });
  
  test('shows accuracy badge', () => {
    render(<PredictionCard prediction={mockPrediction} />);
    
    expect(screen.getByText(/95.0% akurat/)).toBeInTheDocument();
  });
});
```

---

## 6. DEPLOYMENT DAN DOKUMENTASI

### 6.1 Update Package.json
```json
{
  "dependencies": {
    "mathjs": "^12.0.0",
    "d3-scale": "^4.0.2",
    "sonner": "^1.0.0"
  },
  "scripts": {
    "test:prediction": "jest src/__tests__/prediction",
    "build:prediction": "tsc --project tsconfig.prediction.json"
  }
}
```

### 6.2 Dokumentasi API

#### `docs/PREDICTION_API.md`:
```markdown
# Prediction API Documentation

## Overview
API untuk prediksi model GWNBR dan interpretasi hasil.

## Functions

### calculateGWNBRPrediction
```typescript
function calculateGWNBRPrediction(
  regionData: ResearchDataPoint,
  coefficients: GWNBRCoefficient
): PredictionResult
```

**Parameters:**
- `regionData`: Data penelitian untuk satu daerah
- `coefficients`: Koefisien GWNBR untuk daerah tersebut

**Returns:**
- `PredictionResult`: Hasil prediksi dengan confidence interval

### usePrediction Hook
```typescript
function usePrediction(): {
  predictions: GWNBRPrediction[];
  getPredictionByRegion: (regionName: string) => GWNBRPrediction | undefined;
  globalMetrics: ModelMetrics | null;
  loading: boolean;
  error: string | null;
}
```

## Components

### PredictionCard
Menampilkan prediksi untuk satu daerah dengan akurasi dan confidence interval.

### EquationCard
Menampilkan persamaan GWNBR dengan koefisien dan signifikansi.

### InterpretationCard
Memberikan interpretasi mendalam dari koefisien model.
```

---

## 7. ROADMAP IMPLEMENTASI

### Phase 1 (Week 1-2): Core Prediction
- [ ] Implementasi `gwnbrModel.ts`
- [ ] Buat `usePrediction` hook
- [ ] Komponen `PredictionCard` dasar
- [ ] Unit tests untuk prediction logic

### Phase 2 (Week 3): Equation Display
- [ ] Komponen `EquationCard`
- [ ] Integrasi dengan map click events
- [ ] Styling dan responsive design
- [ ] Copy equation functionality

### Phase 3 (Week 4): Interpretation
- [ ] Komponen `InterpretationCard`
- [ ] Logic untuk interpretasi koefisien
- [ ] Rekomendasi berdasarkan hasil
- [ ] Integration tests

### Phase 4 (Week 5): Integration & Polish
- [ ] Integrasi dengan `AnalyticsTabs`
- [ ] Performance optimization
- [ ] Error handling
- [ ] Documentation

### Phase 5 (Week 6): Testing & Deployment
- [ ] End-to-end testing
- [ ] User acceptance testing
- [ ] Performance testing
- [ ] Production deployment

---

## 8. CONSIDERATIONS & BEST PRACTICES

### Performance
- Gunakan `useMemo` untuk perhitungan yang expensive
- Implement lazy loading untuk komponen berat
- Cache hasil prediksi di localStorage

### Accessibility
- Pastikan semua komponen dapat diakses dengan keyboard
- Gunakan ARIA labels yang sesuai
- Kontras warna yang memadai untuk visualisasi

### Error Handling
- Graceful degradation jika data tidak tersedia
- User-friendly error messages
- Fallback untuk perhitungan yang gagal

### Security
- Validasi input data
- Sanitize user inputs
- Rate limiting untuk API calls

Dengan implementasi rancangan ini, dashboard akan memiliki fitur prediksi model yang komprehensif, tampilan persamaan yang interaktif, dan interpretasi yang mudah dipahami untuk mendukung pengambilan keputusan berbasis data dalam penanganan pneumonia balita.