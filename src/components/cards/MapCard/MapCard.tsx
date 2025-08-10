"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { MapPinIcon, LayersIcon } from "lucide-react";
// import { MapLegend } from "./MapLegend";
import { MapLoadingState } from "./MapLoadingState";
import { Feature, FeatureCollection } from "geojson";
import { MapErrorState } from "./MapErrorState";
import { useState, lazy, Suspense, useEffect } from "react";
import { useMapData } from "@/hooks/useMapData";
import { useWilayahData } from '@/hooks/useWilayahData';

// Lazy load MapClient to prevent SSR issues with Leaflet
const MapClient = lazy(() => import("@/components/maps/MapClient"));

interface MapCardProps {
  geojsonData: FeatureCollection | null;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  onRegionSelect?: (regionName: string | null) => void;
  onPredictionSelect?: (regionName: string | null) => void;
}

const mapLayers = [
  { value: 'significance', label: 'Peta Signifikansi' },
  { value: 'Penemuan', label: 'Tingkat Penemuan Kasus (Y)' },
  { value: 'GiziKurang', label: 'Gizi Kurang (X1)' },
  { value: 'IMD', label: 'IMD (X2)' },
  { value: 'RokokPerkapita', label: 'Rokok per Kapita (X3)' },
  { value: 'Kepadatan', label: 'Kepadatan Penduduk (X4)' },
  { value: 'AirMinumLayak', label: 'Air Minum Layak (X5)' },
  { value: 'Sanitasi', label: 'Sanitasi (X6)' },
];

// Komponen untuk menampilkan konten legenda secara langsung
function MapLegendContent({ activeLayer, geojsonData }: { activeLayer: string; geojsonData: FeatureCollection | null }) {
  const isSignificance = activeLayer === 'significance';
  const { findRegionData } = useMapData();
  
  // Tipe untuk item legenda dengan count
  interface LegendItem {
    label: string;
    color: string;
    count?: number;
  }
  
  // Untuk layer significance, kita perlu menganalisis data yang benar-benar ada
  const getActualSignificanceItems = (): LegendItem[] => {
    if (!geojsonData) return [];
    
    const colorCounts = new Map<string, LegendItem>();
    
    geojsonData.features.forEach(feature => {
      const regionName = feature?.properties?.NAMOBJ || feature?.properties?.WADMKK || "";
      const regionData = findRegionData(regionName);
      
      if (!regionData) {
        const existing = colorCounts.get('#B0B0B0') || { color: '#B0B0B0', label: 'Tidak Signifikan / Lainnya', count: 0 };
        colorCounts.set('#B0B0B0', { ...existing, count: (existing.count || 0) + 1 });
        return;
      }
      
      const significantVars = regionData.VariabelSignifikan;
      if (!significantVars) {
        const existing = colorCounts.get('#B0B0B0') || { color: '#B0B0B0', label: 'Tidak Signifikan / Lainnya', count: 0 };
        colorCounts.set('#B0B0B0', { ...existing, count: (existing.count || 0) + 1 });
        return;
      }
      
      const cleanVars = significantVars.toString().replace(/"/g, '').trim();
      if (cleanVars.toLowerCase().includes('tidak ada') || cleanVars === '') {
        const existing = colorCounts.get('#B0B0B0') || { color: '#B0B0B0', label: 'Tidak Signifikan / Lainnya', count: 0 };
        colorCounts.set('#B0B0B0', { ...existing, count: (existing.count || 0) + 1 });
        return;
      }
      
      const codes = new Set(cleanVars.split(',').map((code: string) => code.trim()));
      const has = (v: string) => codes.has(v);

      let color = '#B0B0B0';
      let label = 'Tidak Signifikan / Lainnya';
      
      if (has('X1') && has('X3') && has('X4') && codes.size === 3) {
        color = '#b91c1c';
        label = 'Gizi Kurang, Rokok per Kapita, Kepadatan Penduduk';
      } else if (has('X1') && has('X4') && codes.size === 2) {
        color = '#581c87';
        label = 'Gizi Kurang, Kepadatan Penduduk';
      } else if (has('X3') && has('X4') && codes.size === 2) {
        color = '#166534';
        label = 'Rokok per Kapita, Kepadatan Penduduk';
      } else if (has('X1') && codes.size === 1) {
        color = '#facc15';
        label = 'Gizi Kurang';
      } else if (has('X3') && codes.size === 1) {
        color = '#2563eb';
        label = 'Rokok per Kapita';
      } else if (has('X4') && codes.size === 1) {
        color = '#9333ea';
        label = 'Kepadatan Penduduk';
      }
      
      const existing = colorCounts.get(color) || { color, label, count: 0 };
      colorCounts.set(color, { ...existing, count: (existing.count || 0) + 1 });
    });
    
    // Hanya tampilkan yang benar-benar ada (count > 0)
    return Array.from(colorCounts.values())
      .filter(item => (item.count || 0) > 0)
      .sort((a, b) => (b.count || 0) - (a.count || 0)); // Urutkan berdasarkan jumlah (terbanyak dulu)
  };
  
  const significanceLegend = {
    title: 'Legenda Signifikansi Variabel',
    items: isSignificance ? getActualSignificanceItems() : [
      { label: 'Gizi Kurang, Rokok per Kapita, Kepadatan Penduduk', color: '#b91c1c' },
      { label: 'Gizi Kurang, Kepadatan Penduduk', color: '#581c87' },
      { label: 'Rokok per Kapita, Kepadatan Penduduk', color: '#166534' },
      { label: 'Gizi Kurang', color: '#facc15' },
      { label: 'Rokok per Kapita', color: '#2563eb' },
      { label: 'Kepadatan Penduduk', color: '#9333ea' },
      { label: 'Tidak Signifikan / Lainnya', color: '#B0B0B0' },
    ]
  };
  
  const choroplethLegend = {
    title: 'Legenda Peta Choropleth',
    items: [
      { label: 'Tinggi', color: '#b91c1c' },
      { label: '', color: '#ef4444' },
      { label: '', color: '#f97316' },
      { label: '', color: '#facc15' },
      { label: 'Rendah', color: '#fef08a' },
    ]
  };
  
  const layerTitles: Record<string, string> = {
    significance: 'Legenda Signifikansi Variabel',
    Penemuan: 'Legenda Tingkat Penemuan (Y)',
    GiziKurang: 'Legenda Gizi Kurang (X1)',
    IMD: 'Legenda IMD (X2)',
    RokokPerkapita: 'Legenda Rokok per Kapita (X3)',
    Kepadatan: 'Legenda Kepadatan Penduduk (X4)',
    AirMinumLayak: 'Legenda Air Minum Layak (X5)',
    Sanitasi: 'Legenda Sanitasi (X6)',
  };
  
  const legend = isSignificance ? significanceLegend : {
    ...choroplethLegend,
    title: layerTitles[activeLayer] || choroplethLegend.title,
  };
  
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {legend.items.map((item, index) => {
          const itemWithCount = item as LegendItem;
          const hasCount = isSignificance && itemWithCount.count && typeof itemWithCount.count === 'number';
          return (
            <div
              key={item.label || index}
              className="flex items-center space-x-3"
            >
              <div className="w-4 h-4 rounded-md shadow-sm" style={{ backgroundColor: item.color }} />
              <p className="text-xs text-muted-foreground font-medium">
                {item.label}
                {hasCount && (
                  <span className="ml-1 text-xs text-muted-foreground/70">
                    ({itemWithCount.count} wilayah)
                  </span>
                )}
              </p>
            </div>
          );
        })}
      </div>
      
      {/* Gradient bar for choropleth */}
      {!isSignificance && (
        <div className="pt-3 border-t border-border/30">
          <div className="flex justify-between text-xs text-muted-foreground font-medium mb-1">
            <span>Rendah</span>
            <span>Tinggi</span>
          </div>
          <div className="h-3 w-full rounded-md bg-gradient-to-r from-[#fef08a] via-[#f97316] to-[#b91c1c] shadow-inner" />
        </div>
      )}
    </div>
  );
}

