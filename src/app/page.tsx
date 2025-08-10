"use client";

import WebStoryNew from "@/components/story/WebStoryNew";
import { webStoryData } from "@/lib/data/webstory";

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <WebStoryNew data={webStoryData} />
    </main>
  );
}