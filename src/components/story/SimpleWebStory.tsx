"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export type StorySlide = {
  id: string;
  title: string;
  subtitle?: string;
  text?: string;
  metricValue?: string;
  metricLabel?: string;
  legend?: Array<{ label: string; color: string }>;
  ctas?: Array<{ label: string; href: string; variant?: "default" | "outline" }>;
  // Optional icon element to render (passed from parent)
  Icon?: React.ComponentType<{ className?: string }>;
};

type Props = {
  slides: StorySlide[];
};

export default function SimpleWebStory({ slides }: Props) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef<number>(0);

  const safeIndex = useMemo(() => Math.max(0, Math.min(index, slides.length - 1)), [index, slides.length]);

  const goTo = useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(next, slides.length - 1));
      setDirection(next > index ? 1 : -1);
      setIndex(clamped);
    },
    [index, slides.length]
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current !== null) {
      touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
    }
  };
  const onTouchEnd = () => {
    const threshold = 60; // px
    if (touchDeltaX.current > threshold) prev();
    else if (touchDeltaX.current < -threshold) next();
    touchStartX.current = null;
    touchDeltaX.current = 0;
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background via-background to-primary/5 text-foreground">
      {/* Top progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1.5 bg-transparent z-30">
        <div
          className="h-full bg-primary/80 transition-[width] duration-300"
          style={{ width: `${((safeIndex + 1) / slides.length) * 100}%` }}
        />
      </div>

      {/* Slides viewport */}
      <div
        className="h-[100svh] max-h-[100svh] overflow-hidden flex items-stretch"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        role="region"
        aria-roledescription="carousel"
        aria-label="Web story"
      >
        <div className="w-full relative">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={slides[safeIndex].id}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 40 : -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -40 : 40 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <SlideCard slide={slides[safeIndex]} index={safeIndex} total={slides.length} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom controls */}
      <div className="fixed bottom-4 left-0 right-0 z-30 flex items-center justify-center gap-3 md:gap-4">
        <Button
          aria-label="Sebelumnya"
          size="icon"
          variant="outline"
          onClick={prev}
          disabled={safeIndex === 0}
          className="rounded-full backdrop-blur bg-card/70"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-1.5 md:gap-2">
          {slides.map((s, i) => (
            <button
              key={s.id}
              aria-label={`Ke slide ${i + 1}`}
              onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all duration-200 ${
                i === safeIndex ? "w-6 bg-primary" : "w-2 bg-muted"
              }`}
            />
          ))}
        </div>
        <Button
          aria-label="Berikutnya"
          size="icon"
          onClick={next}
          disabled={safeIndex === slides.length - 1}
          className="rounded-full"
        >
          <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}

function SlideCard({ slide, index, total }: { slide: StorySlide; index: number; total: number }) {
  const Icon = slide.Icon;
  return (
    <div className="h-full w-full px-5 sm:px-8 md:px-12 lg:px-16">
      <div className="h-full grid place-items-center">
        <div className="w-full max-w-5xl">
          <div className="rounded-3xl bg-card/70 backdrop-blur border shadow-xl overflow-hidden">
            {/* Accent band */}
            <div className="h-2 bg-gradient-to-r from-primary via-primary/70 to-primary/40" />
            <div className="p-6 md:p-10">
              <div className="flex items-start justify-between gap-4 mb-4">
                <span className="text-xs text-muted-foreground">{index + 1} / {total}</span>
                {slide.metricValue && (
                  <div className="text-right">
                    <div className="text-3xl md:text-4xl font-extrabold text-primary leading-none">{slide.metricValue}</div>
                    {slide.metricLabel && (
                      <div className="text-xs text-muted-foreground">{slide.metricLabel}</div>
                    )}
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-[1fr_2fr] gap-6 md:gap-10 items-center">
                {/* Visual / Icon */}
                <div className="order-2 md:order-1">
                  {Icon ? (
                    <div className="mx-auto w-28 h-28 md:w-36 md:h-36 rounded-2xl grid place-items-center bg-primary/10">
                      <Icon className="h-12 w-12 md:h-16 md:w-16 text-primary" />
                    </div>
                  ) : null}

                  {slide.legend && slide.legend.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {slide.legend.map((l, i) => (
                        <span key={i} className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border">
                          <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: l.color }} />
                          {l.label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Text */}
                <div className="order-1 md:order-2">
                  <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-2">{slide.title}</h2>
                  {slide.subtitle && (
                    <p className="text-base md:text-lg text-muted-foreground mb-4">{slide.subtitle}</p>
                  )}
                  {slide.text && (
                    <p className="text-sm md:text-base leading-relaxed text-foreground/90 whitespace-pre-line">{slide.text}</p>
                  )}

                  {slide.ctas && slide.ctas.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-3">
                      {slide.ctas.map((c, i) => (
                        <Button asChild key={i} variant={c.variant ?? "default"}>
                          <a href={c.href}>{c.label}</a>
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
