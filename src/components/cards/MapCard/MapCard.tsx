"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { FeatureCollection } from "geojson";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InfoIcon, MapPinIcon } from "lucide-react";
import { MapLegend } from "./MapLegend";
import { MapLoadingState } from "./MapLoadingState";
import { MapErrorState } from "./MapErrorState";

interface MapCardProps {
  geojsonData: FeatureCollection | null;
  isLoading: boolean;
  error: Error | null;
  onRetry: () => void;
  onRegionSelect: (region: string) => void;
}

const MapClient = dynamic(() => import("@/components/maps/MapClient"), {
  loading: () => <MapLoadingState />,
  ssr: false,
});

export default function MapCard({ geojsonData, isLoading, error, onRetry, onRegionSelect }: MapCardProps) {
  const renderMapContent = () => {
    if (isLoading) {
      return <MapLoadingState />;
    }

    if (error) {
      return <MapErrorState error={error} onRetry={onRetry} />;
    }

    if (geojsonData) {
      return <MapClient data={geojsonData} onRegionSelect={onRegionSelect} />;
    }

    return <MapLoadingState />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      <Card className="w-full transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 group bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader className="transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-primary/5 group-hover:via-transparent group-hover:to-primary/5 flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold transition-colors duration-300 group-hover:text-primary bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
              📍 Peta Sebaran Interaktif
            </CardTitle>
            <CardDescription className="text-muted-foreground text-sm font-medium">
              Distribusi geografis kasus pneumonia balita di Pulau Jawa dengan data penelitian asli
            </CardDescription>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Badge 
              variant="secondary" 
              className="transition-all duration-300 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 shadow-sm"
            >
              🏝️ Pulau Jawa
            </Badge>
          </motion.div>
        </CardHeader>
        
        <CardContent className="transition-all duration-300 space-y-4">
          <motion.div 
            className="h-[650px] w-full rounded-xl overflow-hidden border border-border/30 bg-gradient-to-br from-background via-muted/10 to-background shadow-inner"
            whileHover={{ scale: 1.002 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {renderMapContent()}
          </motion.div>
          
          <motion.div 
            className="flex justify-between items-center pt-2 border-t border-border/30"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            <div className="flex items-center gap-3">
              <MapLegend />
              <div className="h-4 w-px bg-border/50" />
              <motion.div 
                className="text-sm font-medium text-muted-foreground flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
              >
                <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
                {geojsonData ? `${geojsonData.features.length} Wilayah Tersedia` : 'Memuat data...'}
              </motion.div>
            </div>
            
            <motion.div 
              className="flex items-center gap-2 text-xs text-muted-foreground/80"
              whileHover={{ scale: 1.05 }}
            >
              <InfoIcon className="h-3 w-3" />
              <span>Klik wilayah untuk detail data asli</span>
            </motion.div>
          </motion.div>
        </CardContent>
        
        <CardFooter className="pt-0 pb-6">
          <div className="w-full bg-gradient-to-r from-transparent via-border/20 to-transparent h-px" />
          <motion.div 
            className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <MapPinIcon className="h-3 w-3" />
            <span>Data terkini dari sistem monitoring kesehatan</span>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
