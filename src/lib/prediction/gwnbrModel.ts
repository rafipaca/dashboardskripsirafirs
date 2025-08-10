/**
 * Core GWNBR Model Implementation
 * Geographically Weighted Negative Binomial Regression untuk analisis pneumonia balita
 */

import { ModelMetrics, EquationDisplay, InterpretationResult, RegionInterpretation } from '@/types/prediction';
import { GWNBRCoefficient } from '@/lib/data/research-data';

/**
 * Menghitung prediksi GWNBR untuk satu region
 */
export function calculateGWNBRPrediction(
  coefficients: GWNBRCoefficient,
  variables: {
    giziKurang: number;
    imd: number;
    rokokPerkapita: number;
    kepadatan: number;
    airMinum: number;
    sanitasi: number;
  }
): number {
  const {
    Intercept,
    GiziKurangKoef,
    IMDKoef,
    RokokPerkapitaKoef,
    KepadatanKoef,
    AirMinumKoef,
    SanitasiKoef,
  } = coefficients;

  // Linear predictor
  const linearPredictor = 
    Intercept +
    GiziKurangKoef * variables.giziKurang +
    IMDKoef * variables.imd +
    RokokPerkapitaKoef * variables.rokokPerkapita +
    KepadatanKoef * variables.kepadatan +
    AirMinumKoef * variables.airMinum +
    SanitasiKoef * variables.sanitasi;

  // Exponential link function untuk Negative Binomial
  return Math.exp(linearPredictor);
}

/**
 * Menghitung confidence interval untuk prediksi
 */
export function calculateConfidenceInterval(
  prediction: number,
  standardError: number,
  confidenceLevel: number = 0.95
): { lower: number; upper: number } {
  const zScore = confidenceLevel === 0.95 ? 1.96 : 2.576; // 95% atau 99%
  const margin = zScore * standardError;
  
  return {
    lower: Math.max(0, prediction - margin), // Tidak boleh negatif
    upper: prediction + margin
  };
}

/**
 * Menghitung standard error untuk prediksi GWNBR
 */
export function calculateStandardError(
  prediction: number,
  theta: number,
  sampleSize: number = 100
): number {
  // Simplified standard error calculation untuk Negative Binomial
  // SE = sqrt(μ + μ²/θ) / sqrt(n)
  const variance = prediction + (prediction * prediction) / theta;
  return Math.sqrt(variance / sampleSize);
}

/**
 * Menghitung model metrics
 */
export function calculateModelMetrics(
  actual: number[],
  predicted: number[]
): ModelMetrics {
  const n = actual.length;
  
  if (n === 0) {
    return { r2: 0, rmse: 0, mae: 0, mape: 0, aic: 0, bic: 0 };
  }
  
  // Untuk single data point, R² tidak dapat dihitung secara bermakna
  let r2 = 0;
  if (n > 1) {
    const actualMean = actual.reduce((sum, val) => sum + val, 0) / n;
    const totalSumSquares = actual.reduce((sum, val) => sum + Math.pow(val - actualMean, 2), 0);
    const residualSumSquares = actual.reduce((sum, val, i) => sum + Math.pow(val - predicted[i], 2), 0);
    
    // Hindari pembagian dengan nol
    if (totalSumSquares > 0) {
      r2 = 1 - (residualSumSquares / totalSumSquares);
    }
  }
  
  // RMSE
  const residualSumSquares = actual.reduce((sum, val, i) => sum + Math.pow(val - predicted[i], 2), 0);
  const rmse = Math.sqrt(residualSumSquares / n);
  
  // MAE
  const mae = actual.reduce((sum, val, i) => sum + Math.abs(val - predicted[i]), 0) / n;
  
  // MAPE
  const mape = actual.reduce((sum, val, i) => {
    if (val === 0) return sum;
    return sum + Math.abs((val - predicted[i]) / val);
  }, 0) / n * 100;
  
  // Simplified AIC and BIC (would need more parameters in real implementation)
  let aic = 0, bic = 0;
  if (residualSumSquares > 0 && n > 0) {
    aic = n * Math.log(residualSumSquares / n) + 2 * 7; // 7 parameters
    bic = n * Math.log(residualSumSquares / n) + Math.log(n) * 7;
  }
  
  return { r2, rmse, mae, mape, aic, bic };
}

/**
 * Menghitung global model metrics dari semua prediksi
 */
export function calculateGlobalModelMetrics(
  predictions: Array<{ actualValue: number; predictedValue: number }>
): ModelMetrics {
  if (predictions.length === 0) {
    return { r2: 0, rmse: 0, mae: 0, mape: 0, aic: 0, bic: 0 };
  }
  
  const actual = predictions.map(p => p.actualValue);
  const predicted = predictions.map(p => p.predictedValue);
  
  return calculateModelMetrics(actual, predicted);
}

/**
 * Generate equation display untuk region
 */
