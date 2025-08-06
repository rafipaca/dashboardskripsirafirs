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

      setData(result);
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
