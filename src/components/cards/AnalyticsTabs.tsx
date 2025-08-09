"use client"

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DownloadIcon, ShareIcon, ActivityIcon, TrendingUpIcon } from "lucide-react";
// import { Badge } from "@/components/ui/badge";
import { useChartData, useSpatialAnalysis } from "@/hooks/useResearchData";
// Import new refactored components

// Import prediction components
// import { PredictionCard, EquationCard, InterpretationCard } from "@/components/prediction";
import { usePrediction } from "@/hooks/usePrediction";
import { InterpretationCard, InterpretationCardSkeleton } from "@/components/prediction/InterpretationCard";
import { EquationCard, EquationCardSkeleton } from "@/components/prediction/EquationCard";

interface AnalyticsTabsProps {
  selectedRegion: string | null;
}

export default function AnalyticsTabs({ selectedRegion }: AnalyticsTabsProps) {
  // Menggunakan data penelitian yang sebenarnya
  const { /* barChartData, pieChartData, lineChartData, */ summaryStats, loading, error } = useChartData();
  const { modelEffectiveness } = useSpatialAnalysis();
  
  // Menggunakan hook prediksi untuk fitur baru
  const {
    // globalSummary,
    isLoading: predictionLoading,
    error: predictionError,
    selectedRegionData,
    selectRegion
  } = usePrediction();
  
  // Update selected region di prediction hook ketika selectedRegion berubah
  useEffect(() => {
    if (selectedRegion) {
      selectRegion(selectedRegion);
    }
  }, [selectedRegion, selectRegion]);

  // Menggunakan data yang tersedia dari hooks
  // const barData = barChartData || [];
  // const pieData = pieChartData || [];
  // const lineData = lineChartData || [];

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
              <TabsTrigger value="prediction">Interpretasi</TabsTrigger>
              <TabsTrigger value="equation">Persamaan</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-1">
                {/* Ringkasan Statistik - Modified to remove high risk areas */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <ActivityIcon className="h-5 w-5" />
                        Ringkasan Analisis GWNBR
                      </CardTitle>
                      <CardDescription className="text-sm text-muted-foreground">
                        Analisis menggunakan model GWNBR untuk kasus pneumonia balita
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      </div>
                      <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          <strong>Catatan:</strong> Analisis ini menggunakan model Geographically Weighted Negative Binomial Regression (GWNBR) 
                          untuk mengidentifikasi pola spasial kasus pneumonia balita di Pulau Jawa.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
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
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border">
                            <div className="text-2xl font-bold text-blue-600 mb-2">
                              {typeof selectedRegionData?.equation?.coefficients?.intercept === 'number' 
                                ? selectedRegionData.equation.coefficients.intercept.toFixed(3) 
                                : "N/A"}
                            </div>
                            <div className="text-sm font-medium text-blue-800">Intercept</div>
                            <div className="text-xs text-blue-600 mt-1">Koefisien dasar</div>
                          </div>
                          <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border">
                            <div className="text-2xl font-bold text-green-600 mb-2">
                              {typeof selectedRegionData?.equation?.coefficients?.sanitasi === 'number' 
                                ? selectedRegionData.equation.coefficients.sanitasi.toFixed(3) 
                                : "N/A"}
                            </div>
                            <div className="text-sm font-medium text-green-800">Koef. Sanitasi</div>
                            <div className="text-xs text-green-600 mt-1">Pengaruh sanitasi</div>
                          </div>
                          <div className="p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg border">
                            <div className="text-2xl font-bold text-purple-600 mb-2">
                              {typeof selectedRegionData?.equation?.coefficients?.kepadatan === 'number' 
                                ? selectedRegionData.equation.coefficients.kepadatan.toFixed(3) 
                                : "N/A"}
                            </div>
                            <div className="text-sm font-medium text-purple-800">Koef. Kepadatan</div>
                            <div className="text-xs text-purple-600 mt-1">Pengaruh kepadatan</div>
                          </div>
                        </div>
                        <div className="p-4 bg-muted/30 rounded-lg">
                          <p className="text-sm text-muted-foreground">
                            <strong>Analisis Wilayah:</strong> Data menunjukkan koefisien model GWNBR untuk wilayah {selectedRegion}. 
                            Koefisien ini menggambarkan pengaruh lokal dari setiap variabel terhadap kasus pneumonia balita di area tersebut.
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



            {/* Tab Interpretasi */}
            <TabsContent value="prediction" className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {predictionLoading ? (
                  <InterpretationCardSkeleton />
                ) : predictionError ? (
                  <Card className="border-0 shadow-md">
                    <CardContent className="text-center py-8 text-red-600">
                      <p>Error: {predictionError}</p>
                    </CardContent>
                  </Card>
                ) : selectedRegionData?.equation ? (
                  <InterpretationCard equation={selectedRegionData.equation} />
                ) : (
                  <Card className="border-0 shadow-md">
                    <CardContent className="text-center py-8 text-gray-500">
                      <p>Pilih wilayah pada peta untuk melihat interpretasi hasil model</p>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            </TabsContent>
            
            {/* Tab Persamaan */}
            <TabsContent value="equation" className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {predictionLoading ? (
                  <EquationCardSkeleton />
                ) : predictionError ? (
                  <Card className="border-0 shadow-md">
                    <CardContent className="text-center py-8 text-red-600">
                      <p>Error: {predictionError}</p>
                    </CardContent>
                  </Card>
                ) : selectedRegionData?.equation ? (
                  <EquationCard equation={selectedRegionData.equation} />
                ) : (
                  <Card className="border-0 shadow-md">
                    <CardContent className="text-center py-8 text-gray-500">
                      <p>Pilih wilayah pada peta untuk melihat persamaan model</p>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
}