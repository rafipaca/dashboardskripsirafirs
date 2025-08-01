import { FeatureCollection } from "geojson";

export interface GeojsonDataResponse {
  data: FeatureCollection | null;
  isLoading: boolean;
  error: Error | null;
}

export interface FetchOptions {
  maxRetries?: number;
  retryDelayMs?: number;
}

const DEFAULT_OPTIONS: Required<FetchOptions> = {
  maxRetries: 3,
  retryDelayMs: 3000,
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
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Gagal mengambil data: ${response.statusText}`);
        }

        const data = await response.json();
        return data as FeatureCollection;
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
