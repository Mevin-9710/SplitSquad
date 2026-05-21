"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "@/components/SectionHeading";
import { BlogCard } from "@/components/BlogCard";
import { CategoryPills } from "@/components/CategoryPills";
import { ScrollReveal } from "@/components/ScrollReveal";
import { BrutalistButton } from "@/components/BrutalistButton";
import { AnimatedGrid } from "@/components/AnimatedGrid";
import { ArrowRight } from "lucide-react";
import { BlogPost } from "@/types/blog";

const ITEMS_PER_PAGE = 6;

interface BlogPageClientProps {
  allPosts: BlogPost[];
  featured: BlogPost | null;
}

export function BlogPageClient({ allPosts, featured }: BlogPageClientProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const filteredPosts = useMemo(() => {
    if (activeCategory === "All") return allPosts;
    return allPosts.filter((p) => p.frontmatter.category === activeCategory);
  }, [allPosts, activeCategory]);

  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPosts.length;
  const nonFeatured = featured
    ? visiblePosts.filter((p) => p.slug !== featured.slug)
    : visiblePosts;

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  return (
    <div>
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <AnimatedGrid />
        <div className="relative max-w-4xl mx-auto px-4 md:px-8 text-center">
          <SectionHeading
            label="SplitSquad Blog"
            title="Insights for your squad."
            subtitle="Guides, comparisons, and updates on splitting expenses the smart way."
          />
        </div>
      </section>

      <section className="py-8 md:py-12 bg-surface-container-lowest border-y-3 border-on-surface" style={{ borderTopWidth: 3, borderBottomWidth: 3, borderColor: "#1a1c1c" }}>
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="mb-8">
            <CategoryPills active={activeCategory} onSelect={handleCategoryChange} />
          </div>

          {featured && activeCategory === "All" && (
            <div className="mb-10">
              <BlogCard post={featured} featured />
            </div>
          )}

          {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-body text-body-lg text-on-surface-variant mb-4">No posts in this category yet.</p>
              <p className="font-mono text-xs uppercase text-on-surface-variant">Check back soon!</p>
            </div>
          ) : (
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {nonFeatured.map((post) => (
                    <BlogCard key={post.slug} post={post} />
                  ))}
                </motion.div>
              </AnimatePresence>

              {hasMore && (
                <div className="text-center mt-10">
                  <BrutalistButton
                    variant="secondary"
                    size="md"
                    onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
                  >
                    Load More Posts
                  </BrutalistButton>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <section className="py-20 md:py-28 text-center">
        <div className="max-w-2xl mx-auto px-4 md:px-8">
          <ScrollReveal direction="up">
            <h2 className="font-headline text-headline-xl-mobile md:text-headline-xl tracking-tighter uppercase leading-tight mb-4">
              Ready to simplify group expenses?
            </h2>
            <p className="font-body text-body-lg text-on-surface-variant mb-8">
              Start splitting with your squad in under 30 seconds.
            </p>
            <BrutalistButton variant="primary" size="lg" href="/app" icon={<ArrowRight className="w-5 h-5" />}>
              Try SplitSquad Free
            </BrutalistButton>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
