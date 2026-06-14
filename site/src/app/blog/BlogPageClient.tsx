"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "@/components/SectionHeading";
import { BlogCard } from "@/components/BlogCard";
import { CategoryPills } from "@/components/CategoryPills";
import { ScrollReveal } from "@/components/ScrollReveal";
import { BrutalistButton } from "@/components/BrutalistButton";
import { AnimatedGrid } from "@/components/AnimatedGrid";
import { Search, ArrowRight, X, ArrowUpDown } from "lucide-react";
import { BlogPost } from "@/types/blog";

const ITEMS_PER_PAGE = 6;

interface BlogPageClientProps {
  allPosts: BlogPost[];
  featured: BlogPost | null;
  initialSearch?: string;
}

type SortOption = "newest" | "oldest";

export function BlogPageClient({ allPosts, featured, initialSearch = "" }: BlogPageClientProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [showSortMenu, setShowSortMenu] = useState(false);

  const filteredPosts = useMemo(() => {
    let posts = allPosts;

    if (activeCategory !== "All") {
      posts = posts.filter((p) => p.frontmatter.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      posts = posts.filter((p) => {
        const fm = p.frontmatter;
        return (
          fm.title.toLowerCase().includes(q) ||
          fm.excerpt.toLowerCase().includes(q) ||
          fm.category.toLowerCase().includes(q) ||
          fm.tags?.some((t) => t.toLowerCase().includes(q))
        );
      });
    }

    posts = [...posts].sort((a, b) => {
      const dateA = new Date(a.frontmatter.date).getTime();
      const dateB = new Date(b.frontmatter.date).getTime();
      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });

    return posts;
  }, [allPosts, activeCategory, searchQuery, sortBy]);

  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPosts.length;
  const totalCount = filteredPosts.length;

  const nonFeatured = featured && activeCategory === "All" && !searchQuery
    ? visiblePosts.filter((p) => p.slug !== featured.slug)
    : visiblePosts;

  const categories = useMemo(() => {
    const cats = ["All", ...new Set(allPosts.map((p) => p.frontmatter.category))];
    return cats;
  }, [allPosts]);

  const showFeatured = featured && activeCategory === "All" && !searchQuery;

  const handleCategoryChange = useCallback((cat: string) => {
    setActiveCategory(cat);
    setVisibleCount(ITEMS_PER_PAGE);
  }, []);

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

      <section
        className="py-8 md:py-12 bg-surface-container-lowest border-y-3 border-on-surface"
        style={{ borderTopWidth: 3, borderBottomWidth: 3, borderColor: "#1a1c1c" }}
      >
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <CategoryPills active={activeCategory} onSelect={handleCategoryChange} categories={categories} />

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setVisibleCount(ITEMS_PER_PAGE);
                  }}
                  placeholder="Search posts..."
                  className="w-full sm:w-48 pl-9 pr-8 py-2 font-mono text-xs uppercase border-2 border-on-surface/40 bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-on-surface focus:shadow-brutalist-sm transition-all"
                  style={{ borderWidth: 2, borderColor: "#1a1c1c" }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                  >
                    <X className="w-3 h-3 text-on-surface-variant" />
                  </button>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowSortMenu(!showSortMenu)}
                  className="flex items-center gap-1.5 px-3 py-2 font-mono text-xs uppercase border-2 border-on-surface/40 hover:border-on-surface hover:shadow-brutalist-sm transition-all"
                  style={{ borderWidth: 2, borderColor: "#1a1c1c" }}
                >
                  <ArrowUpDown className="w-3 h-3" />
                  {sortBy}
                </button>
                {showSortMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowSortMenu(false)} />
                    <div className="absolute right-0 top-full mt-1 z-20 bg-surface-container-lowest border-3 border-on-surface shadow-brutalist min-w-[140px]" style={{ borderWidth: 3, borderColor: "#1a1c1c" }}>
                      {(["newest", "oldest"] as const).map((option) => (
                        <button
                          key={option}
                          onClick={() => {
                            setSortBy(option);
                            setShowSortMenu(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 font-mono text-xs uppercase transition-colors ${
                            sortBy === option
                              ? "bg-primary-container text-on-surface"
                              : "text-on-surface-variant hover:bg-on-surface/5 hover:text-on-surface"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <p className="font-mono text-xs uppercase text-on-surface-variant">
              {totalCount} {totalCount === 1 ? "post" : "posts"}
              {searchQuery && <> found for &ldquo;{searchQuery}&rdquo;</>}
            </p>
          </div>

          {showFeatured && (
            <div className="mb-10">
              <BlogCard post={featured} featured />
            </div>
          )}

          {filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-container/20 border-2 border-on-surface/20 mb-6" style={{ borderWidth: 2, borderColor: "#1a1c1c" }}>
                <Search className="w-6 h-6 text-on-surface-variant" />
              </div>
              <p className="font-headline text-headline-md uppercase tracking-tight text-on-surface mb-2">
                {searchQuery ? "No results found" : "No posts yet"}
              </p>
              <p className="font-body text-body-md text-on-surface-variant mb-6 max-w-md mx-auto">
                {searchQuery
                  ? `We couldn't find any posts matching "${searchQuery}". Try different keywords or browse categories.`
                  : `We haven't published any posts in "${activeCategory}" yet. Check back soon!`}
              </p>
              {searchQuery && (
                <BrutalistButton
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("All");
                  }}
                >
                  Clear filters
                </BrutalistButton>
              )}
            </div>
          ) : (
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeCategory}-${searchQuery}-${sortBy}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {nonFeatured.map((post, i) => (
                    <motion.div
                      key={post.slug}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                    >
                      <BlogCard post={post} />
                    </motion.div>
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
