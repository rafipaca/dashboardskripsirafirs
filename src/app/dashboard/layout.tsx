import type { Metadata } from "next";

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
  {/* Dashboard Content */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}