"use client"

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DownloadIcon, ShareIcon, ActivityIcon, TrendingUpIcon, BarChartIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useChartData, useSpatialAnalysis } from "@/hooks/useResearchData";
import CorrelationAnalysis from "./CorrelationAnalysis";


// Import new refactored components
import SummaryStats from "@/components/analytics/SummaryStats";
import RecommendationsList from "@/components/analytics/RecommendationsList";

interface AnalyticsTabsProps {
  selectedRegion: string | null;
}

export default function AnalyticsTabs({ selectedRegion }: AnalyticsTabsProps) {
  // Menggunakan data penelitian yang sebenarnya
  const { barChartData, pieChartData, lineChartData, areaChartData, summaryStats, loading, error } = useChartData();
  const { hotspots, modelEffectiveness } = useSpatialAnalysis();

  // Menggunakan data yang tersedia dari hooks
  const barData = barChartData || [];
  const pieData = pieChartData || [];
  const lineData = lineChartData || [];
  const areaData = areaChartData || [];

  // Data summary yang sudah difilter berdasarkan wilayah yang dipilih
  const currentSummaryStats = summaryStats || {
    analyzedCases: 118,
    studyPeriod: "2019-2022",
    highRiskAreas: 34,
    totalRegions: 118
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Card className="border-0 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-2xl font-bold">Dashboard Analisis GWNBR</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Analisis spasial kasus pneumonia balita menggunakan Geographically Weighted Negative Binomial Regression
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <DownloadIcon className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <ShareIcon className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Ringkasan</TabsTrigger>
              <TabsTrigger value="regions">Wilayah</TabsTrigger>
              <TabsTrigger value="trends">Tren</TabsTrigger>
              <TabsTrigger value="correlation">Korelasi</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Ringkasan Statistik */}
                <SummaryStats
                  effectivenessRate={modelEffectiveness?.effectivenessRate}
                  analyzedCases={currentSummaryStats?.analyzedCases}
                  studyPeriod={currentSummaryStats?.studyPeriod}
                  highRiskAreas={currentSummaryStats?.highRiskAreas}
                />

                {/* Rekomendasi */}
                <RecommendationsList selectedRegion={selectedRegion} />
              </div>
              
              {/* Card Hasil Analisis Model GWNBR */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-indigo-100 rounded-full">
                        <BarChartIcon className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold">Hasil Analisis Model GWNBR</CardTitle>
                        <CardDescription>Evaluasi model berdasarkan data 2019-2022</CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-indigo-600 border-indigo-200">
                      Analisis Retrospektif
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border">
                        <div className="text-3xl font-bold text-blue-600 mb-2">
                          {modelEffectiveness?.effectivenessRate?.toFixed(1) || "N/A"}%
                        </div>
                        <div className="text-sm font-medium text-blue-800">Efektivitas Model</div>
                        <div className="text-xs text-blue-600 mt-1">GWNBR</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border">
                        <div className="text-3xl font-bold text-green-600 mb-2">
                          {currentSummaryStats?.analyzedCases || 0}
                        </div>
                        <div className="text-sm font-medium text-green-800">Wilayah Analisis</div>
                        <div className="text-xs text-green-600 mt-1">
                          {currentSummaryStats?.studyPeriod || "2019-2022"}
                        </div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg border">
                        <div className="text-3xl font-bold text-purple-600 mb-2">
                          {currentSummaryStats?.highRiskAreas || 0}
                        </div>
                        <div className="text-sm font-medium text-purple-800">Area Risiko Tinggi</div>
                        <div className="text-xs text-purple-600 mt-1">Teridentifikasi</div>
                      </div>
                    </div>
                    <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        <strong>Catatan:</strong> Analisis ini menggunakan model Geographically Weighted Negative Binomial Regression (GWNBR) 
                        untuk mengidentifikasi pola spasial kasus pneumonia balita di Pulau Jawa. 
                        {(currentSummaryStats?.analyzedCases || 0) > 0 && 
                          `Model menunjukkan efektivitas dalam mengidentifikasi ${currentSummaryStats?.highRiskAreas || 0} area berisiko tinggi 
                          dari total ${currentSummaryStats?.analyzedCases || 0} wilayah yang dianalisis.`}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Tab Wilayah */}
            <TabsContent value="regions" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <div>
                      <CardTitle className="text-lg font-semibold">Analisis per Wilayah</CardTitle>
                      <CardDescription className="text-sm text-muted-foreground">
                        {selectedRegion ? `Data untuk wilayah: ${selectedRegion}` : "Pilih wilayah pada peta untuk melihat detail analisis"}
                      </CardDescription>
                    </div>
                    <div className="p-2 bg-blue-100 rounded-full">
                      <TrendingUpIcon className="h-5 w-5 text-blue-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    {selectedRegion ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border">
                            <div className="text-2xl font-bold text-blue-600 mb-2">
                              {barData.find(item => item.name === selectedRegion)?.value || "N/A"}
                            </div>
                            <div className="text-sm font-medium text-blue-800">Kasus Pneumonia</div>
                            <div className="text-xs text-blue-600 mt-1">Per 1000 balita</div>
                          </div>
                          <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border">
                            <div className="text-2xl font-bold text-green-600 mb-2">
                              {pieData.find(item => item.name === selectedRegion)?.value || "N/A"}
                            </div>
                            <div className="text-sm font-medium text-green-800">Indeks Sanitasi</div>
                            <div className="text-xs text-green-600 mt-1">Skor 0-100</div>
                          </div>
                        </div>
                        <div className="p-4 bg-muted/30 rounded-lg">
                          <p className="text-sm text-muted-foreground">
                            <strong>Analisis Wilayah:</strong> Data menunjukkan karakteristik spesifik untuk wilayah {selectedRegion}. 
                            Gunakan informasi ini untuk memahami pola lokal dan faktor risiko yang dominan di area tersebut.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-muted-foreground mb-2">Tidak ada wilayah yang dipilih</div>
                        <p className="text-sm text-muted-foreground">
                          Klik pada wilayah di peta untuk melihat analisis detail
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Tab Tren */}
            <TabsContent value="trends" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <div>
                      <CardTitle className="text-lg font-semibold">Analisis Tren Temporal</CardTitle>
                      <CardDescription className="text-sm text-muted-foreground">Perkembangan kasus pneumonia balita dari waktu ke waktu</CardDescription>
                    </div>
                    <div className="p-2 bg-orange-100 rounded-full">
                      <TrendingUpIcon className="h-5 w-5 text-orange-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border">
                          <div className="text-2xl font-bold text-orange-600 mb-2">
                            {lineData.length > 0 ? lineData[lineData.length - 1]?.value || "N/A" : "N/A"}
                          </div>
                          <div className="text-sm font-medium text-orange-800">Kasus Terbaru</div>
                          <div className="text-xs text-orange-600 mt-1">2022</div>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border">
                          <div className="text-2xl font-bold text-blue-600 mb-2">
                            {lineData.length > 0 ? ((lineData[lineData.length - 1]?.value - lineData[0]?.value) / lineData[0]?.value * 100).toFixed(1) || "N/A" : "N/A"}%
                          </div>
                          <div className="text-sm font-medium text-blue-800">Perubahan</div>
                          <div className="text-xs text-blue-600 mt-1">2019-2022</div>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg border">
                          <div className="text-2xl font-bold text-purple-600 mb-2">
                            4
                          </div>
                          <div className="text-sm font-medium text-purple-800">Tahun Analisis</div>
                          <div className="text-xs text-purple-600 mt-1">2019-2022</div>
                        </div>
                      </div>
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          <strong>Tren Temporal:</strong> Analisis menunjukkan perkembangan kasus pneumonia balita selama periode 2019-2022. 
                          Data ini membantu mengidentifikasi pola musiman dan tren jangka panjang yang dapat digunakan untuk prediksi dan perencanaan intervensi.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Tab Korelasi */}
            <TabsContent value="correlation" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <div>
                      <CardTitle className="text-lg font-semibold">Analisis Korelasi Faktor Risiko</CardTitle>
                      <CardDescription className="text-sm text-muted-foreground">Hubungan antar variabel berdasarkan data GWNBR</CardDescription>
                    </div>
                    <div className="p-2 bg-purple-100 rounded-full">
                      <ActivityIcon className="h-5 w-5 text-purple-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CorrelationAnalysis />
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  )
}