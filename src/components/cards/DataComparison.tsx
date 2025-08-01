import { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { GRID_LAYOUTS, STATUS_COLORS } from '@/lib/constants';

/**
 * Komponen reusable untuk item statistik perbandingan
 * Mengurangi duplikasi struktur div yang berulang
 */
interface ComparisonStatItemProps {
  value: number;
  label: string;
  color: string;
}

const ComparisonStatItem = ({ value, label, color }: ComparisonStatItemProps) => (
  <div className="text-center">
    <p className={`text-2xl font-bold ${color}`}>
      {value}
    </p>
    <p className="text-sm text-muted-foreground">{label}</p>
  </div>
);

interface ComparisonData {
  region: string;
  current: number;
  previous: number;
  change: number;
  percentage: number;
}

interface DataComparisonProps {
  data: ComparisonData[];
  onTimeframeChange: (timeframe: string) => void;
}

export function DataComparison({ data, onTimeframeChange }: DataComparisonProps) {
  const [comparisonMode, setComparisonMode] = useState<'absolute' | 'percentage'>('absolute');
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);

  const sortedData = [...data].sort((a, b) => b.current - a.current);

  const chartData = comparisonMode === 'absolute' 
    ? sortedData 
    : sortedData.map(item => ({
        ...item,
        current: item.percentage,
        previous: 0
      }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border"
        >
          <p className="font-semibold">{label}</p>
          <p className="text-sm">
            Saat ini: {data.current.toLocaleString()} kasus
          </p>
          <p className="text-sm">
            Sebelumnya: {data.previous.toLocaleString()} kasus
          </p>
          <p className={`text-sm ${data.change > 0 ? 'text-red-500' : 'text-green-500'}`}>
            Perubahan: {data.change > 0 ? '+' : ''}{data.change.toLocaleString()}
          </p>
        </motion.div>
      );
    }
    return null;
  };

  return (
    <Card>
      {/* Header card yang disederhanakan */}
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Perbandingan Data</CardTitle>
        <ToggleGroup
          type="single"
          value={comparisonMode}
          onValueChange={(value) => setComparisonMode(value as 'absolute' | 'percentage')}
        >
          <ToggleGroupItem value="absolute" aria-label="Absolute">
            Nilai
          </ToggleGroupItem>
          <ToggleGroupItem value="percentage" aria-label="Percentage">
            Persentase
          </ToggleGroupItem>
        </ToggleGroup>
      </CardHeader>
      
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="region" 
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="current" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.change > 0 ? '#ef4444' : '#22c55e'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className={`mt-4 ${GRID_LAYOUTS.COMPARISON_GRID}`}>
          <ComparisonStatItem
            value={data.filter(d => d.change > 0).length}
            label="Meningkat"
            color={STATUS_COLORS.ERROR}
          />
          <ComparisonStatItem
            value={data.filter(d => d.change < 0).length}
            label="Menurun"
            color={STATUS_COLORS.SUCCESS}
          />
        </div>
      </CardContent>
    </Card>
  );
}
