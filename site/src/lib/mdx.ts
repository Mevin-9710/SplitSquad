import fs from "fs";
import path from "path";
import { compileMDX } from "next-mdx-remote/rsc";
import { BlogFrontmatter, BlogPost } from "@/types/blog";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { mdxComponents } from "../../mdx-components";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

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

  return {
    frontmatter: frontmatter as unknown as BlogFrontmatter,
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

export function getPostsByCategory(category: string): BlogPost[] {
  if (category === "All") return getAllPosts();
  return getAllPosts().filter((p) => p.frontmatter.category === category);
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
  const related = sameCategory.length >= limit ? sameCategory : all;
  return related.slice(0, limit);
}

export function getPostSync(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const fileContent = fs.readFileSync(filePath, "utf8");
  const { frontmatter } = parseFrontmatter(fileContent);
  return { frontmatter, content: "", slug };
}

export async function getPost(slug: string): Promise<{ frontmatter: BlogFrontmatter; content: React.ReactElement } | null> {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, "utf8");
  const { frontmatter, content } = parseFrontmatter(fileContent);

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

  return { frontmatter, content: compiledContent };
}