export default function MapCard({ geojsonData, isLoading, error, onRetry, onRegionSelect, onPredictionSelect }: MapCardProps) {
  const [activeLayer, setActiveLayer] = useState('significance');
  const [selectedRegionName, setSelectedRegionName] = useState('');
  const { styleVersion } = useMapData();

  const { provinces: availableProvinces, regionsByProvince, loading: wilayahLoading, error: wilayahError } = useWilayahData();

  const [popoverOpen, setPopoverOpen] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<Feature | null>(null);

  // Filter duplicates and keep full names (Kota/Kabupaten) to avoid collisions like "Malang"
  const filteredRegions = (regionsByProvince[selectedProvince] || []).filter(Boolean);

  const handleProvinceChange = (province: string) => {
    setSelectedProvince(province);
    setSelectedRegion(null); // Reset region selection when province changes
  };

  // Effect to set a default province once data is loaded
  useEffect(() => {
    if (availableProvinces.length > 0 && !selectedProvince) {
      // Default to JAWA BARAT if it exists, otherwise the first province
      const defaultProvince = availableProvinces.find((p: string) => p.toUpperCase() === 'JAWA BARAT') || availableProvinces[0];
      setSelectedProvince(defaultProvince);
    }
  }, [availableProvinces, selectedProvince]);

  const handleRegionSelect = (regionName: string | null) => {
  setSelectedRegionName(regionName || '');
    
    // Find the feature strictly by NAMOBJ to avoid Kota/Kabupaten collisions
    let feature: Feature | null = null;
    if (regionName && geojsonData) {
      feature = geojsonData.features.find(f => f.properties?.NAMOBJ === regionName) as Feature | null;
      
      // Fallback (only if strict fails): try exact equality on alternative fields without stripping prefixes
      if (!feature) {
        feature = geojsonData.features.find(f => {
          const props = f.properties;
          return props?.WADMKK === regionName || props?.nama_kab === regionName;
        }) as Feature | null;
      }
    }
    setSelectedRegion(feature);

    // Always pass the exact CSV-matching name when available
    const exactName = feature?.properties?.NAMOBJ || regionName || null;
  onRegionSelect?.(exactName);
  onPredictionSelect?.(exactName);
  };

  const renderMapContent = () => {
    if (isLoading) return <MapLoadingState />;
    if (error) return <MapErrorState error={error} onRetry={onRetry} />;
    if (geojsonData) {
      return (
        <Suspense fallback={<MapLoadingState />}>
          <MapClient 
            key={`map-${styleVersion}-${activeLayer}-${geojsonData?.features?.length ?? 0}`}
            data={geojsonData} 
            onRegionSelect={handleRegionSelect}
            activeLayer={activeLayer} 
            selectedRegion={selectedRegion?.properties?.NAMOBJ || selectedRegion?.properties?.WADMKK || selectedRegion?.properties?.nama_kab}
          />
        </Suspense>
      );
    }
    return <MapLoadingState />;
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MapPinIcon className="w-6 h-6 text-primary" />
              Peta Interaktif Analisis Pneumonia
            </CardTitle>
            <CardDescription>Visualisasi data GWNBR per kabupaten/kota di Pulau Jawa</CardDescription>
          </div>
          <Badge variant="secondary">Live</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        {/* Peta Full Width */}
        <div className="w-full h-[600px] rounded-lg overflow-hidden relative">
          {renderMapContent()}
        </div>
        
        {/* Navigasi dan Kontrol di bawah peta */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
           {/* Navigasi Peta */}
           <Card>
             <CardHeader className="pb-2">
               <CardTitle className="text-lg">Navigasi Peta</CardTitle>
               <CardDescription>Pilih layer atau cari wilayah</CardDescription>
             </CardHeader>
             <CardContent>
               <div className="space-y-4">
                 <div>
                   <label className="text-sm font-medium mb-2 block">Layer Peta</label>
                   <Select value={activeLayer} onValueChange={setActiveLayer}>
                     <SelectTrigger>
                       <SelectValue placeholder="Pilih Layer" />
                     </SelectTrigger>
                     <SelectContent>
                       {mapLayers.map(layer => (
                         <SelectItem key={layer.value} value={layer.value}>
                           {layer.label}
                         </SelectItem>
                       ))}
                     </SelectContent>
                   </Select>
                 </div>

                 <div>
                   <label className="text-sm font-medium mb-2 block">Provinsi</label>
                   <Select value={selectedProvince} onValueChange={handleProvinceChange} disabled={wilayahLoading}>
                     <SelectTrigger>
                       <SelectValue placeholder="Pilih Provinsi" />
                     </SelectTrigger>
                     <SelectContent>
                       {availableProvinces.map(province => (
                         <SelectItem key={province} value={province}>
                           {province}
                         </SelectItem>
                       ))}
                     </SelectContent>
                   </Select>
                 </div>

                 <div>
                   <label className="text-sm font-medium mb-2 block">Kabupaten/Kota</label>
                   {wilayahError && <p className="text-xs text-destructive mb-2">Gagal memuat data wilayah.</p>}
                  <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                     <PopoverTrigger asChild>
                       <Button
                         variant="outline"
                         role="combobox"
                         aria-expanded={popoverOpen}
                         className="w-full justify-between"
                         disabled={wilayahLoading || !selectedProvince}
                       >
                         {selectedRegionName || "Cari Kabupaten/Kota..."}
                         <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                       </Button>
                     </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0 max-h-96 overflow-auto">
                      <Command>
                         <CommandInput placeholder="Cari wilayah..." />
                         <CommandEmpty>Wilayah tidak ditemukan.</CommandEmpty>
                         <CommandGroup>
                           {filteredRegions.map((region, index) => (
                             <CommandItem
                               key={`${selectedProvince}-${region}-${index}`}
                               value={region}
                               onSelect={(currentValue) => {
                                 const regionName = currentValue;
                                 const currentRegionName = selectedRegionName;

                                 if (regionName === currentRegionName) {
                                   handleRegionSelect(null);
                                 } else {
                                   handleRegionSelect(regionName);
                                 }
                                 setPopoverOpen(false);
                               }}
                             >
                               {region}
                             </CommandItem>
                           ))}
                         </CommandGroup>
                       </Command>
                     </PopoverContent>
                   </Popover>
                 </div>
               </div>
             </CardContent>
           </Card>
          
          {/* Legenda - Selalu Terbuka */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <LayersIcon className="w-4 h-4" />
                Legenda
              </CardTitle>
              <CardDescription>Keterangan warna dan simbol peta</CardDescription>
            </CardHeader>
            <CardContent>
              <MapLegendContent activeLayer={activeLayer} geojsonData={geojsonData} />
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
