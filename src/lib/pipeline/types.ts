export interface Topic {
  id: string;
  keyword: string;
  description: string;
  category: string;
  used: boolean;
}

export interface PlanResult {
  title: string;
  seoKeyword: string;
  subKeywords: string[];
  category: string;
  slug: string;
  structure: string[];
  searchIntent: string;
  targetQuestion: string;
}

export interface ArticleDraft {
  title: string;
  subtitle: string;
  description: string;
  slug: string;
  readTime: string;
  tags: string[];
  content: Array<{ type: string; text: string }>;
}
