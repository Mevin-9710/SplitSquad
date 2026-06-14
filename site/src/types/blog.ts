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
  coverImage?: string;
  seoTitle: string;
  seoDescription: string;
  canonicalSlug?: string;
  featured?: boolean;
  updatedDate?: string;
}

export interface BlogPost {
  frontmatter: BlogFrontmatter;
  content: string;
  slug: string;
}

export interface TOCHeading {
  id: string;
  text: string;
  level: number;
}


