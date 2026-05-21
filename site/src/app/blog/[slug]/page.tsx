import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPost, getAllSlugs, getRelatedPosts } from "@/lib/mdx";
import { ScrollProgressBar } from "@/components/mdx/ScrollProgressBar";
import { BlogPostClient } from "./BlogPostClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  const { frontmatter } = post;
  const url = `https://splitsquad.qzz.io/blog/${slug}`;

  return {
    title: frontmatter.seoTitle,
    description: frontmatter.seoDescription,
    keywords: frontmatter.tags.join(", "),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: frontmatter.seoTitle,
      description: frontmatter.seoDescription,
      url,
      type: "article",
      publishedTime: frontmatter.date,
      tags: frontmatter.tags,
      siteName: "SplitSquad",
    },
    twitter: {
      card: "summary_large_image",
      title: frontmatter.seoTitle,
      description: frontmatter.seoDescription,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const { frontmatter, content } = post;
  const relatedPosts = getRelatedPosts(slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: frontmatter.seoTitle,
    description: frontmatter.seoDescription,
    author: {
      "@type": "Person",
      name: frontmatter.author,
    },
    datePublished: frontmatter.date,
    publisher: {
      "@type": "Organization",
      name: "SplitSquad",
      logo: {
        "@type": "ImageObject",
        url: "https://splitsquad.qzz.io/images/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://splitsquad.qzz.io/blog/${slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ScrollProgressBar />
      <BlogPostClient
        frontmatter={frontmatter}
        content={content}
        relatedPosts={relatedPosts}
        slug={slug}
      />
    </>
  );
}
