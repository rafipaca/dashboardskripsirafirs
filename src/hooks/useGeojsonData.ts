import { useState, useEffect, useCallback } from "react";
import { FeatureCollection } from "geojson";
import { geojsonService } from "@/lib/api/geojson";

export interface UseGeojsonDataOptions {
  url?: string;
  maxRetries?: number;
  retryDelayMs?: number;
  timeout?: number;
}

export interface UseGeojsonDataReturn {
  data: FeatureCollection | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

// Daftar provinsi di Pulau Jawa
const JAVA_PROVINCES = [
  'BANTEN',
  'DKI JAKARTA', 
  'JAWA BARAT',
  'JAWA TENGAH',
  'DAERAH ISTIMEWA YOGYAKARTA',
  'JAWA TIMUR'
];

// Fungsi untuk memfilter data geojson agar hanya menampilkan Pulau Jawa
const filterJavaOnly = (geojsonData: FeatureCollection): FeatureCollection => {
  const filteredFeatures = geojsonData.features.filter(feature => {
    const properties = feature.properties;
    if (!properties) return false;
    
    // Cek berbagai kemungkinan nama properti untuk provinsi
    const provinceName = properties.WADMPR || properties.PROVINSI || properties.province || properties.NAMOBJ;
    
    if (!provinceName || typeof provinceName !== 'string') return false;
    
    // Normalisasi nama provinsi dan cek apakah termasuk dalam daftar Pulau Jawa
    const normalizedProvince = provinceName.toUpperCase().trim();
    return JAVA_PROVINCES.some(javaProvince => 
      normalizedProvince.includes(javaProvince) || javaProvince.includes(normalizedProvince)
    );
  });
  
  return {
    ...geojsonData,
    features: filteredFeatures
  };
};

export const useGeojsonData = ({
  url = "/data/rbipulaujawa.geojson",
  maxRetries = 3,
  retryDelayMs = 3000,
  timeout = 30000, // 30 seconds timeout
}: UseGeojsonDataOptions = {}): UseGeojsonDataReturn => {
  const [data, setData] = useState<FeatureCollection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await geojsonService.fetchGeojsonData(url, {
        maxRetries,
        retryDelayMs,
        timeout,
      });

      if (!result) {
        throw new Error("Data GeoJSON yang diterima kosong atau tidak valid.");
      }

      // Filter data agar hanya menampilkan Pulau Jawa
      const filteredData = filterJavaOnly(result);
      
      if (filteredData.features.length === 0) {
        console.warn("Tidak ada data Pulau Jawa yang ditemukan dalam GeoJSON");
      }

      setData(filteredData);
    } catch (err: unknown) {
      const errorMessage = (err instanceof Error ? err.message : String(err)) || "Terjadi kesalahan yang tidak diketahui saat memuat data.";
      console.error("Gagal memuat GeoJSON:", errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [url, maxRetries, retryDelayMs, timeout]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    refetch,
  };
};
