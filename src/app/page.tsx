"use client";

import { useState, useEffect } from "react";
import { FeatureCollection } from "geojson";
import Navigation from "@/components/Navigation";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import OverviewCards from "@/components/dashboard/OverviewCards";
import MapCard from "@/components/dashboard/MapCard";
import AnalyticsTabs from "@/components/dashboard/AnalyticsTabs";

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 3000;

export default function Home() {
  const [geojsonData, setGeojsonData] = useState<FeatureCollection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState("6m");

  const fetchGeojsonData = () => {
    setIsLoading(true);
    setError(null);

    let attempts = 0;
    const tryFetch = () => {
      fetch("/data/rbipulaujawageojson.geojson")
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Gagal mengambil data: ${res.statusText}`);
          }
          return res.json();
        })
        .then((data) => {
          setGeojsonData(data);
          setIsLoading(false);
        })
        .catch((error) => {
          attempts++;
          if (attempts < MAX_RETRIES) {
            console.log(
              `Gagal memuat data, mencoba lagi dalam ${
                RETRY_DELAY_MS / 1000
              } detik... (percobaan ke ${attempts})`
            );
            setTimeout(tryFetch, RETRY_DELAY_MS);
          } else {
            console.error(
              "Gagal memuat data GeoJSON setelah beberapa kali percobaan:",
              error
            );
            setError(error);
            setIsLoading(false);
          }
        });
    };

    tryFetch();
  };

  useEffect(() => {
    fetchGeojsonData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <Navigation />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header */}
        <DashboardHeader />

        {/* Overview Cards */}
        <OverviewCards />

        {/* Map Section */}
        <MapCard
          geojsonData={geojsonData}
          isLoading={isLoading}
          error={error}
          onRetry={fetchGeojsonData}
          onRegionSelect={setSelectedRegion}
        />

        {/* Charts Section */}
        <AnalyticsTabs
          selectedRegion={selectedRegion}
          selectedTimeframe={selectedTimeframe}
          onTimeframeChange={setSelectedTimeframe}
        />
      </main>
    </div>
  );
}
