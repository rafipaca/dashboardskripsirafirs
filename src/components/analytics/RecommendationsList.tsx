"use client"

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangleIcon, TrendingDownIcon, MapPinIcon, ActivityIcon } from "lucide-react";

interface RecommendationItemProps {
  title: string;
  description: string;
  badgeText: string;
  badgeVariant: 'destructive' | 'secondary' | 'outline' | 'default';
}

const RecommendationItem = ({ title, description, badgeText, badgeVariant }: RecommendationItemProps) => (
  <div className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
    <div className="flex items-center justify-between mb-2">
      <span className="font-medium">{title}</span>
      <Badge variant={badgeVariant}>{badgeText}</Badge>
    </div>
    <p className="text-sm text-muted-foreground">
      {description}
    </p>
  </div>
);

interface RecommendationsListProps {
  selectedRegion: string | null;
}

export default function RecommendationsList({ selectedRegion }: RecommendationsListProps) {
  const recommendations = [
    {
      title: "Peningkatan Akses Pelayanan Kesehatan",
      description: "Fokus pada wilayah dengan kepadatan penduduk tinggi dan akses terbatas ke fasilitas kesehatan",
      badgeText: "HIGH PRIORITY",
      badgeVariant: "destructive" as const,
      icon: <MapPinIcon className="h-4 w-4" />
    },
    {
      title: "Program Edukasi Ibu Hamil dan Balita",
      description: "Sosialisasi pentingnya imunisasi, ASI eksklusif, dan pola hidup sehat",
      badgeText: "MEDIUM PRIORITY",
      badgeVariant: "secondary" as const,
      icon: <ActivityIcon className="h-4 w-4" />
    },
    {
      title: "Intervensi Gizi dan Sanitasi",
      description: "Perbaikan sanitasi lingkungan dan program suplementasi gizi untuk balita",
      badgeText: "MEDIUM PRIORITY",
      badgeVariant: "secondary" as const,
      icon: <TrendingDownIcon className="h-4 w-4" />
    },
    {
      title: "Monitoring Wilayah Risiko Tinggi",
      description: "Pemantauan berkala di wilayah dengan kasus pneumonia balita tinggi",
      badgeText: "ONGOING",
      badgeVariant: "outline" as const,
      icon: <AlertTriangleIcon className="h-4 w-4" />
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <AlertTriangleIcon className="h-5 w-5" />
            Rekomendasi Intervensi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <RecommendationItem
                key={index}
                title={rec.title}
                description={rec.description}
                badgeText={rec.badgeText}
                badgeVariant={rec.badgeVariant}
              />
            ))}
          </div>
          
          {selectedRegion && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Catatan:</strong> Rekomendasi di atas dapat disesuaikan berdasarkan karakteristik wilayah{' '}
                <span className="font-semibold">{selectedRegion}</span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
