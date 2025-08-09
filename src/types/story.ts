// Types for the WebStory feature

export type StorySectionType =
  | "introduction"
  | "methodology"
  | "key_findings"
  | "practical_application"
  | "conclusion";

export interface StorySection {
  type: StorySectionType;
  title: string;
  content: string; // markdown-like content
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
