"use client";

import { useEffect, useRef, useState } from "react";
import { WebStoryData, StorySection } from "@/types/story";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Target, Rocket, Flag, Sparkles, MapPin, BarChart3, Activity, Users, Zap, TrendingUp, ArrowUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

type Props = { data: WebStoryData };

export default function WebStory({ data }: Props) {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // icons are defined per-section header below

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
    // very small markdown subset renderer (headings, bold, italic, lists, links, paragraphs)
    let html = md
      .replace(/^###\s(.+)$/gim, '<h3>$1<\/h3>')
      .replace(/^##\s(.+)$/gim, '<h2>$1<\/h2>')
      .replace(/^#\s(.+)$/gim, '<h1>$1<\/h1>')
      .replace(/\*\*(.+?)\*\*/gim, '<strong>$1<\/strong>')
      .replace(/\*(.+?)\*/gim, '<em>$1<\/em>')
      .replace(/\[(.+?)\]\((.+?)\)/gim, '<a href="$2" class="underline decoration-primary underline-offset-4" target="_blank" rel="noopener noreferrer">$1<\/a>');

    // handle lists (numbered and bullets)
    html = html
      .replace(/^\s*\*\s(.+)$/gim, '<li>$1<\/li>')
      .replace(/^\s*\d+\.\s(.+)$/gim, '<li>$1<\/li>');
    // wrap consecutive <li> into <ul>
    html = html.replace(/(?:<li>.*<\/li>\n?)+/g, (m) => `<ul class="list-disc pl-6 space-y-1">${m}<\/ul>`);

    // paragraphs
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

          {/* Hero Section with Background Image */}
  <div className="relative overflow-hidden min-h-[70vh] flex items-center">

  <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center text-foreground">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div className="inline-flex items-center gap-2 text-xs mb-4 bg-muted/40 rounded-full px-3 py-1.5">
              <BookOpen className="h-4 w-4" /> 
              <span>Web Story Penelitian</span>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-6xl font-bold tracking-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="text-foreground">Analisis Spasial</span>
              <br />
              <span className="text-[#1d9bf0]">GWNBR Pneumonia</span>
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="max-w-4xl mx-auto"
            >
              <p className="text-base md:text-lg mb-2 text-muted-foreground">
                {data.metadata.author} • {data.metadata.institution}
              </p>
              <p className="text-muted-foreground mb-8 text-base md:text-lg leading-relaxed">
                {data.metadata.short_bio}
              </p>
              
              <div>
                <Button asChild className="bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white">
                  <Link href="/dashboard">
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Jelajahi Dashboard
                  </Link>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Stats band */}
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
  <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {[
            { label: "Kabupaten/Kota", value: "119", icon: MapPin, color: "text-blue-600" },
            { label: "Variabel Prediktor", value: "8", icon: BarChart3, color: "text-green-600" },
            { label: "Periode Data", value: "2023", icon: Activity, color: "text-purple-600" },
            { label: "Model Akurasi", value: "95%", icon: Target, color: "text-orange-600" },
          ].map((s, i) => {
            const IconComp = s.icon;
            return (
              <Card key={i} className="shadow-sm bg-card border">
                <CardContent className="py-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <div className={`w-8 h-8 rounded-full bg-muted grid place-items-center`}>
                      <IconComp className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="text-2xl font-semibold text-[#1d9bf0]">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative">
  {/* Minimal background, no decorative blobs */}
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="space-y-16">
            
            {/* Abstract - Magazine style full width */}
            <motion.section
              id="abstract"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="grid lg:grid-cols-12 gap-8 items-center">
                <motion.div 
                  className="lg:col-span-12"
                  whileHover={{ scale: 1.02 }} 
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="shadow-sm bg-card border overflow-hidden">
                    <CardContent className="p-8 md:p-12 relative">
                      <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-muted grid place-items-center">
                              <Sparkles className="h-5 w-5 text-muted-foreground" />
                            </div>
                          <div>
                              <Badge variant="outline" className="mb-2 text-xs border-[#1d9bf0] text-[#1d9bf0]">
                              ABSTRAK PENELITIAN
                            </Badge>
                            <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
                              {data.abstract.title}
                            </h2>
                          </div>
                        </div>
                        
                        <div className="prose prose-lg dark:prose-invert max-w-none">
                          <div className="text-lg leading-relaxed text-gray-700 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: mdToHtml(data.abstract.content) }} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </motion.section>

            {/* 1. Two Column Information Section - Ancaman Senyap & Masalah Terlupakan */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="grid lg:grid-cols-2 gap-8">
                {/* First Column - Masalah yang Terlupakan */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
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
                </motion.div>

                {/* Second Column - Ancaman Senyap (using abstract) */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Card className="shadow-sm bg-card border h-full">
                    <CardContent className="p-8">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-muted grid place-items-center border border-[#1d9bf0]/30">
                          <Sparkles className="h-6 w-6 text-[#1d9bf0]" />
                        </div>
                        <div>
                          <Badge variant="outline" className="mb-2 text-xs border-[#1d9bf0] text-[#1d9bf0]">
                            ABSTRAK PENELITIAN
                          </Badge>
                          <h3 className="text-xl font-bold text-foreground leading-tight">
                            {data.abstract.title}
                          </h3>
                        </div>
                      </div>
                      <div className="prose prose-lg dark:prose-invert max-w-none">
                        <div className="text-lg leading-relaxed text-gray-700 dark:text-gray-300" 
                             dangerouslySetInnerHTML={{ __html: mdToHtml(data.abstract.content) }} />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </motion.section>

            {/* 2. Satu Solusi Tak Cukup - 2 kolom dengan gambar kanan */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                {/* Left Column - Content */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <Card className="shadow-sm bg-card border">
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
                </motion.div>

                {/* Right Column - Image placeholder */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="relative"
                >
                  <div className="bg-muted/20 rounded-2xl p-12 text-center border-2 border-dashed border-muted-foreground/20">
                    <Target className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h4 className="text-lg font-semibold text-foreground mb-2">Ilustrasi Konsep</h4>
                    <p className="text-muted-foreground">Gambar untuk "Satu Solusi Tak Cukup"</p>
                  </div>
                </motion.div>
              </div>
            </motion.section>

            {/* 3. Map Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="relative"
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
                        Peta Faktor Risiko Wilayah (Interaktif)
                      </h3>
                    </div>
                  </div>
                  <div className="prose prose-lg dark:prose-invert max-w-none mb-6">
                    <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                      Jelajahi signifikansi variabel dan nilai indikator per kabupaten/kota di Pulau Jawa.
                    </p>
                  </div>
                  {/* Map component placeholder - will integrate with dashboard map */}
                  <div className="bg-muted/10 rounded-lg p-8 text-center border">
                    <MapPin className="h-20 w-20 mx-auto mb-4 text-muted-foreground" />
                    <h4 className="text-lg font-semibold text-foreground mb-2">Peta Interaktif Dashboard</h4>
                    <p className="text-muted-foreground mb-4">Map dari dashboard akan ditampilkan di sini</p>
                    <Button asChild className="bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white">
                      <Link href="/dashboard">
                        <MapPin className="mr-2 h-4 w-4" />
                        Lihat di Dashboard
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.section>

            {/* 4. Cluster Sections - 2 kolom (kiri: penjelasan, kanan: gambar) */}
            {data.story_sections.slice(4).map((sec, idx) => {
              // Only show key_findings sections (cluster explanations)
              if (sec.type !== "key_findings") return null;
              
              return (
                <motion.section
                  key={idx + 4}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                  className="relative"
                >
                  <div className="grid lg:grid-cols-2 gap-8 items-stretch">
                    {/* Left Column - Explanation */}
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                    >
                      <Card className="shadow-sm bg-card border">
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
                    </motion.div>

                    {/* Right Column - Image */}
                    <motion.div
                      initial={{ opacity: 0, x: 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="relative"
                    >
                      <div className="relative h-full min-h-[420px] md:min-h-[520px] overflow-hidden">
                        {sec.imageSrc ? (
                          <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={sec.imageSrc}
                              alt={sec.imageAlt || sec.title}
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          </>
                        ) : (
                          <div className="flex items-center justify-center h-full text-center">
                            <div>
                              <BarChart3 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                              <h4 className="text-lg font-semibold text-foreground mb-2">Ilustrasi Kluster</h4>
                              <p className="text-muted-foreground">{sec.title}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </div>
                </motion.section>
              );
            })}

            {/* Other sections (conclusion, practical application, etc.) */}
            {data.story_sections.slice(2).map((sec, idx) => {
              const adjustedIdx = idx + 2;
              if (sec.type === "key_findings" || adjustedIdx === 2) return null;
              return (
                <motion.section
                  key={adjustedIdx}
                  id={slugify(sec.title, adjustedIdx)}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  <Card className="shadow-sm bg-card border">
                    <CardContent className="p-8">
                      <SectionHeader sec={sec} />
                      <SectionContent sec={sec} idx={adjustedIdx} />
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
                  <div className="my-10 md:my-12 h-px bg-border" />
                </motion.section>
              );
            })}
            
            {/* Ending CTA */}
            <motion.section
              id="closing"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <div>
                <Card className="shadow-sm bg-card border">
                  <CardContent className="p-8 md:p-12 text-center space-y-6">
                    <div className="w-12 h-12 mx-auto rounded-full bg-[#1d9bf0] flex items-center justify-center">
                      <Flag className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold text-foreground">Terima kasih telah membaca</h3>
                    <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed text-lg">
                      Lanjutkan eksplorasi di dashboard interaktif untuk melihat peta risiko, analisis lokal, dan rekomendasi kebijakan spesifik wilayah.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                      <div>
                        <Button asChild className="bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white">
                          <Link href="/dashboard">
                            <BarChart3 className="mr-2 h-5 w-5" />
                            Buka Dashboard
                          </Link>
                        </Button>
                      </div>
                      <div>
                        <Button asChild variant="outline" className="border-[#1d9bf0] text-[#1d9bf0] hover:bg-[#1d9bf0]/10">
                          <Link href="/dashboard/tentang">
                            <BookOpen className="mr-2 h-5 w-5" />
                            Tentang Penelitian
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.section>
          </div>
        </div>
      </div>

      {/* Back to top button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: progress > 15 ? 1 : 0, scale: progress > 15 ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 z-40 rounded-full bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white shadow-lg px-6 py-3 text-sm font-medium"
        aria-label="Kembali ke atas"
      >
        <div className="flex items-center gap-2">
          <ArrowUp className="h-4 w-4" />
          Ke atas
        </div>
      </motion.button>
    </div>
  );
}

// Helper components for cleaner code
function SectionHeader({ sec }: { sec: StorySection }) {
  const iconByType: Record<StorySection["type"], LucideIcon> = {
    introduction: Users,
    methodology: Zap,
    key_findings: Target,
    practical_application: Rocket,
    conclusion: Flag,
    map: MapPin,
  };

  const pillFromTypeLocal: Record<StorySection["type"], string> = {
    introduction: "PERKENALAN",
    methodology: "METODOLOGI",
    key_findings: "TEMUAN KUNCI",
    practical_application: "APLIKASI PRAKTIS",
    conclusion: "KESIMPULAN",
    map: "PETA INTERAKTIF",
  };

  const Icon = iconByType[sec.type];

  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-12 h-12 rounded-xl bg-muted grid place-items-center border border-[#1d9bf0]/30">
        <Icon className="h-6 w-6 text-[#1d9bf0]" />
      </div>
      <div>
  <Badge variant="outline" className="mb-1 text-[10px] tracking-wide border-[#1d9bf0] text-[#1d9bf0]">
          {pillFromTypeLocal[sec.type]}
        </Badge>
  <h3 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
          {sec.title}
        </h3>
      </div>
    </div>
  );
}

function SectionContent({ sec, idx }: { sec: StorySection; idx: number }) {
  const mdToHtml = (content: string): string => {
    // Avoid TSX parsing issues with regex literals that contain `</...>` by using RegExp constructors
    const bold = /\*\*(.*?)\*\*/g;
    const italic = /\*(.*?)\*/g;
    const listItem = /- (.*?)(?=\n|$)/g;
    const listGroup = new RegExp("(<li>.*</li>)", "s");

    const html = content
      .replace(bold, "<strong>$1</strong>")
      .replace(italic, "<em>$1</em>")
      .replace(listItem, "<li>$1</li>")
      .replace(listGroup, "<ul>$1</ul>")
      .split(/\n\n+/)
      .map((block) =>
        /<h\d|<ul|<li/.test(block) ? block : `<p>${block.replace(/\n/g, '<br/>')}</p>`
      )
      .join("\n");
    return html.trim();
  };

  // Handle different section types
  if (sec.type === "map") {
    return (
      <div className="prose prose-lg dark:prose-invert max-w-none" data-idx={idx}>
        {sec.description && (
          <div className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            <p>{sec.description}</p>
          </div>
        )}
        {/* Map component would be rendered here */}
        <div className="bg-muted/20 rounded-lg p-6 text-center">
          <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Peta interaktif akan ditampilkan di sini</p>
        </div>
      </div>
    );
  }

  // Default content rendering for other section types
  if (!sec.content) {
    return (
      <div className="prose prose-lg dark:prose-invert max-w-none" data-idx={idx}>
        <div className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          <p className="text-muted-foreground">Konten tidak tersedia</p>
        </div>
      </div>
    );
  }

  return (
    <div className="prose prose-lg dark:prose-invert max-w-none" data-idx={idx}>
      <div className="text-lg leading-relaxed text-gray-700 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: mdToHtml(sec.content) }} />
    </div>
  );
}

function slugify(title: string, index = 0) {
  if (!title) {
    return `section-${index}`;
  }
  
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-") + `-${index}`
  );
}

// no-op
