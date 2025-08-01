"use client";

import dynamic from 'next/dynamic';
import { FeatureCollection } from "geojson";
import { Loader2 } from "lucide-react";

// Dynamically import the client-side only Map component
const MapClient = dynamic(() => import('./MapClient'), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] w-full bg-gradient-to-br from-background via-muted/20 to-background rounded-xl border border-border/50 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 animate-pulse" />
      <div className="relative z-10 flex flex-col items-center gap-3">
        <div className="relative">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <div className="absolute inset-0 h-8 w-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '3s' }} />
        </div>
        <p className="text-sm font-medium text-foreground/80">Loading interactive map...</p>
        <div className="flex gap-1">
          <div className="h-1 w-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="h-1 w-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="h-1 w-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )
});

interface MapProps {
  data: FeatureCollection;
  onRegionSelect?: (region: string) => void;
}

const Map = ({ data, onRegionSelect }: MapProps) => {
  // Client-side only rendering
  return <MapClient data={data} onRegionSelect={onRegionSelect} />;
};

export default Map;