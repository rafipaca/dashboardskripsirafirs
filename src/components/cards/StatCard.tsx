"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUpIcon, TrendingDownIcon, MinusIcon, AlertTriangleIcon, CheckCircleIcon, XCircleIcon, BarChart3Icon as BarChartIcon } from 'lucide-react';
import { useResearchData } from "@/hooks/useResearchData";
import { cn } from "@/lib/utils";
import { GRID_LAYOUTS } from '@/lib/constants';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  variant?: 'default' | 'success' | 'warning' | 'error';
  icon?: React.ReactNode;
  showProgress?: boolean;
  progressValue?: number;
  maxValue?: number;
}

/**
 * Komponen StatCard yang ditingkatkan dengan fitur trend, progress, dan ikon
 * Mendukung berbagai varian warna dan indikator visual
 */
export function StatCard({ 
  title, 
  value, 
  description, 
  trend, 
  trendDirection = 'neutral',
  variant = 'default',
  icon,
  showProgress = false,
  progressValue = 0,
  maxValue = 100
}: StatCardProps) {
  const getTrendColor = () => {
    switch (trendDirection) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = () => {
    switch (trendDirection) {
      case 'up': return <TrendingUpIcon className="h-4 w-4" />;
      case 'down': return <TrendingDownIcon className="h-4 w-4" />;
      default: return <MinusIcon className="h-4 w-4" />;
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'success': return 'border-green-200 bg-green-50';
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      case 'error': return 'border-red-200 bg-red-50';
      default: return 'border-border bg-card';
    }
  };

  const progressPercentage = maxValue > 0 ? (progressValue / maxValue) * 100 : 0;

  return (
    <Card className={cn("transition-all duration-200 hover:shadow-md", getVariantStyles())}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{typeof value === 'number' ? value.toLocaleString() : value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
        {trend && (
          <div className={`flex items-center space-x-1 text-sm mt-2 ${getTrendColor()}`}>
            {getTrendIcon()}
            <span>{trend}</span>
          </div>
        )}
        {showProgress && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>{progressValue}</span>
              <span>{maxValue}</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface RegionDataCardProps {
  regions?: Array<{
    name: string;
    cases: number;
    riskLevel: 'High' | 'Medium' | 'Low';
    kepadatan?: number;
    sanitasi?: number;
  }>;
  showDetails?: boolean;
  filterType?: 'high-risk' | 'low-sanitation' | 'all';
}

/**
 * Komponen reusable untuk item wilayah individual
 * Mengurangi duplikasi struktur div yang berulang
 */
interface RegionItemProps {
  region: {
    name: string;
    cases: number;
    riskLevel: 'High' | 'Medium' | 'Low';
    kepadatan?: number;
    sanitasi?: number;
  };
  showDetails: boolean;
  getRiskBadgeVariant: (risk: string) => "default" | "secondary" | "destructive" | "outline";
  getRiskIcon: (risk: string) => React.ReactNode;
}

/**
 * Komponen item wilayah yang disederhanakan
 * Menghapus div wrapper yang tidak perlu untuk mengurangi kompleksitas DOM
 */
const RegionItem = ({ region, showDetails, getRiskBadgeVariant, getRiskIcon }: RegionItemProps) => (
  <div className="p-3 rounded-lg border bg-muted/20 hover:bg-muted/40 transition-colors">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center space-x-2">
        <Badge variant={getRiskBadgeVariant(region.riskLevel)} className="flex items-center space-x-1">
          {getRiskIcon(region.riskLevel)}
          <span>{region.riskLevel}</span>
        </Badge>
        <span className="font-medium text-sm">{region.name}</span>
      </div>
      <span className="text-lg font-bold text-primary">{region.cases.toLocaleString()}</span>
    </div>
    
    {showDetails && region.kepadatan !== undefined && region.sanitasi !== undefined && (
      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
        <div className="flex justify-between">
          <span>Kepadatan:</span>
          <span className="font-medium">{region.kepadatan.toLocaleString()}/km²</span>
        </div>
        <div className="flex justify-between">
          <span>Sanitasi:</span>
          <span className="font-medium">{region.sanitasi.toFixed(1)}%</span>
        </div>
      </div>
    )}
  </div>
);

/**
 * Komponen RegionDataCard yang ditingkatkan dengan data penelitian aktual
 * Menampilkan informasi wilayah dengan tingkat risiko dan detail tambahan
 */
export function RegionDataCard({ regions, showDetails = false, filterType = 'all' }: RegionDataCardProps) {
  const { rawData } = useResearchData();
  
  // Gunakan data aktual jika regions tidak disediakan
  const displayRegions = regions || (() => {
    if (!rawData.length) return [];
    
    const avgCases = rawData.reduce((sum, r) => sum + r.Penemuan, 0) / rawData.length;
    const avgSanitasi = rawData.reduce((sum, r) => sum + r.Sanitasi, 0) / rawData.length;
    
    let filteredData = rawData;
    
    // Terapkan filter berdasarkan tipe
    switch (filterType) {
      case 'high-risk':
        filteredData = rawData.filter(item => item.Penemuan > avgCases * 1.5);
        break;
      case 'low-sanitation':
        filteredData = rawData.filter(item => item.Sanitasi < avgSanitasi);
        break;
      default:
        filteredData = rawData.slice(0, 10);
    }
    
    return filteredData.slice(0, 5).map(item => {
      const riskLevel = item.Penemuan > avgCases * 2 ? 'High' : 
                       item.Penemuan > avgCases ? 'Medium' : 'Low';
      
      return {
        name: item.NAMOBJ,
        cases: item.Penemuan,
        riskLevel,
        kepadatan: item.Kepadatan,
        sanitasi: item.Sanitasi
      };
    });
  })();

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
      case 'High': return 'destructive';
      case 'Medium': return 'secondary';
      case 'Low': return 'default';
      default: return 'outline';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'High': return <XCircleIcon className="h-4 w-4" />;
      case 'Medium': return <AlertTriangleIcon className="h-4 w-4" />;
      case 'Low': return <CheckCircleIcon className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>Wilayah Penelitian</span>
          <Badge variant="outline">{displayRegions.length} wilayah</Badge>
        </CardTitle>
        <CardDescription>Distribusi kasus berdasarkan geografis dan tingkat risiko</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {displayRegions.map((region) => (
            <RegionItem
              key={region.name}
              region={region}
              showDetails={showDetails}
              getRiskBadgeVariant={getRiskBadgeVariant}
              getRiskIcon={getRiskIcon}
            />
          ))}
        </div>
        
        {displayRegions.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <AlertTriangleIcon className="h-8 w-8 mx-auto mb-2" />
            <p>Tidak ada data wilayah tersedia</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Komponen untuk menampilkan statistik ringkasan penelitian
 * Menggunakan data aktual dari hooks useResearchData
 */
export function ResearchSummaryCard() {
  const { rawData, loading, error } = useResearchData();
  
  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-8 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2 text-red-600">
            <XCircleIcon className="h-5 w-5" />
            <span>Error memuat data: {error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const totalCases = rawData.reduce((sum, item) => sum + item.Penemuan, 0);
  const avgCases = totalCases / rawData.length;
  const highRiskCount = rawData.filter(item => item.Penemuan > avgCases * 2).length;
  const avgSanitasi = rawData.reduce((sum, item) => sum + item.Sanitasi, 0) / rawData.length;
  
  return (
    <div className={GRID_LAYOUTS.STATS_GRID}>
      <StatCard
        title="Total Kasus"
        value={totalCases}
        description="Kasus pneumonia balita"
        icon={<TrendingUpIcon className="h-4 w-4" />}
        variant="default"
      />
      
      <StatCard
        title="Rata-rata per Wilayah"
        value={Math.round(avgCases)}
        description="Kasus per kabupaten/kota"
        icon={<BarChartIcon className="h-4 w-4" />}
        variant="default"
      />
      
      <StatCard
        title="Wilayah Berisiko Tinggi"
        value={highRiskCount}
        description={`Dari ${rawData.length} wilayah`}
        icon={<AlertTriangleIcon className="h-4 w-4" />}
        variant={highRiskCount > rawData.length * 0.3 ? "warning" : "success"}
        showProgress
        progressValue={highRiskCount}
        maxValue={rawData.length}
      />
      
      <StatCard
        title="Cakupan Sanitasi"
        value={`${avgSanitasi.toFixed(1)}%`}
        description="Rata-rata wilayah"
        icon={<CheckCircleIcon className="h-4 w-4" />}
        variant={avgSanitasi > 80 ? "success" : avgSanitasi > 60 ? "warning" : "error"}
        showProgress
        progressValue={avgSanitasi}
        maxValue={100}
      />
    </div>
  );
}
