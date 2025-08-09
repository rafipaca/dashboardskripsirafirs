import WebStory from "@/components/story/WebStory";
import { webStoryData } from "@/lib/data/webstory";

export const metadata = {
  title: "Web Story | Dashboard Pneumonia",
};

export default function WebStoryPage() {
  return (
    <main className="min-h-screen">
      <WebStory data={webStoryData} />
    </main>
  );
}