export function generateEquationDisplay(
  coefficients: GWNBRCoefficient,
  regionName: string
): EquationDisplay {
  const isSignificant = (zValue: number) => Math.abs(zValue) > 1.96;
  
  return {
    regionName,
    coefficients: {
      intercept: {
        value: coefficients.Intercept,
        zValue: coefficients.InterceptZ || 0,
        significant: isSignificant(coefficients.InterceptZ || 0)
      },
      giziKurang: {
        value: coefficients.GiziKurangKoef,
        zValue: coefficients.GiziKurangZ || 0,
        significant: isSignificant(coefficients.GiziKurangZ || 0)
      },
      imd: {
        value: coefficients.IMDKoef,
        zValue: coefficients.IMDZ || 0,
        significant: isSignificant(coefficients.IMDZ || 0)
      },
      rokokPerkapita: {
        value: coefficients.RokokPerkapitaKoef,
        zValue: coefficients.RokokPerkapitaZ || 0,
        significant: isSignificant(coefficients.RokokPerkapitaZ || 0)
      },
      kepadatan: {
        value: coefficients.KepadatanKoef,
        zValue: coefficients.KepadatanZ || 0,
        significant: isSignificant(coefficients.KepadatanZ || 0)
      },
      airMinum: {
        value: coefficients.AirMinumKoef,
        zValue: coefficients.AirMinumZ || 0,
        significant: isSignificant(coefficients.AirMinumZ || 0)
      },
      sanitasi: {
        value: coefficients.SanitasiKoef,
        zValue: coefficients.SanitasiZ || 0,
        significant: isSignificant(coefficients.SanitasiZ || 0)
      }
    },
    theta: coefficients.Theta || 1,
    equation: generateEquationString(coefficients)
  };
}

/**
 * Generate string equation
 */
function generateEquationString(coefficients: GWNBRCoefficient): string {
  const clampToZero = (v: number) => (Math.abs(v) < 1e-7 ? 0 : v);
  const toFixed7 = (v: number) => {
    const val = clampToZero(v);
    return parseFloat(val.toFixed(7)).toString();
  };
  const formatCoef = (value: number, variable: string, zValue: number) => {
    const v = clampToZero(value);
    const sign = v >= 0 ? '+' : '-';
    const formattedValue = parseFloat(Math.abs(v).toFixed(7)).toString();
    const isSignificant = Math.abs(zValue || 0) > 1.96;
    const variableWithExponent = isSignificant ? `${variable}^*` : variable;
    return `${sign}${formattedValue}${variableWithExponent}`;
  };
  
  return `ln(μ) = ${toFixed7(coefficients.Intercept)} ` +
    `${formatCoef(coefficients.GiziKurangKoef, 'X₁', coefficients.GiziKurangZ || 0)}` +
    `${formatCoef(coefficients.IMDKoef, 'X₂', coefficients.IMDZ || 0)}` +
    `${formatCoef(coefficients.RokokPerkapitaKoef, 'X₃', coefficients.RokokPerkapitaZ || 0)}` +
    `${formatCoef(coefficients.KepadatanKoef, 'X₄', coefficients.KepadatanZ || 0)}` +
    `${formatCoef(coefficients.AirMinumKoef, 'X₅', coefficients.AirMinumZ || 0)}` +
    `${formatCoef(coefficients.SanitasiKoef, 'X₆', coefficients.SanitasiZ || 0)}`;
}

/**
 * Interpretasi hasil untuk satu variabel
 */
export function interpretVariable(
  variableName: string,
  coefficient: number,
  zValue: number
): InterpretationResult {
  const isSignificant = Math.abs(zValue) > 1.96;
  const effect = coefficient > 0 ? 'meningkatkan' : 'menurunkan';
  const absCoef = Math.abs(coefficient);
  
  let magnitude: 'rendah' | 'sedang' | 'tinggi';
  if (absCoef < 0.1) magnitude = 'rendah';
  else if (absCoef < 0.5) magnitude = 'sedang';
  else magnitude = 'tinggi';
  
  const percentChange = `${((Math.exp(coefficient) - 1) * 100).toFixed(4)}%`;
  
  const variableLabels: Record<string, string> = {
    gizi_kurang: 'Gizi Kurang',
    imd: 'Inisiasi Menyusu Dini',
    rokok_perkapita: 'Konsumsi Rokok Per Kapita',
    kepadatan_penduduk: 'Kepadatan Penduduk',
    air_minum_layak: 'Akses Air Minum Layak',
    sanitasi_layak: 'Akses Sanitasi Layak'
  };
  
  const label = variableLabels[variableName] || variableName;
  
  let interpretation = '';
  let implication = '';
  
  if (isSignificant) {
    interpretation = `${label} memiliki pengaruh yang signifikan dan ${effect} risiko pneumonia balita sebesar ${percentChange} dengan tingkat pengaruh ${magnitude}.`;
    
    if (effect === 'meningkatkan') {
      implication = `Peningkatan ${label} di wilayah ini berkontribusi terhadap peningkatan kasus pneumonia balita.`;
    } else {
      implication = `Peningkatan ${label} di wilayah ini membantu mengurangi risiko pneumonia balita.`;
    }
  } else {
    interpretation = `${label} tidak memiliki pengaruh yang signifikan terhadap kasus pneumonia balita di wilayah ini.`;
    implication = `Faktor ${label} mungkin tidak menjadi prioritas utama dalam intervensi di wilayah ini.`;
  }
  
  return {
    variableName: label,
    coefficient,
    zValue,
    isSignificant,
    effect,
    magnitude,
    percentChange,
    interpretation,
    implication
  };
}

