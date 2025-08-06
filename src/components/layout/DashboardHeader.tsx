"use client";

import { Button } from "@/components/ui/button";
import { 
  ShareIcon, 
  DownloadIcon, 
  FilterIcon,
  SearchIcon,
  InfoIcon,
  TrendingUpIcon
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DashboardHeaderProps {
  title?: string;
  subtitle?: string;
  dataSource?: string;
  lastUpdated?: string;
  totalDataPoints?: number;
  onExport?: () => void;
  onShare?: () => void;
  onRefresh?: () => void;
}

export function DashboardHeader({ 
  title = "Infografis Dashboard", 
  subtitle = "Visualisasi Data dan Analisis Interaktif",
  onExport,
  onShare
}: DashboardHeaderProps) {
  /**
   * Header dashboard yang disederhanakan
   * Mengurangi nesting div yang tidak perlu
   */
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
      </div>
      
      <div className="flex items-center gap-1">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onShare}
          className="h-8 px-2 hover:bg-accent"
        >
          <ShareIcon className="w-4 h-4" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onExport}
          className="h-8 px-2 hover:bg-accent"
        >
          <DownloadIcon className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

/**
 * Komponen reusable untuk item select dengan indikator warna
 * Mengurangi duplikasi struktur div yang berulang
 */
interface SelectItemWithIndicatorProps {
  value: string;
  label: string;
  color: string;
  animated?: boolean;
}

/**
 * Komponen select item dengan indikator yang disederhanakan
 * Menghapus div wrapper yang tidak perlu
 */
const SelectItemWithIndicator = ({ value, label, color, animated = false }: SelectItemWithIndicatorProps) => (
  <SelectItem value={value} className="flex items-center">
    <div className={`w-2 h-2 ${color} rounded-full mr-3 ${animated ? 'animate-pulse' : ''}`}></div>
    <span>{label}</span>
  </SelectItem>
);

export function DashboardControls({ 
  onSearch, 
  onFilter 
}: {
  onSearch?: (search: string) => void;
  onFilter?: (filter: string) => void;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm mb-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <FilterIcon className="w-5 h-5 mr-2 text-blue-500" />
            Data Filters & Controls
          </h3>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <InfoIcon className="w-4 h-4 mr-1" />
            Interactive filtering available
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row items-center space-y-3 lg:space-y-0 lg:space-x-4">
          <div className="flex-1 w-full">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Search data points, categories, or metrics..." 
                className="pl-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent h-11 text-sm"
                onChange={(e) => onSearch?.(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-3 w-full lg:w-auto">
            <Select onValueChange={onFilter}>
              <SelectTrigger className="w-full lg:w-[200px] bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 h-11">
                <SelectValue placeholder="Select Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItemWithIndicator
                  value="realtime"
                  label="Real-time"
                  color="bg-green-500"
                  animated={true}
                />
                <SelectItemWithIndicator
                  value="today"
                  label="Today"
                  color="bg-blue-500"
                />
                <SelectItemWithIndicator
                  value="week"
                  label="This Week"
                  color="bg-purple-500"
                />
                <SelectItemWithIndicator
                  value="month"
                  label="This Month"
                  color="bg-orange-500"
                />
                <SelectItemWithIndicator
                  value="quarter"
                  label="This Quarter"
                  color="bg-red-500"
                />
                <SelectItemWithIndicator
                  value="year"
                  label="This Year"
                  color="bg-indigo-500"
                />
              </SelectContent>
            </Select>
            
            <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-md transition-all duration-200 hover:shadow-lg px-6 h-11">
              <FilterIcon className="mr-2 h-4 w-4" />
              Apply Filter
            </Button>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-green-600 dark:text-green-400">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Data streaming live
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <TrendingUpIcon className="w-4 h-4 inline mr-1" />
              Auto-refresh: ON
            </div>
          </div>
          <div className="text-xs text-gray-400">
            Last synchronized: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
}
