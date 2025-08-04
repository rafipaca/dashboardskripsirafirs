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
  error: Error | null;
  refetch: () => void;
}

export const useGeojsonData = ({
  // Use the optimized version by default for Vercel deployment
  url = "/data/rbipulaujawageojson.min.geojson",
  maxRetries = 3,
  retryDelayMs = 3000,
  timeout = 30000, // 30 seconds timeout
}: UseGeojsonDataOptions = {}): UseGeojsonDataReturn => {
  const [data, setData] = useState<FeatureCollection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // First try with the specified file
      try {
        const result = await geojsonService.fetchGeojsonData(url, {
          maxRetries,
          retryDelayMs,
          timeout,
        });

        if (!result) {
          throw new Error("Failed to load GeoJSON data");
        }

        setData(result);
        return;
      } catch (primaryErr) {
        console.log("Primary GeoJSON load failed, trying fallback...", primaryErr);
        
        // If the main file fails, try an even smaller fallback
        const isFallbackAlreadyAttempted = url.includes('.min.geojson');
        const fallbackUrl = isFallbackAlreadyAttempted 
          ? "/data/rbipulaujawageojson.tiny.geojson" 
          : "/data/rbipulaujawageojson.min.geojson";
        
        try {
          const fallbackResult = await geojsonService.fetchGeojsonData(fallbackUrl, {
            maxRetries: 1,
            retryDelayMs: 2000,
            timeout: 20000, // Reduced timeout for fallback
          });
          
          if (fallbackResult) {
            setData(fallbackResult);
            console.log("Successfully loaded fallback GeoJSON");
            return;
          }
        } catch (fallbackErr) {
          console.error("Fallback load also failed:", fallbackErr);
          throw new Error(
            "Tidak dapat memuat peta. File terlalu besar untuk Vercel. " +
            "Silakan gunakan versi local atau optimasi file."
          );
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      console.error("Error loading GeoJSON data:", errorMessage);
      setError(err instanceof Error ? err : new Error(errorMessage));
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
