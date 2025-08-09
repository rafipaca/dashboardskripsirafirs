import type { Metadata } from "next";
import { DashboardHeader } from "@/components/layout/DashboardHeader";

export const metadata: Metadata = {
  title: "Dashboard GWNBR Pneumonia",
  description: "Dashboard analisis model GWNBR untuk kasus pneumonia balita di Pulau Jawa",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Dashboard Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 border-b border-border/30">
        <div className="px-6 py-4">
          <DashboardHeader />
        </div>
      </div>
      
      {/* Dashboard Content */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}