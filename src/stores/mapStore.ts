import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { MapStore } from './types';
import { Feature, FeatureCollection } from 'geojson';

const initialState = {
  geojsonData: null,
  selectedFeature: null,
  mapCenter: [-7.2575, 112.7521] as [number, number], // Center of Java Island
  mapZoom: 8,
  isLoading: false,
  error: null
};

export const useMapStore = create<MapStore>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        // Actions
        setGeojsonData: (data: FeatureCollection | null) => 
          set({ geojsonData: data }, false, 'setGeojsonData'),

        setSelectedFeature: (feature: Feature | null) => 
          set({ selectedFeature: feature }, false, 'setSelectedFeature'),

        setMapCenter: (center: [number, number]) => 
          set({ mapCenter: center }, false, 'setMapCenter'),

        setMapZoom: (zoom: number) => 
          set({ mapZoom: zoom }, false, 'setMapZoom'),

        setLoading: (loading: boolean) => 
          set({ isLoading: loading }, false, 'setLoading'),

        setError: (error: string | null) => 
          set({ error }, false, 'setError'),

        reset: () => 
          set(initialState, false, 'reset'),
      }),
      {
        name: 'map-store',
        partialize: (state) => ({
          mapCenter: state.mapCenter,
          mapZoom: state.mapZoom,
        }),
      }
    ),
    { name: 'map-store' }
  )
);

// Selectors
export const useMapSelectors = () => {
  const store = useMapStore();
  
  return {
    // Basic selectors
    geojsonData: store.geojsonData,
    selectedFeature: store.selectedFeature,
    mapCenter: store.mapCenter,
    mapZoom: store.mapZoom,
    isLoading: store.isLoading,
    error: store.error,
    
    // Computed selectors
    hasGeojsonData: store.geojsonData !== null,
    hasSelectedFeature: store.selectedFeature !== null,
    hasError: store.error !== null,
    isReady: !store.isLoading && !store.error && store.geojsonData !== null,
    
    // Feature properties
    selectedRegionName: store.selectedFeature?.properties?.['nama_kab'] || 
                       store.selectedFeature?.properties?.['NAMOBJ'] || 
                       store.selectedFeature?.properties?.['WADMKK'] || 
                       store.selectedFeature?.properties?.['NAME_2'] || null,
    
    selectedRegionCode: store.selectedFeature?.properties?.['KODE_KAB'] || 
                       store.selectedFeature?.properties?.['kode_kab'] || null
  };
};

// Helper functions
export const useMapActions = () => {
  const {
    setGeojsonData,
    setSelectedFeature,
    setMapCenter,
    setMapZoom,
    setLoading,
    setError,
    reset
  } = useMapStore();

  return {
    // Basic actions
    setGeojsonData,
    setSelectedFeature,
    setMapCenter,
    setMapZoom,
    setLoading,
    setError,
    reset,
    
    // Compound actions
    selectFeatureByRegionName: (regionName: string) => {
      const { geojsonData } = useMapStore.getState();
      if (!geojsonData) return;
      
      const feature = geojsonData.features.find(f => 
        f.properties?.['nama_kab'] === regionName ||
        f.properties?.['NAMOBJ'] === regionName ||
        f.properties?.['WADMKK'] === regionName ||
        f.properties?.['NAME_2'] === regionName
      );
      
      if (feature) {
        setSelectedFeature(feature);
      }
    },
    
    clearSelection: () => {
      setSelectedFeature(null);
    },
    
    zoomToFeature: (feature: Feature) => {
      // Simple implementation - you might want to use a proper bounds calculation
      if (feature.geometry.type === 'Point') {
        const coords = feature.geometry.coordinates as [number, number];
        setMapCenter([coords[1], coords[0]]); // Note: GeoJSON is [lng, lat], Leaflet is [lat, lng]
        setMapZoom(12);
      }
    }
  };
};