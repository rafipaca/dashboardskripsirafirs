"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useResearchData } from '@/hooks/useResearchData';
import { TrendingUpIcon, TrendingDownIcon, MinusIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { CORRELATION_THRESHOLDS, GRADIENTS, STATUS_COLORS, GRID_LAYOUTS } from '@/lib/constants';

/**
 * Komponen reusable untuk kartu statistik korelasi
 * Mengurangi duplikasi struktur div yang berulang
 */
interface CorrelationStatCardProps {
  value: number;
  title: string;
  subtitle: string;
  bgGradient: string;
  textColor: string;
}

const CorrelationStatCard = ({ value, title, subtitle, bgGradient, textColor }: CorrelationStatCardProps) => (
  <div className={`text-center p-4 ${bgGradient} rounded-lg border`}>
    <div className={`text-2xl font-bold ${textColor} mb-2`}>
      {value}
    </div>
    <div className={`text-sm font-medium ${textColor.replace('600', '800')}`}>{title}</div>
    <div className={`text-xs ${textColor} mt-1`}>{subtitle}</div>
  </div>
);

interface CorrelationResult {
  variable: string;
  correlation: number;
  pValue?: number;
  interpretation: string;
}

export default function CorrelationAnalysis() {
  const { rawData } = useResearchData();
  const [correlations, setCorrelations] = useState<CorrelationResult[]>([]);

  useEffect(() => {
    if (rawData.length > 0) {
      const correlationResults = calculateCorrelations(rawData);
      setCorrelations(correlationResults);
    }
  }, [rawData]);

  const calculateCorrelations = (data: any[]): CorrelationResult[] => {
    if (data.length === 0) return [];

    const variables = [
      { key: 'kepadatan', name: 'Kepadatan Penduduk' },
      { key: 'sanitasi', name: 'Akses Sanitasi' },
      { key: 'airMinum', name: 'Kualitas Air Minum' },
      { key: 'giziBuruk', name: 'Status Gizi' },
      { key: 'kemiskinan', name: 'Tingkat Kemiskinan' },
      { key: 'imd', name: 'Indeks Pembangunan Manusia' },
      { key: 'rokok', name: 'Konsumsi Rokok' },
      { key: 'pm10', name: 'Polusi Udara (PM10)' }
    ];

    const cases = data.map(d => d.pneumonia || 0);

    return variables.map(variable => {
      const values = data.map(d => d[variable.key] || 0);
      const correlation = calculatePearsonCorrelation(cases, values);
      
      return {
        variable: variable.name,
        correlation,
        interpretation: getCorrelationInterpretation(correlation),
        pValue: calculatePValue(correlation, data.length)
      };
    });
  };

  const calculatePearsonCorrelation = (x: number[], y: number[]): number => {
    const n = x.length;
    if (n === 0) return 0;

    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

    return denominator === 0 ? 0 : numerator / denominator;
  };

  const calculatePValue = (r: number, n: number): number => {
    if (n < 3) return 1;
    const t = Math.abs(r) * Math.sqrt((n - 2) / (1 - r * r));
    return 2 * (1 - Math.tanh(Math.abs(t) / Math.sqrt(2)));
  };

  const getCorrelationInterpretation = (correlation: number): string => {
    const absCorr = Math.abs(correlation);
    if (absCorr > 0.7) return correlation > 0 ? 'Hubungan Kuat Positif' : 'Hubungan Kuat Negatif';
    if (absCorr > 0.5) return correlation > 0 ? 'Hubungan Sedang Positif' : 'Hubungan Sedang Negatif';
    if (absCorr > 0.3) return correlation > 0 ? 'Hubungan Lemah Positif' : 'Hubungan Lemah Negatif';
    return 'Hubungan Sangat Lemah';
  };

  const getCorrelationIcon = (correlation: number) => {
    if (correlation > 0.5) return <TrendingUpIcon className="h-4 w-4 text-red-500" />;
    if (correlation < -0.5) return <TrendingDownIcon className="h-4 w-4 text-green-500" />;
    return <MinusIcon className="h-4 w-4 text-gray-500" />;
  };

  const getCorrelationColor = (correlation: number) => {
    const absCorr = Math.abs(correlation);
    if (absCorr > 0.7) return correlation > 0 ? 'text-red-600' : 'text-green-600';
    if (absCorr > 0.5) return correlation > 0 ? 'text-orange-600' : 'text-blue-600';
    if (absCorr > 0.3) return correlation > 0 ? 'text-yellow-600' : 'text-purple-600';
    return 'text-gray-600';
  };

  if (correlations.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-2"></div>
          <p className="text-muted-foreground">Memuat analisis korelasi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className={GRID_LAYOUTS.CORRELATION_GRID}>
        <CorrelationStatCard
          value={correlations.filter(c => Math.abs(c.correlation) > CORRELATION_THRESHOLDS.STRONG).length}
          title="Korelasi Kuat"
          subtitle={`|r| > ${CORRELATION_THRESHOLDS.STRONG}`}
          bgGradient={GRADIENTS.PURPLE}
          textColor={STATUS_COLORS.PURPLE}
        />
        <CorrelationStatCard
          value={correlations.filter(c => Math.abs(c.correlation) > CORRELATION_THRESHOLDS.MODERATE && Math.abs(c.correlation) <= CORRELATION_THRESHOLDS.STRONG).length}
          title="Korelasi Sedang"
          subtitle={`${CORRELATION_THRESHOLDS.MODERATE} < |r| ≤ ${CORRELATION_THRESHOLDS.STRONG}`}
          bgGradient={GRADIENTS.BLUE}
          textColor={STATUS_COLORS.INFO}
        />
        <CorrelationStatCard
          value={correlations.filter(c => Math.abs(c.correlation) <= CORRELATION_THRESHOLDS.MODERATE).length}
          title="Korelasi Lemah"
          subtitle={`|r| ≤ ${CORRELATION_THRESHOLDS.MODERATE}`}
          bgGradient={GRADIENTS.GREEN}
          textColor={STATUS_COLORS.SUCCESS}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 font-semibold">Faktor Risiko</th>
              <th className="text-center py-3 px-4 font-semibold">Koefisien Korelasi</th>
              <th className="text-center py-3 px-4 font-semibold">Interpretasi</th>
              <th className="text-center py-3 px-4 font-semibold">Kekuatan Hubungan</th>
            </tr>
          </thead>
          <tbody>
            {correlations.map((item, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="border-b hover:bg-muted/50 transition-colors"
              >
                <td className="py-3 px-4 font-medium">{item.variable}</td>
                <td className="py-3 px-4 text-center">
                  <span className={`font-semibold ${getCorrelationColor(item.correlation)}`}>
                    {item.correlation.toFixed(3)}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <div className="flex items-center justify-center space-x-1">
                    {getCorrelationIcon(item.correlation)}
                    <span>{item.interpretation}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-center">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        Math.abs(item.correlation) > 0.7
                          ? 'bg-red-500'
                          : Math.abs(item.correlation) > 0.5
                          ? 'bg-orange-500'
                          : Math.abs(item.correlation) > 0.3
                          ? 'bg-yellow-500'
                          : 'bg-gray-400'
                      }`}
                      style={{ width: `${Math.abs(item.correlation) * 100}%` }}
                    ></div>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 p-4 bg-muted/30 rounded-lg">
        <h4 className="font-semibold mb-2">Metodologi</h4>
        <p className="text-sm text-muted-foreground">
          Analisis ini menggunakan koefisien korelasi Pearson untuk mengukur hubungan linear antara jumlah kasus pneumonia balita 
          dengan berbagai faktor risiko. Nilai korelasi berkisar dari -1 hingga +1, di mana nilai positif menunjukkan hubungan searah 
          dan nilai negatif menunjukkan hubungan berlawanan arah.
        </p>
      </div>
    </div>
  );
}
