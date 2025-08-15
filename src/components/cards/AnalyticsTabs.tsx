"use client"

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DownloadIcon, ShareIcon, ActivityIcon, TrendingUpIcon } from "lucide-react";
// import { Badge } from "@/components/ui/badge";
import { useChartData, useResearchData } from "@/hooks/useResearchData";
import { useMapData } from "@/hooks/useMapData";
// Import new refactored components

// Import prediction components
// import { PredictionCard, EquationCard, InterpretationCard } from "@/components/prediction";
import { usePrediction } from "@/hooks/usePrediction";
import { InterpretationCard, InterpretationCardSkeleton } from "@/components/prediction/InterpretationCard";
import { EquationCard, EquationCardSkeleton } from "@/components/prediction/EquationCard";
import { createSimpleInterpretation } from "@/lib/interpretation/utils";
import { MathTex } from "@/components/ui/MathTex";

interface AnalyticsTabsProps {
  selectedRegion: string | null;
}

export default function AnalyticsTabs({ selectedRegion }: AnalyticsTabsProps) {
  // Menggunakan data penelitian yang sebenarnya
  const { /* barChartData, pieChartData, lineChartData, */ summaryStats, loading, error } = useChartData();
  const { getRegionData } = useResearchData();
  const { findRegionData } = useMapData();
  
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
    // Propagate selection changes (including clearing selection)
    if (selectedRegion) {
      selectRegion(selectedRegion);
    } else {
      selectRegion(null);
    }
  }, [selectedRegion, selectRegion]);

  // Menggunakan data yang tersedia dari hooks
  // const barData = barChartData || [];
  // const pieData = pieChartData || [];
  // const lineData = lineChartData || [];

  // Data summary yang sudah difilter berdasarkan wilayah yang dipilih
  const currentSummaryStats = summaryStats || {
    analyzedCases: 118,
    studyPeriod: "2023",
    highRiskAreas: 34,
    totalRegions: 118
  };

  // Regional raw data for the selected region
  // Use robust finder to honor exact CSV naming (Kota/Kabupaten/Administrasi)
  const regionData = selectedRegion ? (findRegionData(selectedRegion) || getRegionData(selectedRegion)) : null;
  // Total variabel yang digunakan dalam model (excl. intercept karena intercept bukan variabel independen)
  const totalVariablesUsed = selectedRegionData?.equation
    ? Object.keys(selectedRegionData.equation.coefficients).filter(k => k !== 'intercept').length
    : 6;
    const nfID = (opts?: Intl.NumberFormatOptions) => new Intl.NumberFormat('de-DE', opts);
  const formatNum = (val?: number | null) => (typeof val === 'number' ? nfID().format(val) : 'N/A');
  const formatPct = (val?: number | null, digits: number = 4) =>
    (typeof val === 'number' ? `${nfID({ minimumFractionDigits: digits, maximumFractionDigits: digits }).format(val)}%` : 'N/A');
  const formatDec = (val?: number | null, digits: number = 3) =>
    (typeof val === 'number' ? nfID({ minimumFractionDigits: digits, maximumFractionDigits: digits }).format(val) : 'N/A');
  const formatInt = (val?: number | null) =>
    (typeof val === 'number' ? nfID({ maximumFractionDigits: 0 }).format(val) : 'N/A');

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
                        {selectedRegion && (
                          <div className="mt-1 text-sm">
                            <span className="text-muted-foreground">Ringkasan untuk: </span>
                            <span className="font-medium">{selectedRegion}</span>
                          </div>
                        )}
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border">
                          <div className="text-3xl font-bold text-blue-600 mb-2">
                            {totalVariablesUsed}
                          </div>
                          <div className="text-sm font-medium text-blue-800">Variabel Model</div>
                          <div className="text-xs text-blue-600 mt-1">Total variabel</div>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border">
                          <div className="text-3xl font-bold text-green-600 mb-2">
                            {currentSummaryStats?.analyzedCases || 0}
                          </div>
                          <div className="text-sm font-medium text-green-800">Wilayah Analisis</div>
                          <div className="text-xs text-green-600 mt-1">
                            {currentSummaryStats?.studyPeriod || "2023"}
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          <strong>Catatan:</strong> Analisis ini menggunakan model Geographically Weighted Negative Binomial Regression (GWNBR) 
                          untuk mengidentifikasi pola spasial kasus pneumonia balita di Pulau Jawa.
                        </p>
                      </div>

                      {/* Ringkasan Persamaan (full width di atas) */}
                      <div className="mt-6 p-4 rounded-lg border bg-white">
                        <div className="text-sm font-semibold mb-2 text-center">Ringkasan Persamaan</div>
                        {selectedRegionData?.equation ? (
                          <div className="space-y-3 text-sm">
                            <div className="bg-gray-50 p-3 rounded-lg border">
                              <div className="flex flex-col items-center justify-center">
                                <div className="max-w-full overflow-x-auto">
                                  <span className="inline-block min-w-max whitespace-nowrap text-sm sm:text-base">
                                    <MathTex tex={(() => {
                                      const mapping = [
                                        { pattern: 'GiziKurang', idx: 1 },
                                        { pattern: 'IMD', idx: 2 },
                                        { pattern: 'Rokok', idx: 3 },
                                        { pattern: 'Kepadatan', idx: 4 },
                                        { pattern: 'AirMinum', idx: 5 },
                                        { pattern: 'Sanitasi', idx: 6 },
                                      ];
                                      let tex = selectedRegionData.equation.equation
                                        .replace(/ln\s*\((μ|µ|mu)\)/gi, '\\ln(\\mu)')
                                        .replace(/×/g, '\\cdot ')
                                        .replace(/\./g, ',');
                                      mapping.forEach(m => {
                                        tex = tex.replace(new RegExp(m.pattern, 'g'), `X_{${m.idx}}`);
                                      });
                                      return tex;
                                    })()} />
                                  </span>
                                </div>
                                <div className="mt-2 flex flex-wrap gap-1 justify-center text-xs text-gray-600">
                                  {[
                                    { idx: 1, label: 'Gizi Kurang' },
                                    { idx: 2, label: 'IMD' },
                                    { idx: 3, label: 'Rokok Per Kapita' },
                                    { idx: 4, label: 'Kepadatan Penduduk' },
                                    { idx: 5, label: 'Air Minum Layak' },
                                    { idx: 6, label: 'Sanitasi Layak' },
                                  ].map(({ idx, label }) => (
                                    <span key={idx} className="px-1.5 py-0.5 rounded border bg-white text-xs">
                                      <MathTex tex={`X_{${idx}} = \\text{${label.replace(/ /g, '~')}}`} />
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="text-xs text-gray-700 text-center">
                              Variabel signifikan: {Object.entries(selectedRegionData.equation.coefficients).filter(([key, c]) => key !== 'intercept' && c.significant).length} / {Object.keys(selectedRegionData.equation.coefficients).filter(k => k !== 'intercept').length}
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground text-center">Pilih wilayah untuk melihat ringkasan persamaan.</div>
                        )}
                      </div>

                      {/* Ringkasan tab Wilayah dan Interpretasi */}
                      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Ringkasan Wilayah */}
                        <div className="p-4 rounded-lg border bg-white">
                          <div className="text-sm font-semibold mb-2">Ringkasan Wilayah</div>
                          {selectedRegion ? (
                            regionData ? (
                              <div className="space-y-2 text-sm">
                                {/* Kasus pneumonia selalu ditampilkan */}
                                <div className="p-3 bg-white rounded-lg border shadow-sm mb-3">
                                  <div className="text-xs font-medium text-muted-foreground">Kasus Pneumonia</div>
                                  <div className="text-lg font-bold text-primary">{formatNum(regionData.Penemuan)}</div>
                                </div>
                                
                                {/* Variabel signifikan berdasarkan model */}
                                {selectedRegionData?.equation ? (
                                  (() => {
                                    const significantVars = Object.entries(selectedRegionData.equation.coefficients)
                                      .filter(([key, coeff]) => key !== 'intercept' && coeff.significant);
                                    
                                    const varMapping = {
                                      'giziKurang': { label: 'Gizi Kurang', value: formatInt(regionData.GiziKurang), unit: '' },
                                      'imd': { label: 'IMD', value: formatPct(regionData.IMD, 2), unit: '' },
                                      'rokokPerkapita': { label: 'Rokok/Kapita', value: formatDec(regionData.RokokPerkapita, 3), unit: '' },
                                      'kepadatan': { label: 'Kepadatan', value: formatNum(regionData.Kepadatan), unit: ' jiwa/km²' },
                                      'airMinum': { label: 'Air Minum', value: formatPct(regionData.AirMinumLayak, 2), unit: '' },
                                      'sanitasi': { label: 'Sanitasi', value: formatPct(regionData.Sanitasi, 2), unit: '' }
                                    };
                                    
                                    return significantVars.length > 0 ? (
                                      <div className="grid grid-cols-2 gap-2">
                                        {significantVars.map(([varName]) => {
                                          const varInfo = varMapping[varName as keyof typeof varMapping];
                                          if (!varInfo) return null;
                                          
                                          return (
                                            <div key={varName} className="p-3 bg-white rounded-lg border shadow-sm">
                                              <div className="text-xs font-medium text-muted-foreground">{varInfo.label}</div>
                                              <div className="text-base font-semibold text-primary">
                                                {varInfo.value}{varInfo.unit}
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    ) : (
                                      <div className="text-sm text-muted-foreground italic">
                                        Tidak ada variabel yang signifikan untuk wilayah ini.
                                      </div>
                                    );
                                  })()
                                ) : (
                                  <div className="text-sm text-muted-foreground italic">
                                    Memuat data model...
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="text-sm text-muted-foreground">Data wilayah tidak ditemukan.</div>
                            )
                          ) : (
                            <div className="text-sm text-muted-foreground">Pilih wilayah pada peta untuk melihat ringkasan.</div>
                          )}
                        </div>

                        {/* Ringkasan Interpretasi */}
                        <div className="p-4 rounded-lg border bg-white">
                          <div className="text-sm font-semibold mb-2">Ringkasan Interpretasi</div>
                          {selectedRegionData?.equation ? (
                            (() => {
                              const simple = createSimpleInterpretation(selectedRegionData.equation);
                              const risk = simple.significantFactors.filter(f => f.effect === 'increase').length;
                              const prot = simple.significantFactors.filter(f => f.effect === 'decrease').length;
                              return (
                                <div className="space-y-2 text-sm">
                                  <div className="line-clamp-3 text-muted-foreground">{simple.summary}</div>
                                  <div className="flex gap-2 text-xs">
                                    <span className="px-2 py-1 rounded bg-red-50 text-red-700">Risiko: {risk}</span>
                                    <span className="px-2 py-1 rounded bg-green-50 text-green-700">Protektif: {prot}</span>
                                    <span className="px-2 py-1 rounded bg-gray-50 text-gray-700">Total signifikan: {simple.significantFactors.length}</span>
                                  </div>
                                </div>
                              );
                            })()
                          ) : (
                            <div className="text-sm text-muted-foreground">Pilih wilayah untuk melihat ringkasan interpretasi.</div>
                          )}
                        </div>
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
                      regionData ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 rounded-lg border bg-white">
                              <div className="text-sm font-medium text-muted-foreground">Kasus Pneumonia</div>
                              <div className="text-2xl font-bold">{formatNum(regionData.Penemuan)}</div>
                            </div>
                            <div className="p-4 rounded-lg border bg-white">
                              <div className="text-sm font-medium text-muted-foreground">Gizi Kurang</div>
                              <div className="text-2xl font-bold">{formatInt(regionData.GiziKurang)}</div>
                            </div>
                            <div className="p-4 rounded-lg border bg-white">
                              <div className="text-sm font-medium text-muted-foreground">IMD</div>
                              <div className="text-2xl font-bold">{formatPct(regionData.IMD, 2)}</div>
                            </div>
                            <div className="p-4 rounded-lg border bg-white">
                              <div className="text-sm font-medium text-muted-foreground">Perokok/Kapita</div>
                              <div className="text-2xl font-bold">{formatDec(regionData.RokokPerkapita, 3)}</div>
                            </div>
                            <div className="p-4 rounded-lg border bg-white">
                              <div className="text-sm font-medium text-muted-foreground">Kepadatan Penduduk</div>
                              <div className="text-2xl font-bold">{formatNum(regionData.Kepadatan)}<span className="text-base font-semibold"> jiwa/km²</span></div>
                            </div>
                            <div className="p-4 rounded-lg border bg-white">
                              <div className="text-sm font-medium text-muted-foreground">Sanitasi Layak</div>
                              <div className="text-2xl font-bold">{formatPct(regionData.Sanitasi, 2)}</div>
                            </div>
                            <div className="p-4 rounded-lg border bg-white">
                              <div className="text-sm font-medium text-muted-foreground">Air Minum Layak</div>
                              <div className="text-2xl font-bold">{formatPct(regionData.AirMinumLayak, 2)}</div>
                            </div>
                          </div>
                          <div className="p-4 bg-muted/30 rounded-lg">
                            <p className="text-sm text-muted-foreground">
                              <strong>Catatan:</strong> Angka sesuai data wilayah aktual. Persentase ditampilkan dengan pemisah desimal Indonesia.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <div className="text-muted-foreground mb-2">Data wilayah tidak ditemukan</div>
                          <p className="text-sm text-muted-foreground">Silakan pilih wilayah lain pada peta</p>
                        </div>
                      )
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