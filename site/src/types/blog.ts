export interface BlogFrontmatter {
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  tags: string[];
  readingTime: number;
  coverColor?: string;
  coverPattern?: string;
  seoTitle: string;
  seoDescription: string;
  canonicalSlug?: string;
  featured?: boolean;
}

export interface BlogPost {
  frontmatter: BlogFrontmatter;
  content: string;
  slug: string;
}

export const BLOG_CATEGORIES = [
  "All",
  "Expense Splitting",
  "Group Travel",
  "Roommates & Rent",
  "College & Student Life",
  "Couple & Family Finances",
  "Productivity & Money Habits",
  "SplitSquad Updates",
  "Comparisons & Alternatives",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];
