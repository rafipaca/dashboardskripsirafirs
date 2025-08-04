import { FeatureCollection } from "geojson";

export interface GeojsonDataResponse {
  data: FeatureCollection | null;
  isLoading: boolean;
  error: Error | null;
}

export interface FetchOptions {
  maxRetries?: number;
  retryDelayMs?: number;
  timeout?: number;
}

const DEFAULT_OPTIONS: Required<FetchOptions> = {
  maxRetries: 3,
  retryDelayMs: 3000,
  timeout: 30000, // Default timeout of 30 seconds
};

export class GeojsonService {
  private static instance: GeojsonService;
  
  public static getInstance(): GeojsonService {
    if (!GeojsonService.instance) {
      GeojsonService.instance = new GeojsonService();
    }
    return GeojsonService.instance;
  }

  async fetchGeojsonData(
    url: string,
    options: FetchOptions = {}
  ): Promise<FeatureCollection> {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    let attempts = 0;

    const tryFetch = async (): Promise<FeatureCollection> => {
      try {
        // Create an AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), opts.timeout);

        try {
          const response = await fetch(url, { 
            signal: controller.signal 
          });
          
          // Clear the timeout as fetch completed
          clearTimeout(timeoutId);
          
          if (!response.ok) {
            throw new Error(`Gagal mengambil data: ${response.statusText}`);
          }

          const data = await response.json();
          return data as FeatureCollection;
        } catch (err) {
          // Clean up the timeout if fetch fails
          clearTimeout(timeoutId);
          
          // Check if it's an abort error
          if (err instanceof Error && err.name === 'AbortError') {
            throw new Error(`Permintaan dibatalkan karena timeout (${opts.timeout/1000} detik)`);
          }
          
          throw err;
        }
      } catch (error) {
        attempts++;
        
        if (attempts < opts.maxRetries) {
          console.log(
            `Gagal memuat data, mencoba lagi dalam ${opts.retryDelayMs / 1000} detik... (percobaan ke ${attempts})`
          );
          
          await new Promise(resolve => setTimeout(resolve, opts.retryDelayMs));
          return tryFetch();
        } else {
          console.error("Gagal memuat data GeoJSON setelah beberapa kali percobaan:", error);
          throw error;
        }
      }
    };

    return tryFetch();
  }
}

export const geojsonService = GeojsonService.getInstance();
