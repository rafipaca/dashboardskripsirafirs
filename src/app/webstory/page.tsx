import WebStoryNew from "@/components/story/WebStoryNew";
import { webStoryData } from "@/lib/data/webstory";

export const metadata = {
  title: "Web Story | Dashboard Pneumonia",
};

export default function WebStoryPage() {
  return (
    <main className="min-h-screen">
      <WebStoryNew data={webStoryData} />
    </main>
  );
}
