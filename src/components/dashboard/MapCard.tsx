"use client";

import dynamic from "next/dynamic";
import { FeatureCollection } from "geojson";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, MapPinIcon, AlertCircle } from "lucide-react";

interface MapCardProps {
  geojsonData: FeatureCollection | null;
  isLoading: boolean;
  error: Error | null;
  onRetry: () => void;
  onRegionSelect: (region: string) => void;
}

const Map = dynamic(() => import("@/components/Map"), {
  loading: () => (
    <div className="flex flex-col items-center justify-center h-full bg-background">
      <MapPinIcon className="h-12 w-12 text-muted-foreground animate-pulse" />
      <p className="mt-4 text-muted-foreground">Memuat komponen peta...</p>
    </div>
  ),
  ssr: false,
});

export default function MapCard({ geojsonData, isLoading, error, onRetry, onRegionSelect }: MapCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Peta Sebaran</CardTitle>
          <CardDescription>
            Distribusi geografis kasus pneumonia balita di Pulau Jawa
          </CardDescription>
        </div>
        <Badge variant="secondary">Pulau Jawa</Badge>
      </CardHeader>
      <CardContent>
        <div className="h-[600px] w-full rounded-lg overflow-hidden border border-input bg-card">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full bg-secondary/10">
              <Skeleton className="h-12 w-12 rounded-full" />
              <p className="mt-4 text-muted-foreground">Memuat data geografis...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full">
              <Alert variant="destructive" className="max-w-md">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Gagal Memuat Data</AlertTitle>
                <AlertDescription>
                  Tidak dapat memuat data geografis. Periksa koneksi internet Anda.
                  <br />
                  <Button variant="secondary" size="sm" className="mt-4" onClick={onRetry}>
                    Coba Lagi
                  </Button>
                </AlertDescription>
              </Alert>
            </div>
          ) : geojsonData ? (
            <Map data={geojsonData} onRegionSelect={onRegionSelect} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
               <Alert variant="default" className="max-w-md text-center">
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>Data Tidak Ditemukan</AlertTitle>
                <AlertDescription>
                  Data geografis tidak ditemukan.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">
          * Klik pada wilayah untuk melihat detail kasus
        </p>
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="outline" size="sm">Lihat Legenda</Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-60">
            <div className="space-y-2">
              <h4 className="font-medium">Legenda Warna</h4>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: 'oklch(var(--risk-high))' }}></div>
                <span className="text-sm">Risiko Tinggi (&gt;100 kasus)</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: 'oklch(var(--risk-medium-high))' }}></div>
                <span className="text-sm">Risiko Sedang-Tinggi (50-100 kasus)</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: 'oklch(var(--risk-medium))' }}></div>
                <span className="text-sm">Risiko Sedang (25-50 kasus)</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: 'oklch(var(--risk-low))' }}></div>
                <span className="text-sm">Risiko Rendah (&lt;25 kasus)</span>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </CardFooter>
    </Card>
  );
} 