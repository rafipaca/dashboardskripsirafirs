"use client"

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityIcon } from "lucide-react";



interface SummaryStatsProps {
  effectivenessRate?: number;
  analyzedCases?: number;
  studyPeriod?: string;
  highRiskAreas?: number;
}

export default function SummaryStats({ 
  effectivenessRate, 
  analyzedCases, 
  studyPeriod, 
  highRiskAreas 
}: SummaryStatsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <ActivityIcon className="h-5 w-5" />
            Ringkasan Analisis Retrospektif
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Analisis menggunakan model GWNBR untuk kasus pneumonia balita
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {effectivenessRate?.toFixed(1) || "N/A"}%
              </div>
              <div className="text-sm font-medium text-blue-800">Efektivitas Model</div>
              <div className="text-xs text-blue-600 mt-1">GWNBR</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {analyzedCases || 0}
              </div>
              <div className="text-sm font-medium text-green-800">Wilayah Analisis</div>
              <div className="text-xs text-green-600 mt-1">
                {studyPeriod || "2019-2022"}
              </div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg border">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {highRiskAreas || 0}
              </div>
              <div className="text-sm font-medium text-purple-800">Area Risiko Tinggi</div>
              <div className="text-xs text-purple-600 mt-1">Teridentifikasi</div>
            </div>
          </div>
          <div className="mt-6 p-4 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Catatan:</strong> Analisis ini menggunakan model Geographically Weighted Negative Binomial Regression (GWNBR) 
              untuk mengidentifikasi pola spasial kasus pneumonia balita di Pulau Jawa.
              {(analyzedCases || 0) > 0 && 
                `Model menunjukkan efektivitas dalam mengidentifikasi ${highRiskAreas || 0} area berisiko tinggi 
                dari total ${analyzedCases || 0} wilayah yang dianalisis.`}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
