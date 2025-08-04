"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  MapPinIcon, 
  BarChartIcon, 
  UsersIcon, 
  AlertTriangleIcon, 
  ActivityIcon,
  CheckCircleIcon,
  XCircleIcon
} from "lucide-react";
import { useResearchData } from "@/hooks/useResearchData";
import { getProvinceFromName } from "@/lib/utils/regionUtils";
import { cn } from "@/lib/utils";

interface ResearchSummaryCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error';
  showProgress?: boolean;
  progressValue?: number;
  maxValue?: number;
}

const ResearchSummaryCard = ({ 
  title, 
  value, 
  description, 
  icon,
  variant = 'default',
  showProgress = false,
  progressValue = 0,
  maxValue = 100
}: ResearchSummaryCardProps) => {
  const progressPercentage = maxValue > 0 ? (progressValue / maxValue) * 100 : 0;

  const variantStyles = {
    default: 'border-border bg-card',
    success: 'border-green-200 bg-green-50',
    warning: 'border-yellow-200 bg-yellow-50',
    error: 'border-red-200 bg-red-50'
  };

  return (
    <Card className={cn("transition-all duration-200 hover:shadow-md", variantStyles[variant])}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium text-foreground">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {description}
        </p>
        {showProgress && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>{progressValue}</span>
              <span>{maxValue}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function ResearchSummaryCards() {
  const { rawData, loading, error } = useResearchData();
  
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        <Card className="col-span-full border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-red-600">
              <XCircleIcon className="h-5 w-5" />
              <span>Error memuat data: {error}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!rawData || rawData.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        <Card className="col-span-full">
          <CardContent className="pt-6 text-center">
            <CheckCircleIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-muted-foreground">Tidak ada data tersedia</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Hitung data aktual dari hooks berdasarkan data yang tersedia
  const totalRegions = rawData.length;
  const totalProvinces = new Set(rawData.map(item => getProvinceFromName(item.NAMOBJ))).size;
  const totalCases = rawData.reduce((sum, item) => sum + item.Penemuan, 0);
  const avgCases = totalCases / totalRegions;
  const highRiskRegions = rawData.filter(item => item.Penemuan > avgCases * 2).length;
  const significantVariables = rawData.length > 0 
    ? new Set(rawData.map(item => item.VariabelSignifikan).filter(v => v && v !== '').join(',').split(',').map(v => v.trim())).size
    : 0;
  const avgSanitasi = rawData.length > 0 
    ? Math.round((rawData.reduce((sum, item) => sum + item.Sanitasi, 0) / rawData.length) * 10) / 10
    : 0;

  const summaryData = [
    {
      title: "Kabupaten/Kota",
      value: totalRegions,
      description: "Wilayah Penelitian",
      icon: <MapPinIcon className="h-4 w-4" />,
      variant: "default" as "default" | "success" | "warning" | "error"
    },
    {
      title: "Provinsi",
      value: totalProvinces,
      description: "Di Pulau Jawa",
      icon: <MapPinIcon className="h-4 w-4" />,
      variant: "default" as "default" | "success" | "warning" | "error"
    },
    {
      title: "Total Kasus",
      value: totalCases,
      description: "Kasus pneumonia balita",
      icon: <UsersIcon className="h-4 w-4" />,
      variant: "default" as "default" | "success" | "warning" | "error"
    },
    {
      title: "Risiko Tinggi",
      value: highRiskRegions,
      description: "Wilayah berisiko",
      icon: <AlertTriangleIcon className="h-4 w-4" />,
      variant: highRiskRegions > totalRegions * 0.3 ? "warning" : "success" as "default" | "success" | "warning" | "error",
      showProgress: true,
      progressValue: highRiskRegions,
      maxValue: totalRegions
    },
    {
      title: "Variabel Model",
      value: significantVariables,
      description: "Variabel signifikan",
      icon: <BarChartIcon className="h-4 w-4" />,
      variant: "default" as "default" | "success" | "warning" | "error"
    },
    {
      title: "Sanitasi",
      value: `${avgSanitasi}%`,
      description: "Rata-rata wilayah",
      icon: <ActivityIcon className="h-4 w-4" />,
      variant: avgSanitasi > 80 ? "success" : avgSanitasi > 60 ? "warning" : "error" as "default" | "success" | "warning" | "error",
      showProgress: true,
      progressValue: avgSanitasi,
      maxValue: 100
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {summaryData.map((item, index) => (
        <ResearchSummaryCard
          key={index}
          title={item.title}
          value={item.value}
          description={item.description}
          icon={item.icon}
          variant={item.variant}
          showProgress={item.showProgress}
          progressValue={item.progressValue}
          maxValue={item.maxValue}
        />
      ))}
    </div>
  );
}
