export type ContentBlockType = "h2" | "h3" | "p" | "quote" | "image";

export interface ContentBlock {
  id: string;
  type: ContentBlockType;
  text: string;
  imageUrl?: string;
  imageCaption?: string;
  /** 인포그래피 등: 잘리지 않게 contain + 좁은 최대 너비 */
  imageContain?: boolean;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  date: string;
  publishedTime: string;
  readTime: string;
  author: string;
  imageUrl?: string;
  content: ContentBlock[];
  tags: string[];
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
}

export type ArticleInput = Omit<Article, "id" | "createdAt" | "updatedAt">;
export type ArticleUpdate = Partial<ArticleInput>;
