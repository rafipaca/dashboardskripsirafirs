"use client"

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUpIcon, BarChartIcon, PieChartIcon, MapPinIcon } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, ChartConfig } from "@/components/ui/chart";
import { PieLabel } from "recharts";

interface AnalyticsTabsProps {
  selectedRegion: string | null;
  selectedTimeframe: string;
  onTimeframeChange: (value: string) => void;
}

const barData = [
  { name: 'Jakarta', value: 289 },
  { name: 'Bandung', value: 214 },
  { name: 'Surabaya', value: 176 },
  { name: 'Semarang', value: 154 },
  { name: 'Cianjur', value: 153 },
  { name: 'Bogor', value: 147 },
];

const barChartConfig = {
  value: {
    label: "Jumlah Kasus",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

const pieData = [
  { name: 'High Risk', value: 12, fill: 'var(--risk-high)' },
  { name: 'Medium-High Risk', value: 18, fill: 'var(--risk-medium-high)' },
  { name: 'Medium Risk', value: 25, fill: 'var(--risk-medium)' },
  { name: 'Low Risk', value: 45, fill: 'var(--risk-low)' },
];

const pieChartConfig = {
  "High Risk": { label: "High Risk", color: "var(--risk-high)" },
  "Medium-High Risk": { label: "Medium-High Risk", color: "var(--risk-medium-high)" },
  "Medium Risk": { label: "Medium Risk", color: "var(--risk-medium)" },
  "Low Risk": { label: "Low Risk", color: "var(--risk-low)" },
} satisfies ChartConfig

const lineData = [
  { name: 'Jan', Jakarta: 42, Bandung: 28, Surabaya: 24 },
  { name: 'Feb', Jakarta: 38, Bandung: 26, Surabaya: 21 },
  { name: 'Mar', Jakarta: 45, Bandung: 31, Surabaya: 28 },
  { name: 'Apr', Jakarta: 56, Bandung: 37, Surabaya: 32 },
  { name: 'May', Jakarta: 52, Bandung: 32, Surabaya: 28 },
  { name: 'Jun', Jakarta: 48, Bandung: 30, Surabaya: 26 },
];

const lineChartConfig = {
  Jakarta: {
    label: "Jakarta",
    color: "var(--primary)",
  },
  Bandung: {
    label: "Bandung",
    color: "var(--destructive)",
  },
  Surabaya: {
    label: "Surabaya",
    color: "var(--risk-low)",
  },
} satisfies ChartConfig;

// Custom label for pie chart to handle undefined percent
const renderCustomizedLabel = ({ name, percent }: { name: string; percent?: number }) => {
  if (percent === undefined) return null;
  return `${name}: ${(percent * 100).toFixed(0)}%`;
};

export default function AnalyticsTabs({ selectedRegion, selectedTimeframe, onTimeframeChange }: AnalyticsTabsProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Analisis Data</CardTitle>
            <CardDescription>
              Visualisasi statistik kasus pneumonia balita
            </CardDescription>
          </div>
          <Select defaultValue={selectedTimeframe} onValueChange={onTimeframeChange}>
            <SelectTrigger className="w-[180px] mt-2 md:mt-0">
              <SelectValue placeholder="Periode Waktu" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3m">3 Bulan Terakhir</SelectItem>
              <SelectItem value="6m">6 Bulan Terakhir</SelectItem>
              <SelectItem value="1y">1 Tahun Terakhir</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="regions">Per Wilayah</TabsTrigger>
            <TabsTrigger value="trends">Tren Waktu</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Bar Chart */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Kasus per Kota/Kabupaten Tertinggi</CardTitle>
                  <BarChartIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ChartContainer config={barChartConfig} className="w-full h-full">
                      <BarChart accessibilityLayer data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid vertical={false} stroke="hsl(var(--muted))" />
                        <XAxis
                          dataKey="name"
                          tickLine={false}
                          tickMargin={10}
                          axisLine={false}
                          tick={{ fill: "hsl(var(--foreground))" }}
                        />
                        <YAxis tickLine={false} axisLine={false} tick={{ fill: "hsl(var(--foreground))" }}/>
                        <ChartTooltip
                          cursor={false}
                          content={<ChartTooltipContent indicator="dot" />}
                        />
                        <Bar
                          dataKey="value"
                          fill="var(--color-value)"
                          radius={4}
                        />
                      </BarChart>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Pie Chart */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Distribusi Kategori Risiko</CardTitle>
                  <PieChartIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ChartContainer config={pieChartConfig} className="w-full h-full">
                      <PieChart>
                        <ChartTooltip
                          cursor={false}
                          content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                          data={pieData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          labelLine={false}
                          label={renderCustomizedLabel}
                        >
                           {pieData.map((entry) => (
                              <Cell key={entry.name} fill={entry.fill} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="regions">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Analisis Per Wilayah</CardTitle>
                <CardDescription>
                  Pilih wilayah pada peta untuk melihat detail
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedRegion ? (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">{selectedRegion}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary">87</div>
                            <p className="text-xs text-muted-foreground mt-1">Total Kasus</p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-amber-500">Medium</div>
                            <p className="text-xs text-muted-foreground mt-1">Kategori Risiko</p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-500">+2.4%</div>
                            <p className="text-xs text-muted-foreground mt-1">Perubahan (YoY)</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <MapPinIcon className="h-10 w-10 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Silakan pilih wilayah pada peta untuk melihat analisis detail
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tren Kasus per Bulan</CardTitle>
                <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ChartContainer config={lineChartConfig} className="w-full h-full">
                    <LineChart
                      accessibilityLayer
                      data={lineData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid vertical={false} stroke="hsl(var(--muted))" />
                      <XAxis
                        dataKey="name"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tick={{ fill: "hsl(var(--foreground))" }}
                      />
                      <YAxis tickLine={false} axisLine={false} tick={{ fill: "hsl(var(--foreground))" }}/>
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="dot" />}
                      />
                      <Line
                        dataKey="Jakarta"
                        type="monotone"
                        stroke="var(--color-Jakarta)"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        dataKey="Bandung"
                        type="monotone"
                        stroke="var(--color-Bandung)"
                        strokeWidth={2}
                        dot={false}
                      />
                       <Line
                        dataKey="Surabaya"
                        type="monotone"
                        stroke="var(--color-Surabaya)"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
} 