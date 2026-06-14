import { MDXComponents } from "mdx/types";
import { ReactNode, ThHTMLAttributes, TdHTMLAttributes } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatedCounter } from "@/components/mdx/AnimatedCounter";
import { InteractiveComparison } from "@/components/mdx/InteractiveComparison";
import { AnimatedStatCard } from "@/components/mdx/AnimatedStatCard";
import { FlowDiagram } from "@/components/mdx/FlowDiagram";
import { MiniCalculator } from "@/components/mdx/MiniCalculator";
import { HighlightBox } from "@/components/mdx/HighlightBox";
import { HoverRevealCard } from "@/components/mdx/HoverRevealCard";
import { BlogFAQ } from "@/components/mdx/BlogFAQ";
import { CodeBlock } from "@/components/mdx/CodeBlock";
import { SideHustleCalculator } from "@/components/mdx/SideHustleCalculator";
import { PortfolioCareerQuiz } from "@/components/mdx/PortfolioCareerQuiz";
import { RentSplitCalculator } from "@/components/mdx/RentSplitCalculator";
import { ExpenseSplitSimulator } from "@/components/mdx/ExpenseSplitSimulator";
import { SalaryGapCalculator } from "@/components/mdx/SalaryGapCalculator";
import { SkillDemandChecker } from "@/components/mdx/SkillDemandChecker";
import { SocialHealthScore } from "@/components/mdx/SocialHealthScore";
import { ReconnectChallenge } from "@/components/mdx/ReconnectChallenge";
import { StudentBudgetTool } from "@/components/mdx/StudentBudgetTool";
import { MessExpenseSplitter } from "@/components/mdx/MessExpenseSplitter";
import { ComparisonTimeCalculator } from "@/components/mdx/ComparisonTimeCalculator";
import { WhoseLifeQuiz } from "@/components/mdx/WhoseLifeQuiz";
import { LinkIcon } from "lucide-react";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

function H2({ children, id, ...props }: { children?: ReactNode; id?: string }) {
  const slug = id || (typeof children === "string" ? slugify(children) : "");
  return (
    <h2
      id={slug}
      className="font-headline text-3xl md:text-4xl uppercase tracking-tighter leading-tight mt-16 mb-6 text-on-surface border-b-2 border-on-surface/10 pb-3 group"
    >
      <Link href={`#${slug}`} className="inline-flex items-center gap-2 group">
        {children}
        <span className="opacity-0 group-hover:opacity-100 transition-opacity">
          <LinkIcon className="w-5 h-5 text-primary-container" />
        </span>
      </Link>
    </h2>
  );
}

function H3({ children, id, ...props }: { children?: ReactNode; id?: string }) {
  const slug = id || (typeof children === "string" ? slugify(children) : "");
  return (
    <h3
      id={slug}
      className="font-headline text-2xl md:text-3xl uppercase tracking-tight leading-tight mt-12 mb-4 text-on-surface group"
    >
      <Link href={`#${slug}`} className="inline-flex items-center gap-2 group">
        {children}
        <span className="opacity-0 group-hover:opacity-100 transition-opacity">
          <LinkIcon className="w-4 h-4 text-primary-container" />
        </span>
      </Link>
    </h3>
  );
}

function P({ children, ...props }: { children?: ReactNode }) {
  return (
    <p className="font-body text-body-lg text-on-surface-variant leading-relaxed mb-6" {...props}>
      {children}
    </p>
  );
}

function Ul({ children, ...props }: { children?: ReactNode }) {
  return <ul className="space-y-3 mb-6 font-body text-body-lg text-on-surface-variant" {...props}>{children}</ul>;
}

function Ol({ children, ...props }: { children?: ReactNode }) {
  return <ol className="space-y-3 mb-6 font-body text-body-lg text-on-surface-variant list-decimal pl-6" {...props}>{children}</ol>;
}

function Li({ children, ...props }: { children?: ReactNode }) {
  return (
    <li className="flex items-start gap-3 before:content-[''] before:block before:w-2 before:h-2 before:bg-primary-container before:mt-2.5 before:flex-shrink-0" {...props}>
      <span>{children}</span>
    </li>
  );
}

