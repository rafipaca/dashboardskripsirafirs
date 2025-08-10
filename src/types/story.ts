// Types for the WebStory feature

export type StorySectionType =
  | "introduction"
  | "methodology"
  | "key_findings"
  | "practical_application"
  | "conclusion"
  | "map";

export interface StorySection {
  type: StorySectionType;
  title: string;
  content?: string; // markdown-like content - optional for map type
  description?: string; // for map type
  defaultLayer?: string; // for map type
  layout?: string; // for key_findings type
  imageSrc?: string; // for key_findings type  
  imageAlt?: string; // for key_findings type
}

export interface WebStoryMetadata {
  title: string;
  author: string;
  nim: string;
  institution: string;
  program: string;
  specialization: string;
  academic_year: string;
  supervisor: string;
  short_bio: string;
}

export interface WebStoryAbstract {
  title: string;
  content: string; // markdown-like content
}

export interface WebStoryData {
  metadata: WebStoryMetadata;
  abstract: WebStoryAbstract;
  story_sections: StorySection[];
}
