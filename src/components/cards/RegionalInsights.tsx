"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangleIcon, CheckCircleIcon, XCircleIcon, MapPinIcon } from "lucide-react";
import { useResearchData } from "@/hooks/useResearchData";

interface RegionItemProps {
  region: {
    name: string;
    cases: number;
    riskLevel: 'High' | 'Medium' | 'Low';
    sanitasi?: number;
    kepadatan?: number;
  };
  getRiskBadgeVariant: (risk: string) => string;
  getRiskIcon: (risk: string) => React.ReactNode;
}

const RegionItem = ({ region, getRiskBadgeVariant, getRiskIcon }: RegionItemProps) => (
  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
    <div className="flex items-center space-x-3">
      <MapPinIcon className="h-4 w-4 text-muted-foreground" />
      <div>
        <p className="text-sm font-medium">{region.name}</p>
        <p className="text-xs text-muted-foreground">
          {region.cases} kasus • Sanitasi: {region.sanitasi}%
        </p>
      </div>
    </div>
    <div className="flex items-center space-x-2">
      <Badge variant={getRiskBadgeVariant(region.riskLevel)}>
        {getRiskIcon(region.riskLevel)}
        <span className="ml-1">{region.riskLevel}</span>
      </Badge>
    </div>
  </div>
);

export default function RegionalInsights() {
  const { rawData, loading, error } = useResearchData();

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="space-y-2">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="h-12 bg-muted rounded"></div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
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

  if (!rawData || rawData.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <MapPinIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-muted-foreground">Tidak ada data wilayah tersedia</p>
        </CardContent>
      </Card>
    );
  }

  const avgCases = rawData.reduce((sum, item) => sum + item.Penemuan, 0) / rawData.length;
  const avgSanitasi = rawData.reduce((sum, item) => sum + item.Sanitasi, 0) / rawData.length;

  // Filter data untuk wilayah berisiko tinggi
  const highRiskRegions = rawData
    .filter(item => item.Penemuan > avgCases * 1.5)
    .slice(0, 5)
    .map(item => ({
      name: item.NAMOBJ,
      cases: item.Penemuan,
      riskLevel: item.Penemuan > avgCases * 2 ? 'High' as const : 'Medium' as const,
      sanitasi: item.Sanitasi,
      kepadatan: item.Kepadatan
    }));

  // Filter data untuk wilayah dengan sanitasi rendah
  const lowSanitationRegions = rawData
    .filter(item => item.Sanitasi < avgSanitasi)
    .slice(0, 5)
    .map(item => ({
      name: item.NAMOBJ,
      cases: item.Penemuan,
      riskLevel: item.Sanitasi < 50 ? 'High' as const : 
                 item.Sanitasi < 70 ? 'Medium' as const : 'Low' as const,
      sanitasi: item.Sanitasi,
      kepadatan: item.Kepadatan
    }));

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
      case 'High': return 'destructive' as const;
      case 'Medium': return 'secondary' as const;
      case 'Low': return 'default' as const;
      default: return 'outline' as const;
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Wilayah Berisiko Tinggi */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>Wilayah Berisiko Tinggi</span>
            <Badge variant="outline">{highRiskRegions.length} wilayah</Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Kabupaten/kota dengan kasus pneumonia di atas rata-rata
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {highRiskRegions.map((region) => (
              <RegionItem
                key={`high-risk-${region.name}`}
                region={region}
                getRiskBadgeVariant={getRiskBadgeVariant}
                getRiskIcon={getRiskIcon}
              />
            ))}
          </div>
          
          {highRiskRegions.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              <CheckCircleIcon className="h-6 w-6 mx-auto mb-2" />
              <p className="text-sm">Tidak ada wilayah berisiko tinggi</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Wilayah dengan Sanitasi Rendah */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>Wilayah dengan Sanitasi Rendah</span>
            <Badge variant="outline">{lowSanitationRegions.length} wilayah</Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Kabupaten/kota dengan cakupan sanitasi di bawah rata-rata
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {lowSanitationRegions.map((region) => (
              <RegionItem
                key={`low-sani-${region.name}`}
                region={region}
                getRiskBadgeVariant={getRiskBadgeVariant}
                getRiskIcon={getRiskIcon}
              />
            ))}
          </div>
          
          {lowSanitationRegions.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              <CheckCircleIcon className="h-6 w-6 mx-auto mb-2" />
              <p className="text-sm">Tidak ada wilayah dengan sanitasi rendah</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
