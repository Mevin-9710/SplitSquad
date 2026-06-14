import fs from "fs";
import path from "path";
import { compileMDX } from "next-mdx-remote/rsc";
import { BlogFrontmatter, BlogPost, TOCHeading } from "@/types/blog";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { mdxComponents } from "../../mdx-components";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const WORDS_PER_MINUTE = 200;

function calculateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

function parseFrontmatter(fileContent: string): { frontmatter: BlogFrontmatter; content: string } {
  const match = fileContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error("Invalid MDX file: missing frontmatter");

  const frontmatterRaw = match[1];
  const content = match[2];

  const frontmatter: Record<string, unknown> = {};
  for (const line of frontmatterRaw.split("\n")) {
    const sepIndex = line.indexOf(":");
    if (sepIndex === -1) continue;
    const key = line.slice(0, sepIndex).trim();
    let rawValue: string = line.slice(sepIndex + 1).trim();

    let value: unknown = rawValue;

    if (value === "true") value = true;
    else if (value === "false") value = false;
    else if (rawValue.startsWith("[") && rawValue.endsWith("]")) {
      value = rawValue.slice(1, -1).split(",").map((s) => s.trim().replace(/"/g, ""));
    } else {
      value = rawValue.replace(/^["']|["']$/g, "");
    }

    frontmatter[key] = value;
  }

  const parsed = frontmatter as unknown as BlogFrontmatter;
  if (!parsed.readingTime || parsed.readingTime === 0) {
    parsed.readingTime = calculateReadingTime(content);
  }

  return {
    frontmatter: parsed,
    content,
  };
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  const slugs = getAllSlugs();
  return slugs
    .map((slug) => {
      const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
      const fileContent = fs.readFileSync(filePath, "utf8");
      const { frontmatter } = parseFrontmatter(fileContent);
      return { frontmatter, content: "", slug };
    })
    .sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime());
}

export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tags = new Set<string>();
  posts.forEach((p) => p.frontmatter.tags?.forEach((t) => tags.add(t)));
  return Array.from(tags).sort();
}

export function getPostsByTag(tag: string): BlogPost[] {
  return getAllPosts().filter((p) => p.frontmatter.tags?.includes(tag));
}

export function searchPosts(query: string): BlogPost[] {
  if (!query.trim()) return getAllPosts();
  const q = query.toLowerCase();
  return getAllPosts().filter((p) => {
    const fm = p.frontmatter;
    return (
      fm.title.toLowerCase().includes(q) ||
      fm.excerpt.toLowerCase().includes(q) ||
      fm.category.toLowerCase().includes(q) ||
      fm.tags?.some((t) => t.toLowerCase().includes(q)) ||
      fm.author.toLowerCase().includes(q)
    );
  });
}

export function getFeaturedPost(): BlogPost | null {
  const posts = getAllPosts();
  return posts.find((p) => p.frontmatter.featured) || posts[0] || null;
}

export function getRelatedPosts(currentSlug: string, limit = 3): BlogPost[] {
  const current = getPostSync(currentSlug);
  if (!current) return [];
  const all = getAllPosts().filter((p) => p.slug !== currentSlug);

  const sameCategory = all.filter((p) => p.frontmatter.category === current.frontmatter.category);
  const sameTags = all.filter(
    (p) => !sameCategory.includes(p) && p.frontmatter.tags?.some((t) => current.frontmatter.tags?.includes(t))
  );

  const related = [...sameCategory, ...sameTags, ...all];
  return related.slice(0, limit);
}

export function getPostSync(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const fileContent = fs.readFileSync(filePath, "utf8");
  const { frontmatter } = parseFrontmatter(fileContent);
  return { frontmatter, content: "", slug };
}

export function extractTOC(mdxContent: string): TOCHeading[] {
  const headings: TOCHeading[] = [];
  const regex = /^(#{2,3})\s+(.+)$/gm;
  let match;
  while ((match = regex.exec(mdxContent)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
    headings.push({ id, text, level });
  }
  return headings;
}

export async function getPost(slug: string): Promise<{ frontmatter: BlogFrontmatter; content: React.ReactElement; headings: TOCHeading[] } | null> {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, "utf8");
  const { frontmatter, content } = parseFrontmatter(fileContent);
  const headings = extractTOC(content);

  const { content: compiledContent } = await compileMDX({
    source: content,
    options: {
      mdxOptions: {
        rehypePlugins: [rehypeSlug],
        remarkPlugins: [remarkGfm],
      },
      parseFrontmatter: false,
    },
    components: mdxComponents,
  });

  return { frontmatter, content: compiledContent, headings };
}
