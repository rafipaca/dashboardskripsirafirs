"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { useGeojsonData } from "@/hooks/useGeojsonData";
import MapCard from "@/components/cards/MapCard/MapCard";
import ResearchSummaryCards from "@/components/cards/ResearchSummaryCards";
import AnalyticsTabs from "@/components/cards/AnalyticsTabs";
import RegionalInsights from "@/components/cards/RegionalInsights";
import { ANIMATION_CONSTANTS } from '@/lib/constants';

// Konstanta sudah dipindahkan ke file constants.ts

// Komponen untuk mengurangi duplikasi motion.div
interface AnimatedSectionProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

const AnimatedSection = ({ children, delay = 0 }: AnimatedSectionProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: ANIMATION_CONSTANTS.DURATION, delay }}
  >
    {children}
  </motion.div>
);

// Komponen untuk header dengan animasi
const AnimatedHeader = () => (
  <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 border-b border-border/30">
    <div className="px-6 py-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: ANIMATION_CONSTANTS.DURATION }}
      >
        <DashboardHeader />
      </motion.div>
    </div>
  </div>
);



export default function Home() {
  const { data: geojsonData, isLoading, error, refetch } = useGeojsonData();
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedPredictionRegion, setSelectedPredictionRegion] = useState<string | null>(null);

  const handleRegionSelect = (regionName: string | null) => {
    // MapCard sends the region name directly
    setSelectedRegion(regionName);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}


      {/* Main Content */}
      <main className="max-w-7xl mx-auto">
        <div className="border-x border-border/30 min-h-screen relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/2 via-transparent to-primary/1 pointer-events-none" />
          
          {/* Header */}
          <AnimatedHeader />

          {/* Content Container */}
          <div className="divide-y divide-border/20">
            {/* Research Summary Cards */}
            <AnimatedSection>
              <div className="p-6">
                <ResearchSummaryCards />
              </div>
            </AnimatedSection>

            {/* Regional Data */}
            <AnimatedSection delay={0.15}>
              <div className="p-6">
                <RegionalInsights />
              </div>
            </AnimatedSection>

            {/* Interactive Map Section */}
            <AnimatedSection delay={0.2}>
              <div className="p-6">
                <MapCard 
                  geojsonData={geojsonData as any}
                  isLoading={isLoading}
                  error={error}
                  onRetry={refetch}
                  onRegionSelect={handleRegionSelect}
                  onPredictionSelect={setSelectedPredictionRegion}
                />
              </div>
            </AnimatedSection>

            {/* Analytics Section */}
            <AnimatedSection delay={0.25}>
              <div className="p-6">
                <AnalyticsTabs 
                  selectedRegion={selectedRegion} 
                />
              </div>
            </AnimatedSection>

            {/* Footer spacing */}
            <div className="h-24" />
          </div>
        </div>
      </main>
    </div>
  );
}
