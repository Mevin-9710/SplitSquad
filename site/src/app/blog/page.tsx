import { getAllPosts, getFeaturedPost } from "@/lib/mdx";
import { BlogPageClient } from "./BlogPageClient";

export default function BlogPage() {
  const allPosts = getAllPosts();
  const featured = getFeaturedPost();

  return <BlogPageClient allPosts={allPosts} featured={featured} />;
}
