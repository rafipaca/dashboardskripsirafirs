import { useCallback } from 'react';
import { useResearchData } from './useResearchData';

interface MapRegionData {
  name: string;
  cases: number;
  kepadatan: number;
  sanitasi: number;
  airMinumLayak: number;
  giziKurang: number;
  riskLevel: 'High' | 'Medium-high' | 'Medium' | 'Low' | 'Unknown';
  variabelSignifikan?: string;
}

interface UseMapDataReturn {
  getRegionColor: (name: string) => string;
  getRegionData: (name: string) => MapRegionData | null;
  generateTooltipContent: (properties: Record<string, unknown>) => string;
  loading: boolean;
  error: string | null;
}

export function useMapData(): UseMapDataReturn {
  const { rawData, loading, error } = useResearchData();

  // Fungsi untuk menentukan risk level berdasarkan data penelitian aktual
  const calculateRiskLevel = useCallback((cases: number): 'High' | 'Medium-high' | 'Medium' | 'Low' | 'Unknown' => {
    // Berdasarkan distribusi data penelitian yang sebenarnya
    if (cases >= 8000) return 'High';       // > 8000 kasus
    if (cases >= 4000) return 'Medium-high'; // 4000-8000 kasus  
    if (cases >= 2000) return 'Medium';      // 2000-4000 kasus
    if (cases > 0) return 'Low';             // < 2000 kasus
    return 'Unknown';
  }, []);

  // Fungsi untuk normalisasi nama wilayah agar sesuai dengan data GeoJSON
  const normalizeRegionName = useCallback((name: string): string => {
    return name
      .toLowerCase()
      .replace(/kab\.|kabupaten|kota|adm\.|administrasi/gi, '')
      .replace(/\s+/g, ' ')
      .replace(/[^a-z0-9\s]/g, '') // Hapus karakter khusus
      .trim();
  }, []);

  // Fungsi untuk mencocokkan nama wilayah dengan data penelitian
  const findRegionData = useCallback((geoJsonName: string) => {
    if (!rawData || rawData.length === 0) {
      return null;
    }
    
    const normalizedGeoName = normalizeRegionName(geoJsonName);
    
    // Coba berbagai kemungkinan nama properti dari GeoJSON
    const possibleNames = [
      geoJsonName,
      normalizedGeoName,
      geoJsonName.replace(/^(KAB\.|KOTA|KABUPATEN)/i, '').trim(),
      geoJsonName.replace(/^(KAB\s|KOTA\s|KABUPATEN\s)/i, '').trim()
    ];

    // Pertama, coba exact match
    for (const possibleName of possibleNames) {
      const found = rawData.find(item => {
        if (!item || !item.NAMOBJ) return false;
        
        const dataName = normalizeRegionName(item.NAMOBJ);
        const searchName = normalizeRegionName(possibleName);
        
        return dataName === searchName || 
               item.NAMOBJ.toLowerCase() === possibleName.toLowerCase();
      });
      
      if (found) return found;
    }

    // Jika tidak ada exact match, coba partial match
    for (const possibleName of possibleNames) {
      const found = rawData.find(item => {
        if (!item || !item.NAMOBJ) return false;
        
        const dataName = normalizeRegionName(item.NAMOBJ);
        const searchName = normalizeRegionName(possibleName);
        
        // Cek apakah salah satu mengandung yang lain (minimal 3 karakter)
        if (searchName.length >= 3 && dataName.length >= 3) {
          return dataName.includes(searchName) || searchName.includes(dataName);
        }
        
        return false;
      });
      
      if (found) return found;
    }
    
    return null;
  }, [rawData, normalizeRegionName]);

  const getRegionColor = useCallback((name: string): string => {
    if (!rawData || rawData.length === 0) return '#60a5fa';
    
    const regionData = findRegionData(name);
    
    if (regionData && regionData.Penemuan !== undefined) {
      const riskLevel = calculateRiskLevel(regionData.Penemuan);
      switch (riskLevel) {
        case 'High':
          return '#dc2626'; // Red-600
        case 'Medium-high':
          return '#ea580c'; // Orange-600
        case 'Medium':
          return '#d97706'; // Amber-600  
        case 'Low':
          return '#16a34a'; // Green-600
        default:
          return '#2563eb'; // Blue-600
      }
    }
    
    return '#6b7280'; // Gray-500 untuk data tidak ditemukan
  }, [rawData, findRegionData, calculateRiskLevel]);

  const getRegionData = useCallback((name: string): MapRegionData | null => {
    if (!rawData || rawData.length === 0) return null;
    
    const regionData = findRegionData(name);
    
    if (regionData) {
      return {
        name: regionData.NAMOBJ || name,
        cases: regionData.Penemuan || 0,
        kepadatan: regionData.Kepadatan || 0,
        sanitasi: regionData.Sanitasi || 0,
        airMinumLayak: regionData.AirMinumLayak || 0,
        giziKurang: regionData.GiziKurang || 0,
        riskLevel: calculateRiskLevel(regionData.Penemuan || 0),
        variabelSignifikan: regionData.VariabelSignifikan
      };
    }
    
    return null;
  }, [rawData, findRegionData, calculateRiskLevel]);

  const generateTooltipContent = useCallback((properties: Record<string, unknown>): string => {
    // Coba berbagai kemungkinan nama properti dari GeoJSON
    const nama = (properties.NAMOBJ || 
                  properties.WADMKK || 
                  properties.NAME_2 || 
                  properties.NAME_1 ||
                  properties.name ||
                  '(Tanpa Nama)') as string;
    
    const regionData = getRegionData(nama);
    
    // Simple debug log
    if (!regionData) {
      console.log(`No data found for region: ${nama}`);
    }
    
    if (regionData) {
      const getRiskColorClass = (riskLevel: string) => {
        switch (riskLevel) {
          case 'High': return 'text-red-600';
          case 'Medium-high': return 'text-orange-600';
          case 'Medium': return 'text-amber-600';
          case 'Low': return 'text-green-600';
          default: return 'text-gray-600';
        }
      };

      return `
        <div class="map-tooltip">
          <h3 class="font-bold text-base text-gray-900">${regionData.name}</h3>
          <div class="text-sm mt-2 space-y-1">
            <div class="flex justify-between">
              <span class="font-medium text-gray-600">Kasus Pneumonia:</span> 
              <span class="font-bold text-gray-900">${regionData.cases.toLocaleString()}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium text-gray-600">Kepadatan Penduduk:</span> 
              <span class="text-gray-800">${regionData.kepadatan.toLocaleString()}/km²</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium text-gray-600">Sanitasi Layak:</span> 
              <span class="text-gray-800">${regionData.sanitasi.toFixed(1)}%</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium text-gray-600">Air Minum Layak:</span> 
              <span class="text-gray-800">${regionData.airMinumLayak.toFixed(1)}%</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium text-gray-600">Gizi Kurang:</span> 
              <span class="text-gray-800">${regionData.giziKurang.toLocaleString()}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium text-gray-600">Tingkat Risiko:</span> 
              <span class="font-bold ${getRiskColorClass(regionData.riskLevel)}">
                ${regionData.riskLevel}
              </span>
            </div>
            ${regionData.variabelSignifikan ? 
              `<div class="mt-2 p-2 bg-blue-50 rounded border-l-2 border-blue-400">
                <span class="font-medium text-blue-700">Variabel Signifikan:</span><br>
                <span class="text-blue-800 text-xs">${regionData.variabelSignifikan}</span>
              </div>` 
              : ''
            }
          </div>
        </div>
      `;
    }
    
    return `
      <div class="map-tooltip">
        <h3 class="font-bold text-base text-gray-900">${nama}</h3>
        <div class="text-sm mt-2">
          <div class="text-gray-600">Data penelitian tidak tersedia untuk wilayah ini</div>
        </div>
      </div>
    `;
  }, [getRegionData]);

  return {
    getRegionColor,
    getRegionData,
    generateTooltipContent,
    loading,
    error
  };
}