/**
 * Generate interpretasi lengkap untuk region
 */
export function generateRegionInterpretation(
  coefficients: GWNBRCoefficient,
  regionName: string
): RegionInterpretation {
  const variables = [
    { name: 'gizi_kurang', coef: coefficients.GiziKurangKoef, z: coefficients.GiziKurangZ || 0 },
    { name: 'imd', coef: coefficients.IMDKoef, z: coefficients.IMDZ || 0 },
    { name: 'rokok_perkapita', coef: coefficients.RokokPerkapitaKoef, z: coefficients.RokokPerkapitaZ || 0 },
    { name: 'kepadatan_penduduk', coef: coefficients.KepadatanKoef, z: coefficients.KepadatanZ || 0 },
    { name: 'air_minum_layak', coef: coefficients.AirMinumKoef, z: coefficients.AirMinumZ || 0 },
    { name: 'sanitasi_layak', coef: coefficients.SanitasiKoef, z: coefficients.SanitasiZ || 0 }
  ];
  
  const interpretations = variables.map(v => 
    interpretVariable(v.name, v.coef, v.z)
  );
  
  const significantFactors = interpretations.filter(i => i.isSignificant);
  
  const dominantFactor = significantFactors.length > 0 
    ? significantFactors.reduce((prev, current) => 
        Math.abs(current.coefficient) > Math.abs(prev.coefficient) ? current : prev
      )
    : null;
  
  const recommendations = generateRecommendations(significantFactors);
  
  const summary = generateSummary(regionName, significantFactors, dominantFactor);
  
  return {
    regionName,
    interpretations,
    significantFactors,
    dominantFactor,
    recommendations,
    summary
  };
}

/**
 * Generate rekomendasi berdasarkan faktor signifikan
 */
function generateRecommendations(significantFactors: InterpretationResult[]): string[] {
  const recommendations: string[] = [];
  
  significantFactors.forEach(factor => {
    if (factor.effect === 'meningkatkan') {
      switch (factor.variableName) {
        case 'Gizi Kurang':
          recommendations.push('Tingkatkan program perbaikan gizi balita dan edukasi gizi kepada orang tua.');
          break;
        case 'Konsumsi Rokok Per Kapita':
          recommendations.push('Implementasikan program pengendalian tembakau dan kawasan tanpa rokok.');
          break;
        case 'Kepadatan Penduduk':
          recommendations.push('Perbaiki ventilasi rumah dan kurangi kepadatan hunian.');
          break;
      }
    } else {
      switch (factor.variableName) {
        case 'Inisiasi Menyusu Dini':
          recommendations.push('Pertahankan dan tingkatkan program IMD di fasilitas kesehatan.');
          break;
        case 'Akses Air Minum Layak':
          recommendations.push('Pertahankan kualitas akses air minum dan perluas jangkauan.');
          break;
        case 'Akses Sanitasi Layak':
          recommendations.push('Pertahankan dan tingkatkan akses sanitasi yang layak.');
          break;
      }
    }
  });
  
  if (recommendations.length === 0) {
    recommendations.push('Lakukan monitoring rutin dan identifikasi faktor risiko lokal lainnya.');
  }
  
  return recommendations;
}

/**
 * Generate summary interpretasi
 */
function generateSummary(
  regionName: string,
  significantFactors: InterpretationResult[],
  dominantFactor: InterpretationResult | null
): string {
  if (significantFactors.length === 0) {
    return `Di ${regionName}, tidak ada faktor yang menunjukkan pengaruh signifikan terhadap kasus pneumonia balita. Diperlukan analisis lebih lanjut untuk mengidentifikasi faktor risiko lokal.`;
  }
  
  const riskFactors = significantFactors.filter(f => f.effect === 'meningkatkan');
  const protectiveFactors = significantFactors.filter(f => f.effect === 'menurunkan');
  
  let summary = `Di ${regionName}, terdapat ${significantFactors.length} faktor yang berpengaruh signifikan terhadap pneumonia balita. `;
  
  if (dominantFactor) {
    summary += `Faktor dominan adalah ${dominantFactor.variableName} yang ${dominantFactor.effect} risiko sebesar ${dominantFactor.percentChange}. `;
  }
  
  if (riskFactors.length > 0) {
    summary += `Faktor risiko utama: ${riskFactors.map(f => f.variableName).join(', ')}. `;
  }
  
  if (protectiveFactors.length > 0) {
    summary += `Faktor protektif: ${protectiveFactors.map(f => f.variableName).join(', ')}.`;
  }
  
  return summary;
}