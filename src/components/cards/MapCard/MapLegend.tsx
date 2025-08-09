import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { LayersIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useMemo } from 'react';

interface MapLegendProps {
  activeLayer: string;
}

const significanceLegend = {
  title: 'Legenda Signifikansi Variabel',
  items: [
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

export function MapLegend({ activeLayer }: MapLegendProps) {
  const isSignificance = activeLayer === 'significance';
  
  const legend = useMemo(() => {
    if (isSignificance) {
      return significanceLegend;
    }
    return {
      ...choroplethLegend,
      title: layerTitles[activeLayer] || choroplethLegend.title,
    };
  }, [activeLayer, isSignificance]);

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-primary/30 hover:bg-primary/5 group"
        >
          <LayersIcon className="w-4 h-4 mr-2 group-hover:text-primary transition-colors" />
          <span className="font-medium">Legenda</span>
        </Button>
      </HoverCardTrigger>
      
      <HoverCardContent className="w-72 p-0 border-0 shadow-2xl bg-white/95 backdrop-blur-xl">
        <motion.div 
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="p-4"
        >
          <div className="flex items-center gap-2 mb-3 pb-3 border-b border-border/30">
            <div className="h-2 w-2 bg-primary rounded-full" />
            <h4 className="font-semibold text-sm text-foreground">{legend.title}</h4>
          </div>
          
          <div className="space-y-2">
            {legend.items.map((item, index) => (
              <motion.div
                key={item.label || index}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.2 }}
                className={`flex items-center space-x-3`}
              >
                <div className={`w-4 h-4 rounded-md shadow-sm`} style={{ backgroundColor: item.color }} />
                <p className="text-xs text-muted-foreground font-medium">
                  {item.label}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Gradient bar for choropleth */}
          {!isSignificance && (
            <motion.div 
              className="mt-3 pt-3 border-t border-border/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex justify-between text-xs text-muted-foreground font-medium mb-1">
                <span>Rendah</span>
                <span>Tinggi</span>
              </div>
              <div 
                className="h-3 w-full rounded-md bg-gradient-to-r from-[#fef08a] via-[#f97316] to-[#b91c1c] shadow-inner"
              />
            </motion.div>
          )}

        </motion.div>
      </HoverCardContent>
    </HoverCard>
  );
}
