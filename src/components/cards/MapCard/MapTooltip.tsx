import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

interface MapTooltipProps {
  region: string;
  cases: number;
  riskLevel: 'low' | 'medium' | 'high';
  position: { x: number; y: number };
}

export function MapTooltip({ region, cases, riskLevel, position }: MapTooltipProps) {
  const riskColors = {
    low: 'bg-green-500',
    medium: 'bg-yellow-500',
    high: 'bg-red-500'
  };

  const riskLabels = {
    low: 'Rendah',
    medium: 'Sedang',
    high: 'Tinggi'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 200 }}
      className="absolute z-[1000] pointer-events-none"
      style={{
        left: position.x + 10,
        top: position.y - 10,
        transform: 'translate(-50%, -100%)'
      }}
    >
      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 min-w-[200px]">
        <div className="flex items-center space-x-2 mb-2">
          <MapPin className="h-4 w-4 text-primary" />
          <h4 className="font-semibold text-sm">{region}</h4>
        </div>
        
        {/* Informasi tooltip yang disederhanakan */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600 dark:text-gray-400">Kasus:</span>
            <span className="text-sm font-medium">{cases.toLocaleString()}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600 dark:text-gray-400">Risiko:</span>
            <span className="flex items-center space-x-1 text-xs font-medium">
              <div className={`w-2 h-2 rounded-full ${riskColors[riskLevel]}`} />
              {riskLabels[riskLevel]}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
