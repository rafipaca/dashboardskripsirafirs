import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { InfoIcon, TrendingUpIcon } from "lucide-react";
import { motion } from "framer-motion";

export function MapLegend() {
  const legendItems = [
    { 
      level: 'high', 
      label: 'Risiko Tinggi', 
      range: '>100 kasus', 
      color: 'bg-gradient-to-r from-red-500 to-red-600',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50',
      emoji: '🔴'
    },
    { 
      level: 'medium-high', 
      label: 'Risiko Sedang-Tinggi', 
      range: '50-100 kasus', 
      color: 'bg-gradient-to-r from-orange-500 to-orange-600',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
      emoji: '🟠'
    },
    { 
      level: 'medium', 
      label: 'Risiko Sedang', 
      range: '25-50 kasus', 
      color: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      emoji: '🟡'
    },
    { 
      level: 'low', 
      label: 'Risiko Rendah', 
      range: '<25 kasus', 
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
      emoji: '🟢'
    }
  ];

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-primary/30 hover:bg-primary/5 group"
        >
          <InfoIcon className="w-4 h-4 mr-2 group-hover:text-primary transition-colors" />
          <span className="font-medium">Legenda</span>
          <TrendingUpIcon className="w-3 h-3 ml-1 opacity-60" />
        </Button>
      </HoverCardTrigger>
      
      <HoverCardContent className="w-72 p-0 border-0 shadow-2xl bg-white/95 backdrop-blur-xl">
        <motion.div 
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="p-6"
        >
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border/30">
            <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
            <h4 className="font-bold text-base text-foreground">Tingkat Risiko Pneumonia</h4>
          </div>
          
          <div className="space-y-3">
            {legendItems.map((item, index) => (
              <motion.div
                key={item.level}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className={`flex items-center space-x-4 p-3 rounded-xl hover:${item.bgColor} hover:scale-105 transition-all duration-200 cursor-pointer group`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{item.emoji}</span>
                  <div className={`w-4 h-4 rounded-full ${item.color} ring-2 ring-offset-2 ring-transparent group-hover:ring-current shadow-sm`} />
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-semibold ${item.textColor} group-hover:font-bold transition-all`}>
                    {item.label}
                  </p>
                  <p className="text-xs text-muted-foreground font-medium">{item.range}</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="mt-4 pt-3 border-t border-border/30 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-xs text-muted-foreground">
              Data diperbarui secara real-time
            </p>
          </motion.div>
        </motion.div>
      </HoverCardContent>
    </HoverCard>
  );
}
