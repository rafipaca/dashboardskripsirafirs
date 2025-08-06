/**
 * Utility functions untuk interpretasi GWNBR
 */

import { EquationDisplay } from '@/types/prediction';
import { 
  FactorInterpretation, 
  SimpleInterpretation,
  getSignificantFactorTemplate,
  getNonSignificantFactorTemplate,
  generateSummary,
  generateRecommendations
} from './templates';

/**
 * Mengkonversi data equation menjadi interpretasi sederhana
 */
export function createSimpleInterpretation(equation: EquationDisplay): SimpleInterpretation {
  const { regionName, coefficients } = equation;
  
  // Konversi coefficients menjadi FactorInterpretation
  const allFactors: FactorInterpretation[] = Object.entries(coefficients)
    .filter(([key]) => key !== 'intercept') // Skip intercept
    .map(([variable, coef]) => ({
      variable,
      coefficient: coef.value,
      significant: coef.significant,
      effect: coef.value > 0 ? 'increase' : 'decrease'
    }));

  // Pisahkan faktor signifikan dan tidak signifikan
  const significantFactors = allFactors.filter(f => f.significant);
  const nonSignificantFactors = allFactors.filter(f => !f.significant);

  // Tentukan faktor dominan (yang memiliki koefisien terbesar)
  const dominantFactor = significantFactors.length > 0 
    ? significantFactors.reduce((prev, current) => 
        Math.abs(current.coefficient) > Math.abs(prev.coefficient) ? current : prev
      )
    : undefined;

  const interpretation: SimpleInterpretation = {
    regionName,
    significantFactors,
    nonSignificantFactors,
    dominantFactor,
    summary: '',
    recommendations: []
  };

  // Generate summary dan recommendations
  interpretation.summary = generateSummary(interpretation);
  interpretation.recommendations = generateRecommendations(interpretation);

  return interpretation;
}

/**
 * Membuat interpretasi lengkap dalam format teks
 */
export function generateFullInterpretation(interpretation: SimpleInterpretation): string {
  const { regionName, significantFactors, nonSignificantFactors, summary, recommendations } = interpretation;
  
  let result = `# Interpretasi Analisis GWNBR - ${regionName}\n\n`;
  
  // Ringkasan
  result += `## Ringkasan\n${summary}\n\n`;
  
  // Faktor Signifikan
  if (significantFactors.length > 0) {
    result += `## Faktor yang Berpengaruh Signifikan\n\n`;
    significantFactors.forEach((factor, index) => {
      result += `### ${index + 1}. ${getVariableName(factor.variable)}\n`;
      result += `${getSignificantFactorTemplate(factor, regionName)}\n\n`;
    });
  }
  
  // Faktor Tidak Signifikan
  if (nonSignificantFactors.length > 0) {
    result += `## Faktor yang Tidak Berpengaruh Signifikan\n\n`;
    nonSignificantFactors.forEach((factor, index) => {
      result += `### ${index + 1}. ${getVariableName(factor.variable)}\n`;
      result += `${getNonSignificantFactorTemplate(factor, regionName)}\n\n`;
    });
  }
  
  // Rekomendasi
  if (recommendations.length > 0) {
    result += `## Rekomendasi\n\n`;
    recommendations.forEach((rec, index) => {
      result += `${index + 1}. ${rec}\n`;
    });
  }
  
  return result;
}

/**
 * Mendapatkan nama variabel yang user-friendly
 */
export function getVariableName(variable: string): string {
  const variableNames: Record<string, string> = {
    'giziKurang': 'Gizi Kurang',
    'imd': 'Inisiasi Menyusu Dini (IMD)',
    'rokokPerkapita': 'Konsumsi Rokok Per Kapita',
    'kepadatan': 'Kepadatan Penduduk',
    'airMinum': 'Akses Air Minum Layak',
    'sanitasi': 'Akses Sanitasi Layak'
  };
  
  return variableNames[variable] || variable;
}

/**
 * Mendapatkan deskripsi efek faktor
 */
export function getEffectDescription(factor: FactorInterpretation): string {
  const effectText = factor.effect === 'increase' ? 'meningkatkan' : 'menurunkan';
  return `${effectText} risiko pneumonia`;
}

/**
 * Mendapatkan warna untuk visualisasi berdasarkan signifikansi
 */
export function getSignificanceColor(significant: boolean): string {
  return significant ? 'text-green-600' : 'text-gray-500';
}

/**
 * Mendapatkan ikon untuk visualisasi berdasarkan efek
 */
export function getEffectIcon(effect: 'increase' | 'decrease'): string {
  return effect === 'increase' ? '↑' : '↓';
}