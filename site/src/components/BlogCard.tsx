"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BlogPost } from "@/types/blog";

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

const patterns = [
  "radial-gradient(circle at 30% 40%, #f4bd31 0%, transparent 60%)",
  "linear-gradient(135deg, #f4bd31 0%, #785a00 100%)",
  "conic-gradient(from 45deg, #f4bd31, #785a00, #f4bd31)",
  "repeating-linear-gradient(45deg, #f4bd31 0px, #f4bd31 2px, transparent 2px, transparent 8px)",
];

export function BlogCard({ post, featured = false }: BlogCardProps) {
  const { frontmatter } = post;
  const patternIndex = post.slug.length % patterns.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4 }}
    >
      <Link href={`/blog/${post.slug}`} className="block h-full">
        <article className={`h-full bg-surface-container-lowest border-3 border-on-surface shadow-brutalist hover:shadow-brutalist-lg transition-all duration-300 ${featured ? "flex flex-col md:flex-row" : ""}`} style={{ borderWidth: 3, borderColor: "#1a1c1c" }}>
          <div
            className={`${featured ? "md:w-2/5" : "w-full"} aspect-[16/9] border-b-3 border-on-surface relative overflow-hidden`}
            style={{ borderBottomWidth: 3, borderColor: "#1a1c1c", background: patterns[patternIndex] }}
          >
            <div className="absolute inset-0" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.05'%3E%3Cpath d='M0 0h20v20H0z'/%3E%3C/g%3E%3C/svg%3E")` }} />
            <div className="absolute inset-0 grid-bg opacity-20" />
            {featured && (
              <div className="absolute top-2 left-2 bg-primary-container border-2 border-on-surface px-2 py-1 font-mono text-[10px] uppercase shadow-brutalist-sm" style={{ borderWidth: 2, borderColor: "#1a1c1c" }}>
                Featured
              </div>
            )}
          </div>
          <div className={`p-5 flex flex-col justify-between flex-1 ${featured ? "md:p-8" : ""}`}>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="font-mono text-[10px] uppercase px-2 py-1 bg-primary-container/20 border border-primary-container text-on-surface">
                  {frontmatter.category}
                </span>
                <span className="font-mono text-[10px] uppercase text-on-surface-variant">
                  {frontmatter.readingTime} min read
                </span>
              </div>
              <h3 className={`font-headline uppercase tracking-tight text-on-surface ${
                featured ? "text-headline-md md:text-3xl" : "text-headline-md"
              }`}>
                {frontmatter.title}
              </h3>
              <p className={`font-body text-on-surface-variant mt-2 leading-relaxed ${
                featured ? "text-body-lg" : "text-body-md"
              }`}>
                {frontmatter.excerpt}
              </p>
            </div>
            <div className="flex items-center justify-between mt-4 pt-3 border-t-2 border-on-surface/10" style={{ borderTopWidth: 2 }}>
              <span className="font-mono text-xs uppercase text-on-surface-variant">
                {new Date(frontmatter.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>
              <span className="font-mono text-xs uppercase text-on-surface-variant group-hover:text-primary-container transition-colors">
                Read →
              </span>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
