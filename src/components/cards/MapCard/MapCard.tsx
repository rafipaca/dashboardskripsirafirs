"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { InfoIcon, MapPinIcon, LayersIcon } from "lucide-react";
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
function MapLegendContent({ activeLayer }: { activeLayer: string }) {
  const isSignificance = activeLayer === 'significance';
  
  const significanceLegend = {
    title: 'Legenda Signifikansi Variabel',
    items: [
      { label: 'Signifikan (X1, X3, X4)', color: '#b91c1c' },
      { label: 'Signifikan (X1, X4)', color: '#581c87' },
      { label: 'Signifikan (X3, X4)', color: '#166534' },
      { label: 'Signifikan (X1)', color: '#facc15' },
      { label: 'Signifikan (X3)', color: '#2563eb' },
      { label: 'Signifikan (X4)', color: '#9333ea' },
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
        {legend.items.map((item, index) => (
          <div
            key={item.label || index}
            className="flex items-center space-x-3"
          >
            <div className="w-4 h-4 rounded-md shadow-sm" style={{ backgroundColor: item.color }} />
            <p className="text-xs text-muted-foreground font-medium">
              {item.label}
            </p>
          </div>
        ))}
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
  const { generateModelEquation } = useMapData();

  const { provinces: availableProvinces, regionsByProvince, loading: wilayahLoading, error: wilayahError } = useWilayahData();

  const [popoverOpen, setPopoverOpen] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<Feature | null>(null);

  const filteredRegions = regionsByProvince[selectedProvince] || [];

  const handleProvinceChange = (province: string) => {
    setSelectedProvince(province);
    setSelectedRegion(null); // Reset region selection when province changes
  };

  // Effect to set a default province once data is loaded
  useEffect(() => {
    if (availableProvinces.length > 0 && !selectedProvince) {
      // Default to JAWA TIMUR if it exists, otherwise the first province
      const defaultProvince = availableProvinces.find(p => p.toUpperCase() === 'JAWA TIMUR') || availableProvinces[0];
      setSelectedProvince(defaultProvince);
    }
  }, [availableProvinces, selectedProvince]);

  const handleRegionSelect = (regionName: string | null) => {
    setSelectedRegionName(regionName || '');
    
    // Find the feature that corresponds to the region name
    // Try multiple property names and formats to match with GeoJSON data
    const feature = geojsonData?.features.find(f => {
      const props = f.properties;
      const geoName = props?.NAMOBJ || props?.WADMKK || props?.nama_kab;
      
      if (!regionName || !geoName) return false;
      
      // Direct match
      if (geoName === regionName) return true;
      
      // Try matching with "Kota" or "Kabupaten" prefix added to GeoJSON name
      const kotaName = `Kota ${geoName}`;
      const kabName = `Kabupaten ${geoName}`;
      
      if (kotaName === regionName || kabName === regionName) return true;
      
      // Try matching with prefix removed from regionName
      const cleanRegionName = regionName.replace(/^(Kota|Kabupaten)\s+/i, '');
      if (geoName === cleanRegionName) return true;
      
      return false;
    }) || null;
    setSelectedRegion(feature);

    onRegionSelect?.(regionName);
    onPredictionSelect?.(regionName);
  };

  const renderMapContent = () => {
    if (isLoading) return <MapLoadingState />;
    if (error) return <MapErrorState error={error} onRetry={onRetry} />;
    if (geojsonData) {
      return (
        <Suspense fallback={<MapLoadingState />}>
          <MapClient 
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
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
                     <PopoverContent className="w-[300px] p-0">
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
          
          {/* Detail Wilayah */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Wilayah</CardTitle>
              <CardDescription>Detail model untuk wilayah terpilih</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                <InfoIcon className="h-3 w-3" />
                <span>Klik wilayah untuk detail model regresi</span>
              </div>
              <p className="text-sm font-mono bg-muted p-2 rounded-md break-words">
                {selectedRegionName 
                  ? generateModelEquation(selectedRegionName)
                  : 'Pilih wilayah pada peta untuk melihat modelnya.'}
              </p>
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
              <MapLegendContent activeLayer={activeLayer} />
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
