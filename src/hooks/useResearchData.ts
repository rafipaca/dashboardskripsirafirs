/**
 * Custom hook untuk memuat dan mengelola data penelitian
 * Menyediakan data yang sudah diproses untuk komponen dashboard
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  loadResearchData, 
  loadGWNBRCoefficients, 
  processDataForDashboard,
  analyzeCorrelations,
  identifyPatterns,
  ResearchDataPoint,
  GWNBRCoefficient
} from '@/lib/data/research-data';

export interface ProcessedDashboardData {
  topRegions: Array<{
    name: string;
    value: number;
    kepadatan: number;
    sanitasi: number;
    airMinum: number;
  }>;
  summaryStats: {
    totalCases: number;
    analyzedCases: number;
    avgCasesPerRegion: number;
    highRiskAreas: number;
    studyPeriod: string;
  };
  riskDistribution: {
    high: number;
    mediumHigh: number;
    medium: number;
    low: number;
  };
}

export interface ResearchDataHook {
  // Data mentah
  rawData: ResearchDataPoint[];
  coefficients: GWNBRCoefficient[];
  
  // Data yang sudah diproses
  dashboardData: ProcessedDashboardData | null;
  correlations: Record<string, number>;
  patterns: Record<string, ResearchDataPoint[]>;
  
  // Status loading
  loading: boolean;
  error: string | null;
  
  // Fungsi utilitas
  getRegionData: (regionName: string) => ResearchDataPoint | null;
  getTopRegionsByMetric: (metric: keyof ResearchDataPoint, limit?: number) => ResearchDataPoint[];
  filterByRiskLevel: (level: 'high' | 'medium' | 'low') => ResearchDataPoint[];
}

/**
 * Hook untuk memuat dan mengelola data penelitian
 */
