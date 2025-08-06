"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { InfoIcon, MapPinIcon } from "lucide-react";
import { MapLegend } from "./MapLegend";
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
            <CardDescription>Visualisasi data GWNBR per kabupaten/kota di Jawa Timur</CardDescription>
          </div>
          <Badge variant="secondary">Live</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 h-[500px] rounded-lg overflow-hidden relative">
          {renderMapContent()}
        </div>
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Navigasi Peta</CardTitle>
              <CardDescription>Pilih layer atau cari wilayah</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
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

                {wilayahError && <p className="text-xs text-destructive">Gagal memuat data wilayah.</p>}
                <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={popoverOpen}
                      className="w-full justify-between"
                      disabled={wilayahLoading || !selectedProvince}
                    >
                      {selectedRegion
                        ? selectedRegion.properties?.nama_kab
                        : "Cari Kabupaten/Kota..."}
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
                              const regionName = currentValue.toLowerCase();
                              const currentRegionName = selectedRegion?.properties?.nama_kab?.toLowerCase();

                              if (regionName === currentRegionName) {
                                handleRegionSelect(null);
                              } else {
                                // Find the exact region name from filteredRegions
                                const exactRegionName = filteredRegions.find(r => r.toLowerCase() === regionName);
                                handleRegionSelect(exactRegionName || null);
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
            </CardContent>
          </Card>
          <Card className="flex-grow">
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
          <MapLegend activeLayer={activeLayer} />
        </div>
      </CardContent>
    </Card>
  );
}
