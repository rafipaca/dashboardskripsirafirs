import { useMemo } from 'react';
import { useResearchData } from './useResearchData';
import { useGeojsonData } from './useGeojsonData';
import { useMapData } from './useMapData';

/**
 * Hook untuk mengintegrasikan semua data yang diperlukan untuk map
 */
export function useMapIntegration() {
  const { rawData, loading: dataLoading, error: dataError } = useResearchData();
  const { data: geojsonData, isLoading: geojsonLoading, error: geojsonError } = useGeojsonData();
  const { getRegionColor, getRegionData, generateTooltipContent } = useMapData();

  // Gabungkan status loading dan error
  const loading = dataLoading || geojsonLoading;
  const error = dataError || geojsonError?.message || null;

  // Statistik untuk map
  const mapStats = useMemo(() => {
    if (!rawData || rawData.length === 0) {
      return {
        totalRegions: 0,
        totalCases: 0,
        highRiskRegions: 0,
        avgCasesPerRegion: 0
      };
    }

    const totalCases = rawData.reduce((sum, item) => sum + (item.Penemuan || 0), 0);
    const highRiskRegions = rawData.filter(item => (item.Penemuan || 0) > 8000).length;

    return {
      totalRegions: rawData.length,
      totalCases,
      highRiskRegions,
      avgCasesPerRegion: Math.round(totalCases / rawData.length)
    };
  }, [rawData]);

  return {
    // Data
    rawData,
    geojsonData,
    mapStats,
    
    // Status
    loading,
    error,
    
    // Map functions
    getRegionColor,
    getRegionData,
    generateTooltipContent,
    
    // Computed values
    hasData: !loading && !error && rawData.length > 0 && geojsonData !== null
  };
}