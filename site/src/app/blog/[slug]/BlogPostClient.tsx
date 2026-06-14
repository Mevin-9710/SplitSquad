"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ReactElement } from "react";
import { BlogFrontmatter, BlogPost, TOCHeading } from "@/types/blog";
import { BlogCard } from "@/components/BlogCard";
import { BrutalistButton } from "@/components/BrutalistButton";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { SocialShare } from "@/components/blog/SocialShare";
import { NewsletterSignup } from "@/components/blog/NewsletterSignup";
import { ArrowLeft, ArrowRight, Calendar, Clock } from "lucide-react";

interface BlogPostClientProps {
  frontmatter: BlogFrontmatter;
  content: ReactElement;
  relatedPosts: BlogPost[];
  slug: string;
  headings: TOCHeading[];
}

export function BlogPostClient({ frontmatter, content, relatedPosts, slug, headings }: BlogPostClientProps) {
  const postUrl = `https://splitsquad.qzz.io/blog/${slug}`;

  const formattedDate = new Date(frontmatter.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article className="pt-20 pb-16 md:pt-28 md:pb-24">
      <div className="max-w-3xl mx-auto px-4 md:px-8">
        <nav className="flex items-center gap-2 font-mono text-xs uppercase text-on-surface-variant mb-8">
          <Link href="/" className="hover:text-on-surface transition-colors">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-on-surface transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-on-surface truncate max-w-[200px]">{frontmatter.title}</span>
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="font-mono text-[10px] uppercase px-2 py-1 bg-primary-container/20 border border-primary-container">
              {frontmatter.category}
            </span>
            <span className="flex items-center gap-1 font-mono text-xs uppercase text-on-surface-variant">
              <Calendar className="w-3 h-3" />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1 font-mono text-xs uppercase text-on-surface-variant">
              <Clock className="w-3 h-3" />
              {frontmatter.readingTime} min read
            </span>
          </div>

          <h1 className="font-headline text-headline-xl-mobile md:text-headline-xl lg:text-[56px] tracking-tighter uppercase leading-tight mb-4 text-on-surface">
            {frontmatter.title}
          </h1>

          <div className="flex items-center justify-between gap-3 mb-8 pb-8 border-b-2 border-on-surface/10" style={{ borderBottomWidth: 2 }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-container border-2 border-on-surface flex items-center justify-center font-headline text-sm font-bold" style={{ borderWidth: 2, borderColor: "#1a1c1c" }}>
                {frontmatter.author.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <p className="font-headline text-sm uppercase tracking-tight">{frontmatter.author}</p>
                <p className="font-mono text-[10px] uppercase text-on-surface-variant">Founder & Creator</p>
              </div>
            </div>
            <SocialShare title={frontmatter.title} url={postUrl} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="prose-custom"
        >
          {content}
        </motion.div>

        {frontmatter.tags && frontmatter.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t-2 border-on-surface/10" style={{ borderTopWidth: 2 }}>
            {frontmatter.tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog?tag=${tag}`}
                className="px-3 py-1 font-mono text-[10px] uppercase border-2 border-on-surface/40 text-on-surface-variant hover:border-on-surface hover:text-on-surface hover:shadow-brutalist-sm transition-all"
                style={{ borderWidth: 2, borderColor: "#1a1c1c" }}
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        <NewsletterSignup />

        <div className="mt-12 pt-8 border-t-3 border-on-surface text-center" style={{ borderTopWidth: 3, borderColor: "#1a1c1c" }}>
          <h3 className="font-headline text-headline-md uppercase tracking-tight mb-4">
            Start splitting with your squad
          </h3>
          <BrutalistButton variant="primary" size="lg" href="/app" icon={<ArrowRight className="w-5 h-5" />}>
            Try SplitSquad Free
          </BrutalistButton>
        </div>
      </div>

      {relatedPosts.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 md:px-8 mt-20">
          <h2 className="font-headline text-headline-md uppercase tracking-tight mb-8 text-center">
            Related Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      )}

      <TableOfContents headings={headings} />
    </article>
  );
}
