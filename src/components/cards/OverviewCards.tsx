import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPinIcon, BarChartIcon, UsersIcon, AlertTriangleIcon, ActivityIcon } from "lucide-react";
import { useResearchData } from "@/hooks/useResearchData";
import { countJavaProvincesFromRawData } from "@/lib/utils/regionUtils";

/**
 * Komponen reusable untuk kartu statistik overview
 * Mengurangi duplikasi struktur Card yang berulang
 */
interface OverviewCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
}

const OverviewCard = ({ title, value, description, icon }: OverviewCardProps) => (
  <Card className="border-border bg-card">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
      <CardTitle className="text-sm font-medium text-foreground">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-foreground">{value}</div>
      <p className="text-xs text-muted-foreground">
        {description}
      </p>
    </CardContent>
  </Card>
);

/**
 * Komponen OverviewCards untuk menampilkan ringkasan data penelitian
 * Menggunakan data aktual dari hooks tanpa nilai yang dibuat-buat
 */
export default function OverviewCards() {
  const { rawData } = useResearchData();
  
  // Hitung data aktual dari hooks berdasarkan data yang tersedia
  const totalRegions = rawData.length;
  
  // Hitung jumlah provinsi Pulau Jawa secara akurat (whitelist 6 provinsi)
  const totalProvinces = countJavaProvincesFromRawData(rawData);
  
  // Hitung total kasus penemuan
  const totalCases = rawData.reduce((sum, item) => sum + item.Penemuan, 0);
  
  // Hitung wilayah berisiko tinggi (di atas rata-rata)
  const avgCases = totalCases / totalRegions;
  const highRiskRegions = rawData.filter(item => item.Penemuan > avgCases * 2).length;
  
  // Hitung variabel signifikan dari data
  const significantVariables = rawData.length > 0 
    ? new Set(rawData.map(item => item.VariabelSignifikan).filter(v => v && v !== '').join(',').split(',').map(v => v.trim())).size
    : 0;
  
  // Hitung rata-rata cakupan sanitasi
  const avgSanitasi = rawData.length > 0 
    ? Math.round((rawData.reduce((sum, item) => sum + item.Sanitasi, 0) / rawData.length) * 10) / 10
    : 0;

  // Data untuk kartu overview
  const overviewData = [
    {
      title: "Kabupaten/Kota",
      value: totalRegions,
      description: "Wilayah Penelitian",
      icon: <MapPinIcon className="h-4 w-4 text-muted-foreground" />
    },
    {
      title: "Provinsi",
      value: totalProvinces,
      description: "Di Pulau Jawa",
      icon: <MapPinIcon className="h-4 w-4 text-muted-foreground" />
    },
    {
      title: "Total Kasus",
      value: totalCases.toLocaleString(),
      description: "Kasus Penemuan",
      icon: <UsersIcon className="h-4 w-4 text-muted-foreground" />
    },
    {
      title: "Risiko Tinggi",
      value: highRiskRegions,
      description: "Wilayah Berisiko",
      icon: <AlertTriangleIcon className="h-4 w-4 text-muted-foreground" />
    },
    {
      title: "Variabel Model",
      value: significantVariables,
      description: "Variabel Signifikan",
      icon: <BarChartIcon className="h-4 w-4 text-muted-foreground" />
    },
    {
      title: "Sanitasi",
      value: `${avgSanitasi}%`,
      description: "Rata-rata Cakupan",
      icon: <ActivityIcon className="h-4 w-4 text-muted-foreground" />
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
      {overviewData.map((item, index) => (
        <OverviewCard
          key={index}
          title={item.title}
          value={item.value}
          description={item.description}
          icon={item.icon}
        />
      ))}
    </div>
  );
}