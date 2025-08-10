"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  MapPinIcon, 
  UsersIcon, 
  CheckCircleIcon,
  ActivityIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useResearchData } from "@/hooks/useResearchData";
import { countJavaProvincesFromRawData } from "@/lib/utils/regionUtils";

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
  const { rawData } = useResearchData();
  
  // Hitung data aktual dari hooks berdasarkan data yang tersedia
  const totalRegions = rawData.length;
  
  // Hitung jumlah provinsi Pulau Jawa secara akurat (whitelist 6 provinsi)
  const totalProvinces = countJavaProvincesFromRawData(rawData);
  
  // Hitung total kasus penemuan
  const totalCases = rawData.reduce((sum, item) => sum + item.Penemuan, 0);
  
  // Cari nilai tertinggi untuk Gizi Kurang, Kepadatan, dan Rokok
  const maxGiziKurang = rawData.reduce((max, item) => 
    item.GiziKurang > max.value ? { value: item.GiziKurang, region: item.NAMOBJ } : max, 
    { value: 0, region: "" }
  );

  const maxKepadatan = rawData.reduce((max, item) => 
    item.Kepadatan > max.value ? { value: item.Kepadatan, region: item.NAMOBJ } : max, 
    { value: 0, region: "" }
  );

  const maxRokok = rawData.reduce((max, item) => 
    item.RokokPerkapita > max.value ? { value: item.RokokPerkapita, region: item.NAMOBJ } : max, 
    { value: 0, region: "" }
  );

  type SummaryItem = Pick<ResearchSummaryCardProps, 'title' | 'value' | 'description' | 'icon' | 'variant' | 'showProgress' | 'progressValue' | 'maxValue'>;
  const summaryData: SummaryItem[] = [
    {
      title: "Balita Gizi Kurang",
      value: maxGiziKurang.value.toLocaleString(),
      description: maxGiziKurang.region,
      icon: <UsersIcon className="h-4 w-4" />,
      variant: "default" as "default" | "success" | "warning" | "error"
    },
    {
      title: "Kepadatan Tertinggi",
      value: maxKepadatan.value.toLocaleString(),
      description: maxKepadatan.region,
      icon: <MapPinIcon className="h-4 w-4" />,
      variant: "default" as "default" | "success" | "warning" | "error"
    },
    {
      title: "Rokok Tertinggi",
      value: maxRokok.value.toLocaleString(),
      description: maxRokok.region,
      icon: <ActivityIcon className="h-4 w-4" />,
      variant: "default" as "default" | "success" | "warning" | "error"
    },
    {
      title: "Total Kasus",
      value: totalCases.toLocaleString(),
      description: "Kasus Penemuan",
      icon: <UsersIcon className="h-4 w-4" />,
      variant: "default" as "default" | "success" | "warning" | "error"
    },
    {
      title: "Wilayah Penelitian",
      value: totalRegions,
      description: "Kabupaten/Kota",
      icon: <MapPinIcon className="h-4 w-4" />,
      variant: "default" as "default" | "success" | "warning" | "error"
    },
    {
      title: "Provinsi",
      value: totalProvinces,
      description: "Di Pulau Jawa",
      icon: <MapPinIcon className="h-4 w-4" />,
      variant: "default" as "default" | "success" | "warning" | "error"
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
