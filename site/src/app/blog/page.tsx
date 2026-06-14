import { getAllPosts, getFeaturedPost } from "@/lib/mdx";
import { BlogPageClient } from "./BlogPageClient";

interface Props {
  searchParams?: Promise<{ tag?: string; q?: string }>;
}

export default async function BlogPage({ searchParams }: Props) {
  const allPosts = getAllPosts();
  const featured = getFeaturedPost();

  let initialSearch = "";
  if (searchParams) {
    const params = await searchParams;
    initialSearch = params?.tag || params?.q || "";
  }

  return <BlogPageClient allPosts={allPosts} featured={featured} initialSearch={initialSearch} />;
}