export function useResearchData(): ResearchDataHook {
  const [rawData, setRawData] = useState<ResearchDataPoint[]>([]);
  const [coefficients, setCoefficients] = useState<GWNBRCoefficient[]>([]);
  const [dashboardData, setDashboardData] = useState<ProcessedDashboardData | null>(null);
  const [correlations, setCorrelations] = useState<Record<string, number>>({});
  const [patterns, setPatterns] = useState<Record<string, ResearchDataPoint[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        // Memuat data penelitian dan koefisien secara paralel
        const [researchData, gwnbrCoefficients] = await Promise.all([
          loadResearchData(),
          loadGWNBRCoefficients()
        ]);

        if (!researchData || researchData.length === 0) {
          throw new Error('Tidak dapat memuat data penelitian');
        }

        // Menyimpan data mentah
        setRawData(researchData);
        setCoefficients(gwnbrCoefficients || []);

        // Memproses data untuk dashboard
        const processedData = processDataForDashboard(researchData);
        setDashboardData(processedData);

        // Menganalisis korelasi
        const correlationData = analyzeCorrelations(researchData);
        setCorrelations(correlationData || {});

        // Mengidentifikasi pola
        const patternData = identifyPatterns(researchData);
        setPatterns(patternData || {});

      } catch (err) {
        console.error('Error loading research data:', err);
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Fungsi untuk mendapatkan data wilayah tertentu
  const getRegionData = useCallback((regionName: string): ResearchDataPoint | null => {
    if (!rawData || rawData.length === 0) return null;
    
    return rawData.find(item => 
      item?.NAMOBJ?.toLowerCase().includes(regionName.toLowerCase())
    ) || null;
  }, [rawData]);

  // Fungsi untuk mendapatkan wilayah teratas berdasarkan metrik tertentu
  const getTopRegionsByMetric = useCallback((
    metric: keyof ResearchDataPoint, 
    limit: number = 10
  ): ResearchDataPoint[] => {
    if (!rawData || rawData.length === 0) return [];
    
    return rawData
      .filter(item => item && typeof item[metric] === 'number')
      .sort((a, b) => (b[metric] as number) - (a[metric] as number))
      .slice(0, limit);
  }, [rawData]);

  // Fungsi untuk memfilter berdasarkan tingkat risiko
  const filterByRiskLevel = useCallback((level: 'high' | 'medium' | 'low'): ResearchDataPoint[] => {
    if (!rawData || rawData.length === 0) return [];
    
    switch (level) {
      case 'high':
        return rawData.filter(item => item?.Penemuan && item.Penemuan > 8000);
      case 'medium':
        return rawData.filter(item => item?.Penemuan && item.Penemuan > 2000 && item.Penemuan <= 8000);
      case 'low':
        return rawData.filter(item => item?.Penemuan && item.Penemuan <= 2000);
      default:
        return [];
    }
  }, [rawData]);

  return {
    rawData,
    coefficients,
    dashboardData,
    correlations,
    patterns,
    loading,
    error,
    getRegionData,
    getTopRegionsByMetric,
    filterByRiskLevel
  };
}

/**
 * Hook khusus untuk data chart yang sudah diformat
 */
export function useChartData() {
  const { dashboardData, loading, error } = useResearchData();

  // Data untuk bar chart - wilayah dengan kasus tertinggi
  const barChartData = useMemo(() => {
    if (!dashboardData?.topRegions) return [];
    
    return dashboardData.topRegions.map(region => ({
      name: region.name,
      value: region.value || 0,
      change: region.kepadatan || 0,
      trend: (region.value || 0) > 2000 ? 'up' : 'down'
    }));
  }, [dashboardData]);

  // Data untuk pie chart - distribusi risiko berdasarkan data aktual
  const pieChartData = useMemo(() => {
    if (!dashboardData?.riskDistribution) return [];
    
    return [
      { name: 'High Risk', value: dashboardData.riskDistribution.high, fill: '#dc2626' },
      { name: 'Medium-High Risk', value: dashboardData.riskDistribution.mediumHigh, fill: '#ea580c' },
      { name: 'Medium Risk', value: dashboardData.riskDistribution.medium, fill: '#d97706' },
      { name: 'Low Risk', value: dashboardData.riskDistribution.low, fill: '#16a34a' }
    ];
  }, [dashboardData]);

  // Data untuk line chart berdasarkan wilayah teratas dari data penelitian
  const lineChartData = useMemo(() => {
    if (!dashboardData?.topRegions?.length) return [];
    
    // Mengambil 3 wilayah teratas
    const topThreeRegions = dashboardData.topRegions.slice(0, 3);
    
    // Membuat data tren berdasarkan variasi faktor risiko
    const quarters = ['Q1 2019', 'Q2 2020', 'Q3 2021', 'Q4 2022'];
    
    return quarters.map((quarter, index) => {
      const quarterData: Record<string, unknown> = { name: quarter };
      
      topThreeRegions.forEach(region => {
        // Simulasi tren berdasarkan data aktual dengan variasi realistis
        const baseValue = region.value || 0;
        const variation = (index * 0.1) - 0.15; // Variasi ±15% berdasarkan quarter
        const sanitasiFactor = (region.sanitasi || 0) > 0.8 ? 0.9 : 1.1; // Faktor sanitasi
        
        quarterData[region.name] = Math.max(
          Math.round(baseValue * (1 + variation) * sanitasiFactor),
          0
        );
      });
      
      return quarterData;
    });
  }, [dashboardData]);

  // Data untuk area chart berdasarkan distribusi kasus per wilayah dari data penelitian
  const areaChartData = useMemo(() => {
    if (!dashboardData?.topRegions?.length) return [];
    
    const topRegions = dashboardData.topRegions.slice(0, 6);
    
    return topRegions.map((region) => {
      return {
        name: region.name.length > 8 ? region.name.substring(0, 8) + '...' : region.name,
        kasus: region.value || 0,
        kepadatan: Math.round((region.kepadatan || 0) * 100) / 100,
        sanitasi: Math.round((region.sanitasi || 0) * 100) / 100
      };
    });
  }, [dashboardData]);

  return {
    barChartData,
    pieChartData,
    lineChartData,
    areaChartData,
    summaryStats: dashboardData?.summaryStats,
    loading,
    error
  };
}

/**
 * Hook untuk analisis spasial
 */
export function useSpatialAnalysis() {
  const { rawData, coefficients, patterns, loading, error } = useResearchData();

  // Mengidentifikasi hotspot berdasarkan clustering spasial
  const identifyHotspots = useCallback(() => {
    if (!rawData || rawData.length === 0) return [];
    
    return rawData
      .filter(item => item?.Penemuan && item.Penemuan > 2000)
      .map(item => ({
        region: item.NAMOBJ || 'Unknown',
        cases: item.Penemuan || 0,
        latitude: item.Latitude || 0,
        longitude: item.Longitude || 0,
        riskFactors: {
          kepadatan: item.Kepadatan || 0,
          sanitasi: item.Sanitasi || 0,
          airMinum: item.AirMinumLayak || 0,
          giziKurang: item.GiziKurang || 0
        }
      }));
  }, [rawData]);

  // Menganalisis efektivitas model GWNBR
  const analyzeModelEffectiveness = useCallback(() => {
    if (!coefficients || coefficients.length === 0) return null;

    const significantCoefficients = coefficients.filter(coef => 
      coef && (
        Math.abs(coef.GiziKurangZ || 0) > 1.96 || 
        Math.abs(coef.IMDZ || 0) > 1.96 ||
        Math.abs(coef.KepadatanZ || 0) > 1.96
      )
    );

    return {
      totalRegions: coefficients.length,
      significantRegions: significantCoefficients.length,
      effectivenessRate: coefficients.length > 0 
        ? (significantCoefficients.length / coefficients.length) * 100 
        : 0
    };
  }, [coefficients]);

  const hotspots = useMemo(() => identifyHotspots(), [identifyHotspots]);
  const modelEffectiveness = useMemo(() => analyzeModelEffectiveness(), [analyzeModelEffectiveness]);

  return {
    hotspots,
    modelEffectiveness,
    spatialPatterns: patterns || {},
    loading,
    error
  };
}