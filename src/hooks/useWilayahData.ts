import { useState, useEffect } from 'react';
import { loadWilayahData, ProvinceDataMap } from '@/lib/data/wilayah-indonesia';

export interface WilayahDataHook {
  provinces: string[];
  regionsByProvince: ProvinceDataMap;
  loading: boolean;
  error: string | null;
}

export function useWilayahData(): WilayahDataHook {
  const [regionsByProvince, setRegionsByProvince] = useState<ProvinceDataMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const data = await loadWilayahData();
        if (Object.keys(data).length === 0) {
            throw new Error('Data wilayah tidak dapat dimuat atau kosong.');
        }
        setRegionsByProvince(data);
      } catch (err: any) {
        setError(err.message || 'Gagal memuat data wilayah');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { 
    provinces: Object.keys(regionsByProvince),
    regionsByProvince, 
    loading, 
    error 
  };
}
