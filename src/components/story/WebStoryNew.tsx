"use client";

import { useEffect, useRef, useState } from "react";
import { WebStoryData } from "@/types/story";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Target, Rocket, Flag, Sparkles, MapPin, BarChart3, Activity, Users, Zap, ArrowUp } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useGeojsonData } from "@/hooks/useGeojsonData";
import Map from "@/components/maps/Map";
import { MapLoadingState } from "@/components/cards/MapCard/MapLoadingState";
import { MapErrorState } from "@/components/cards/MapCard/MapErrorState";
import { MapLegend } from "@/components/cards/MapCard/MapLegend";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Props = { data: WebStoryData };

export default function WebStoryNew({ data }: Props) {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { data: geojsonData, isLoading: isGeoLoading, error: geoError, refetch } = useGeojsonData();
  const [activeLayer, setActiveLayer] = useState<string>("significance");

  useEffect(() => {
    const handler = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const denom = Math.max(1, docHeight - winHeight);
      setProgress(Math.min(100, Math.max(0, (scrollTop / denom) * 100)));
    };
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("scroll", handler);
      window.removeEventListener("resize", handler);
    };
  }, []);

  const mdToHtml = (md: string) => {
    let html = md
      .replace(/^###\s(.+)$/gim, '<h3>$1<\/h3>')
      .replace(/^##\s(.+)$/gim, '<h2>$1<\/h2>')
      .replace(/^#\s(.+)$/gim, '<h1>$1<\/h1>')
      .replace(/\*\*(.+?)\*\*/gim, '<strong>$1<\/strong>')
      .replace(/\*(.+?)\*/gim, '<em>$1<\/em>')
      .replace(/\[(.+?)\]\((.+?)\)/gim, '<a href="$2" class="underline decoration-primary underline-offset-4" target="_blank" rel="noopener noreferrer">$1<\/a>');

    html = html
      .replace(/^\s*\*\s(.+)$/gim, '<li>$1<\/li>')
      .replace(/^\s*\d+\.\s(.+)$/gim, '<li>$1<\/li>');
    html = html.replace(/(?:<li>.*<\/li>\n?)+/g, (m) => `<ul class="list-disc pl-6 space-y-1">${m}<\/ul>`);

    html = html
      .split(/\n\n+/)
      .map((block) =>
        /<h\d|<ul|<li/.test(block) ? block : `<p>${block.replace(/\n/g, '<br/>')}<\/p>`
      )
      .join("\n");
    return html.trim();
  };

  return (
    <div ref={containerRef} className="min-h-[calc(100vh-4rem)] bg-background">
      {/* Reading progress */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-transparent z-40">
        <div className="h-full bg-[#1d9bf0] transition-[width] duration-300" style={{ width: `${progress}%` }} />
      </div>

      {/* Hero Section */}
      <div 
        className="relative overflow-hidden min-h-[70vh] flex items-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/jawa.webp')",
        }}
      >
        {/* Overlay untuk readability */}
        <div className="absolute inset-0 bg-black/50"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center text-white z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div className="inline-flex items-center gap-2 text-xs mb-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 text-white">
              <BookOpen className="h-4 w-4" />
              <span>Web Story Penelitian</span>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-6xl font-bold tracking-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="text-white">Analisis Spasial</span>
              <br />
              <span className="text-[#1d9bf0]">GWNBR Pneumonia</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="max-w-4xl mx-auto"
            >
              <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
                <span className="font-semibold text-white">Perjalanan eksplorasi mendalam</span> untuk mengungkap 
                <span className="text-yellow-300 font-medium"> rahasia pola tersembunyi</span> faktor risiko pneumonia balita 
                di wilayah terpadat Indonesia—<span className="font-bold text-white">Pulau Jawa</span>
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button asChild size="lg" className="bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white shadow-lg hover:shadow-xl transition-all duration-300">
                  <Link href="#content">
                    <ArrowUp className="mr-2 h-5 w-5 rotate-180" />
                    Mulai Petualangan Data
                  </Link>
                </Button>
                <div className="text-sm text-white/70 flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  <span>~8 menit membaca</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div id="content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
        <div className="space-y-16">

          {/* 1. Ancaman Senyap di Jawa & Masalah yang Terlupakan - 2 kolom */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left: Abstract - Ancaman Senyap di Jawa */}
              <Card className="shadow-sm bg-card border h-full">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-muted grid place-items-center">
                      <Sparkles className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <Badge variant="outline" className="mb-2 text-xs border-[#1d9bf0] text-[#1d9bf0]">
                        ABSTRAK PENELITIAN
                      </Badge>
                      <h3 className="text-xl font-bold text-foreground leading-tight">
                        Ancaman Senyap di Jawa
                      </h3>
                    </div>
                  </div>
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <div className="text-lg leading-relaxed text-gray-700 dark:text-gray-300" 
                         dangerouslySetInnerHTML={{ __html: mdToHtml(data.abstract.content) }} />
                  </div>
                </CardContent>
              </Card>

              {/* Right: Masalah yang Terlupakan */}
              <Card className="shadow-sm bg-card border h-full">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-muted grid place-items-center border border-[#1d9bf0]/30">
                      <Users className="h-6 w-6 text-[#1d9bf0]" />
                    </div>
                    <div>
                      <Badge variant="outline" className="mb-2 text-xs border-[#1d9bf0] text-[#1d9bf0]">
                        PERKENALAN
                      </Badge>
                      <h3 className="text-xl font-bold text-foreground leading-tight">
                        {data.story_sections[0]?.title}
                      </h3>
                    </div>
                  </div>
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <div className="text-lg leading-relaxed text-gray-700 dark:text-gray-300" 
                         dangerouslySetInnerHTML={{ __html: mdToHtml(data.story_sections[0]?.content || '') }} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.section>

          {/* 2. Satu Solusi Tak Cukup & Jejak Tiap Wilayah - 2 kolom */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid lg:grid-cols-2 gap-8 items-start">
              {/* Left: Satu Solusi Tak Cukup (already shown above but per pairing spec, kept together visually) */}
              <Card className="shadow-sm bg-card border h-full">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-muted grid place-items-center border border-[#1d9bf0]/30">
                      <Users className="h-6 w-6 text-[#1d9bf0]" />
                    </div>
                    <div>
                      <Badge variant="outline" className="mb-2 text-xs border-[#1d9bf0] text-[#1d9bf0]">
                        PERKENALAN
                      </Badge>
                      <h3 className="text-xl font-bold text-foreground leading-tight">
                        {data.story_sections[1]?.title}
                      </h3>
                    </div>
                  </div>
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <div className="text-lg leading-relaxed text-gray-700 dark:text-gray-300" 
                         dangerouslySetInnerHTML={{ __html: mdToHtml(data.story_sections[1]?.content || '') }} />
                  </div>
                </CardContent>
              </Card>

              {/* Right: Jejak Tiap Wilayah (Metodologi) */}
              <Card className="shadow-sm bg-card border h-full">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-muted grid place-items-center border border-[#1d9bf0]/30">
                      <Zap className="h-6 w-6 text-[#1d9bf0]" />
                    </div>
                    <div>
                      <Badge variant="outline" className="mb-2 text-xs border-[#1d9bf0] text-[#1d9bf0]">
                        METODOLOGI
                      </Badge>
                      <h3 className="text-xl font-bold text-foreground leading-tight">
                        {data.story_sections[2]?.title}
                      </h3>
                    </div>
                  </div>
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <div className="text-lg leading-relaxed text-gray-700 dark:text-gray-300" 
                         dangerouslySetInnerHTML={{ __html: mdToHtml(data.story_sections[2]?.content || '') }} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.section>

          {/* 3. Map Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <Card className="shadow-sm bg-card border">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-muted grid place-items-center border border-[#1d9bf0]/30">
                    <MapPin className="h-6 w-6 text-[#1d9bf0]" />
                  </div>
                  <div>
                    <Badge variant="outline" className="mb-2 text-xs border-[#1d9bf0] text-[#1d9bf0]">
                      PETA INTERAKTIF
                    </Badge>
                    <h3 className="text-xl font-bold text-foreground leading-tight">
                      {data.story_sections[3]?.title}
                    </h3>
                  </div>
                </div>
                <div className="prose prose-lg dark:prose-invert max-w-none mb-6">
                  <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                    {data.story_sections[3]?.description}
                  </p>
                </div>
                {/* Controls: layer selector + legend */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">Layer Peta:</span>
                    <Select value={activeLayer} onValueChange={setActiveLayer}>
                      <SelectTrigger className="w-[260px]">
                        <SelectValue placeholder="Pilih Layer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="significance">Peta Signifikansi</SelectItem>
                        <SelectItem value="Penemuan">Tingkat Penemuan Kasus (Y)</SelectItem>
                        <SelectItem value="GiziKurang">Gizi Kurang (X1)</SelectItem>
                        <SelectItem value="IMD">IMD (X2)</SelectItem>
                        <SelectItem value="RokokPerkapita">Rokok per Kapita (X3)</SelectItem>
                        <SelectItem value="Kepadatan">Kepadatan Penduduk (X4)</SelectItem>
                        <SelectItem value="AirMinumLayak">Air Minum Layak (X5)</SelectItem>
                        <SelectItem value="Sanitasi">Sanitasi (X6)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <MapLegend activeLayer={activeLayer} />
                  </div>
                </div>

                {/* Map container */}
                <div className="w-full h-[560px] rounded-lg overflow-hidden relative border">
                  {isGeoLoading && <MapLoadingState />}
                  {!isGeoLoading && geoError && (
                    <MapErrorState error={geoError} onRetry={refetch} />
                  )}
                  {!isGeoLoading && !geoError && geojsonData && (
                    <Map data={geojsonData} activeLayer={activeLayer} />
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* 4. Cluster Sections - 2 kolom (kiri: penjelasan, kanan: gambar) */}
          {data.story_sections.slice(4).map((sec, idx) => {
            if (sec.type !== "key_findings") return null;
            
            return (
              <motion.section
                key={idx + 4}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
              >
                <div className="grid lg:grid-cols-2 gap-8 items-stretch">
                  {/* Left - Explanation */}
                  <Card className="shadow-sm bg-card border h-full">
                    <CardContent className="p-8">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-muted grid place-items-center border border-[#1d9bf0]/30">
                          <Target className="h-6 w-6 text-[#1d9bf0]" />
                        </div>
                        <div>
                          <Badge variant="outline" className="mb-2 text-xs border-[#1d9bf0] text-[#1d9bf0]">
                            TEMUAN KUNCI
                          </Badge>
                          <h3 className="text-xl font-bold text-foreground leading-tight">
                            {sec.title}
                          </h3>
                        </div>
                      </div>
                      <div className="prose prose-lg dark:prose-invert max-w-none">
                        <div className="text-lg leading-relaxed text-gray-700 dark:text-gray-300" 
                             dangerouslySetInnerHTML={{ __html: mdToHtml(sec.content || '') }} />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Right - Image(s) full-bleed (no padding/border), horizontal layout for multiple images */}
                  <div className="relative h-full min-h-[420px] md:min-h-[520px] overflow-hidden rounded-lg">
                      {(() => {
                        const title = (sec.title || "").toLowerCase();
                        const images: string[] = [];
                        const pushUnique = (p: string) => { if (p && !images.includes(p)) images.push(p); };
                        // Derive images based on title keywords
                        if (title.includes("tiga variabel")) {
                          pushUnique("/malnutrisi.webp");
                          pushUnique("/rokok.webp");
                          pushUnique("/padat.webp");
                        } else {
                          if (title.includes("gizi")) pushUnique("/malnutrisi.webp");
                          if (title.includes("rokok")) pushUnique("/rokok.webp");
                          if (title.includes("kepadatan")) pushUnique("/padat.webp");
                        }
                        // Fallback to provided imageSrc
                        if (images.length === 0 && sec.imageSrc) pushUnique(sec.imageSrc);

                        if (images.length === 0) {
                          return (
                            <div className="flex items-center justify-center h-full min-h-[420px] md:min-h-[520px] text-center bg-muted/20">
                              <div>
                                <BarChart3 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                                <h4 className="text-lg font-semibold text-foreground mb-2">Ilustrasi Kluster</h4>
                                <p className="text-muted-foreground">{sec.title}</p>
                              </div>
                            </div>
                          );
                        }

                        // Single image - full width and height
                        if (images.length === 1) {
                          return (
                            <div className="relative w-full h-full">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={images[0]}
                                alt={sec.imageAlt || sec.title}
                                className="absolute inset-0 w-full h-full object-cover"
                              />
                            </div>
                          );
                        }

                        // Multiple images - horizontal layout, divided equally
                        const gridCols = images.length === 2 ? "grid-cols-2" : "grid-cols-3";
                        return (
                          <div className={`grid ${gridCols} h-full w-full`}>
                            {images.slice(0, 3).map((src, i) => (
                              <div key={`${src}-${i}`} className="relative w-full h-full">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={src}
                                  alt={sec.imageAlt || sec.title}
                                  className="absolute inset-0 w-full h-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                  </div>
                </div>
              </motion.section>
            );
          })}

          {/* Anomali & Peringatan - format seperti cluster (kanan gambar) */}
          {(() => {
            const anomaly = data.story_sections.find((s) => s.title?.toLowerCase().includes("anomali"));
            if (!anomaly) return null;
            return (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
              >
                <div className="grid lg:grid-cols-2 gap-8 items-stretch">
                  {/* Left - Explanation */}
                  <Card className="shadow-sm bg-card border h-full">
                    <CardContent className="p-8">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-muted grid place-items-center border border-[#1d9bf0]/30">
                          <Target className="h-6 w-6 text-[#1d9bf0]" />
                        </div>
                        <div>
                          <Badge variant="outline" className="mb-2 text-xs border-[#1d9bf0] text-[#1d9bf0]">
                            TEMUAN MENGEJUTKAN
                          </Badge>
                          <h3 className="text-xl font-bold text-foreground leading-tight">{anomaly.title}</h3>
                        </div>
                      </div>
                      <div className="prose prose-lg dark:prose-invert max-w-none">
                        <div
                          className="text-lg leading-relaxed text-gray-700 dark:text-gray-300"
                          dangerouslySetInnerHTML={{ __html: mdToHtml(anomaly.content || "") }}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Right - Image full-bleed */}
                  <div className="relative h-full min-h-[420px] md:min-h-[520px] overflow-hidden rounded-lg">
                    {anomaly.imageSrc ? (
                      <div className="relative w-full h-full">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={anomaly.imageSrc}
                          alt={anomaly.imageAlt || anomaly.title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full min-h-[420px] md:min-h-[520px] text-center bg-muted/20">
                        <div>
                          <BarChart3 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                          <h4 className="text-lg font-semibold text-foreground mb-2">Ilustrasi Anomali & Peringatan</h4>
                          <p className="text-muted-foreground">Ringkasan temuan mengejutkan</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.section>
            );
          })()}

          {/* Pair: Kesimpulan & Aplikasi Praktis */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left - Kesimpulan */}
              {(() => {
                const sec = data.story_sections.find((s) => s.type === "conclusion");
                if (!sec) return null;
                return (
                  <Card className="shadow-sm bg-card border">
                    <CardContent className="p-8">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-muted grid place-items-center border border-[#1d9bf0]/30">
                          <Flag className="h-6 w-6 text-[#1d9bf0]" />
                        </div>
                        <div>
                          <Badge variant="outline" className="mb-2 text-xs border-[#1d9bf0] text-[#1d9bf0]">
                            KESIMPULAN
                          </Badge>
                          <h3 className="text-xl font-bold text-foreground leading-tight">{sec.title}</h3>
                        </div>
                      </div>
                      <div className="prose prose-lg dark:prose-invert max-w-none">
                        <div
                          className="text-lg leading-relaxed text-gray-700 dark:text-gray-300"
                          dangerouslySetInnerHTML={{ __html: mdToHtml(sec.content || "") }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                );
              })()}

              {/* Right - Aplikasi Praktis */}
              {(() => {
                const sec = data.story_sections.find((s) => s.type === "practical_application");
                if (!sec) return null;
                return (
                  <Card className="shadow-sm bg-card border">
                    <CardContent className="p-8">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-muted grid place-items-center border border-[#1d9bf0]/30">
                          <Rocket className="h-6 w-6 text-[#1d9bf0]" />
                        </div>
                        <div>
                          <Badge variant="outline" className="mb-2 text-xs border-[#1d9bf0] text-[#1d9bf0]">
                            APLIKASI PRAKTIS
                          </Badge>
                          <h3 className="text-xl font-bold text-foreground leading-tight">{sec.title}</h3>
                        </div>
                      </div>
                      <div className="prose prose-lg dark:prose-invert max-w-none">
                        <div
                          className="text-lg leading-relaxed text-gray-700 dark:text-gray-300"
                          dangerouslySetInnerHTML={{ __html: mdToHtml(sec.content || "") }}
                        />
                      </div>
                      <div className="mt-6">
                        <Button asChild className="bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white">
                          <Link href="/dashboard">Akses Dashboard</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })()}
            </div>
          </motion.section>

          {/* Other sections */}
          {data.story_sections.slice(4).map((sec, idx) => {
            if (
              sec.type === "key_findings" ||
              sec.type === "conclusion" ||
              sec.type === "practical_application" ||
              (sec.title && sec.title.toLowerCase().includes("anomali"))
            )
              return null;
            
            return (
              <motion.section
                key={`other-${idx}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
              >
                <Card className="shadow-sm bg-card border">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-muted grid place-items-center border border-[#1d9bf0]/30">
                        {sec.type === "practical_application" ? (
                          <Rocket className="h-6 w-6 text-[#1d9bf0]" />
                        ) : (
                          <Flag className="h-6 w-6 text-[#1d9bf0]" />
                        )}
                      </div>
                      <div>
                        <Badge variant="outline" className="mb-2 text-xs border-[#1d9bf0] text-[#1d9bf0]">
                          {sec.type === "practical_application" ? "APLIKASI PRAKTIS" : "KESIMPULAN"}
                        </Badge>
                        <h3 className="text-xl font-bold text-foreground leading-tight">
                          {sec.title}
                        </h3>
                      </div>
                    </div>
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                      <div className="text-lg leading-relaxed text-gray-700 dark:text-gray-300" 
                           dangerouslySetInnerHTML={{ __html: mdToHtml(sec.content || '') }} />
                    </div>
                    {sec.type === "practical_application" && (
                      <div className="mt-6">
                        <Button asChild className="bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white">
                          <Link href="/dashboard">
                            <Rocket className="mr-2 h-5 w-5" />
                            Akses Dashboard
                          </Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.section>
            );
          })}

          {/* Back to top */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center"
          >
            <Button asChild variant="outline" size="lg">
              <Link href="#content">
                <ArrowUp className="mr-2 h-4 w-4" />
                Kembali ke Atas
              </Link>
            </Button>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
