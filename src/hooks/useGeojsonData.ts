import { useState, useEffect, useCallback } from "react";
import { FeatureCollection } from "geojson";
import { geojsonService } from "@/lib/api/geojson";

export interface UseGeojsonDataOptions {
  url?: string;
  maxRetries?: number;
  retryDelayMs?: number;
}

export interface UseGeojsonDataReturn {
  data: FeatureCollection | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useGeojsonData = ({
  url = "/data/rbipulaujawageojson.geojson",
  maxRetries = 3,
  retryDelayMs = 3000,
}: UseGeojsonDataOptions = {}): UseGeojsonDataReturn => {
  const [data, setData] = useState<FeatureCollection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await geojsonService.fetchGeojsonData(url, {
        maxRetries,
        retryDelayMs,
      });

      if (!result) {
        throw new Error("Failed to load GeoJSON data");
      }

      setData(result);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      console.error("Error loading GeoJSON data:", errorMessage);
      setError(err instanceof Error ? err : new Error(errorMessage));
    } finally {
      setIsLoading(false);
    }
  }, [url, maxRetries, retryDelayMs]);

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
