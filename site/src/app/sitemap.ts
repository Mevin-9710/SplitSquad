import { MetadataRoute } from "next";
import fs from "fs";
import path from "path";
import { getAllSlugs, getAllPosts } from "@/lib/mdx";

const baseUrl = "https://splitsquad.qzz.io";

function fileLastModified(relative: string): Date {
  try {
    const full = path.join(process.cwd(), "src", "app", relative);
    const stat = fs.statSync(full);
    return stat.mtime;
  } catch {
    return new Date();
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: fileLastModified("page.tsx"),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/features`,
      lastModified: fileLastModified("features/page.tsx"),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: fileLastModified("pricing/page.tsx"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: fileLastModified("about/page.tsx"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: fileLastModified("blog/page.tsx"),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: fileLastModified("privacy/page.tsx"),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: fileLastModified("terms/page.tsx"),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/splitwise-alternative`,
      lastModified: fileLastModified("splitwise-alternative/page.tsx"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/upi-expense-splitting`,
      lastModified: fileLastModified("upi-expense-splitting/page.tsx"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  const posts = getAllPosts();
  const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.frontmatter.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...blogRoutes];
}