function Blockquote({ children, ...props }: { children?: ReactNode }) {
  return (
    <blockquote
      className="border-l-3 border-primary-container pl-6 py-4 my-8 font-body text-body-lg italic text-on-surface bg-primary-container/5"
      style={{ borderLeftWidth: 3, borderColor: "#f4bd31" }}
      {...props}
    >
      {children}
    </blockquote>
  );
}

function Strong({ children, ...props }: { children?: ReactNode }) {
  return <strong className="font-bold text-on-surface" {...props}>{children}</strong>;
}

function A({ children, href, ...props }: { children?: ReactNode; href?: string }) {
  return (
    <a
      href={href}
      className="font-bold text-on-surface underline decoration-primary-container/50 hover:decoration-primary-container underline-offset-2 transition-colors"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      {...props}
    >
      {children}
    </a>
  );
}

function Hr() {
  return <hr className="border-t-3 border-on-surface/10 my-12" style={{ borderTopWidth: 3 }} />;
}

function Code({ children, ...props }: { children?: ReactNode }) {
  return (
    <code
      className="font-mono text-sm bg-on-surface/5 border border-on-surface/20 px-1.5 py-0.5 text-on-surface"
      {...props}
    >
      {children}
    </code>
  );
}

function Table({ children, ...props }: { children?: ReactNode }) {
  return (
    <div className="overflow-x-auto mb-8 border-3 border-on-surface shadow-brutalist" style={{ borderWidth: 3, borderColor: "#1a1c1c" }}>
      <table className="w-full border-collapse font-body text-body-md" {...props}>
        {children}
      </table>
    </div>
  );
}

function Thead({ children, ...props }: { children?: ReactNode }) {
  return (
    <thead className="bg-primary-container/20 border-b-3 border-on-surface" style={{ borderBottomWidth: 3, borderColor: "#1a1c1c" }}>
      {children}
    </thead>
  );
}

function Th({ children, ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th className="font-headline text-sm uppercase tracking-tight text-left px-4 py-3 text-on-surface" {...props}>
      {children}
    </th>
  );
}

function Td({ children, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className="px-4 py-3 text-on-surface-variant border-b border-on-surface/10" {...props}>
      {children}
    </td>
  );
}

function Img({ src, alt, title }: { src?: string; alt?: string; title?: string }) {
  if (!src) return null;
  return (
    <figure className="my-8 border-3 border-on-surface shadow-brutalist overflow-hidden" style={{ borderWidth: 3, borderColor: "#1a1c1c" }}>
      <Image
        src={src}
        alt={alt || ""}
        width={1200}
        height={675}
        className="w-full object-cover"
      />
      {title && (
        <figcaption className="font-mono text-[10px] uppercase text-center text-on-surface-variant py-2 px-4 bg-surface-container border-t-2 border-on-surface/10">
          {title}
        </figcaption>
      )}
    </figure>
  );
}

function Pre({ children, ...props }: { children?: ReactNode }) {
  return (
    <CodeBlock>
      <pre
        className="bg-on-surface text-surface p-6 border-3 border-on-surface shadow-brutalist overflow-x-auto mb-8 font-mono text-sm leading-relaxed"
        style={{ borderWidth: 3, borderColor: "#1a1c1c" }}
        {...props}
      >
        {children}
      </pre>
    </CodeBlock>
  );
}

export const mdxComponents: MDXComponents = {
  h2: H2,
  h3: H3,
  p: P,
  ul: Ul,
  ol: Ol,
  li: Li,
  blockquote: Blockquote,
  strong: Strong,
  a: A,
  hr: Hr,
  code: Code,
  pre: Pre,
  table: Table,
  thead: Thead,
  th: Th,
  td: Td,
  img: Img,
  AnimatedCounter,
  InteractiveComparison,
  AnimatedStatCard,
  FlowDiagram,
  MiniCalculator,
  HighlightBox,
  HoverRevealCard,
  BlogFAQ,
  SideHustleCalculator,
  PortfolioCareerQuiz,
  RentSplitCalculator,
  ExpenseSplitSimulator,
  SalaryGapCalculator,
  SkillDemandChecker,
  SocialHealthScore,
  ReconnectChallenge,
  StudentBudgetTool,
  MessExpenseSplitter,
  ComparisonTimeCalculator,
  WhoseLifeQuiz,
};
