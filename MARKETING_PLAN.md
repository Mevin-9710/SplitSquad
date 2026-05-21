# SplitSquad Marketing Website — Complete Plan

## Overview

Build a world-class, animated marketing website for SplitSquad (UPI-first expense splitting platform, currently in BETA) using Next.js alongside the existing Express app. The marketing site becomes the root (`/`), and the Express app moves to `/app`.

**Design System**: Digital Brutalist — same as the existing app (`#f4bd31` primary, `#f9f9f9` surface, `#1a1c1c` borders, Pixelify Sans headlines, Space Mono labels, Inter body, hard shadows, sharp corners, grid background).

**Tech Stack**: Next.js 15 (App Router, TypeScript), Tailwind CSS, Framer Motion, Lenis (smooth scroll), Sanity CMS, Lucide icons.

---

## Phase 1: Landing Page (Current Phase)

### 1.1 Setup

| File | Purpose |
|------|---------|
| `site/tailwind.config.ts` | Brutalist design tokens (colors, fonts, shadows, animations) |
| `site/src/app/globals.css` | Global styles, grid bg, scrollbar, noise overlay, utilities |
| `site/src/app/layout.tsx` | Root layout, metadata, OpenGraph, fonts, Navbar, Footer |
| `site/src/app/providers.tsx` | Lenis smooth scroll provider |
| `site/src/app/lenis-provider.tsx` | Lenis initialization hook |

### 1.2 Shared Components

| Component | Purpose |
|-----------|---------|
| `Navbar.tsx` | Fixed top nav, logo, links, CTA, mobile menu with animations |
| `Footer.tsx` | Bottom footer with links, beta badge, social |
| `BetaBadge.tsx` | Animated "Currently in Beta" pill with pulse |
| `BrutalistButton.tsx` | Primary/secondary/ghost variants, hover/tap animations |
| `ScrollReveal.tsx` | Framer Motion scroll-triggered reveal wrapper |
| `AnimatedGrid.tsx` | Animated grid background pattern |
| `FloatingElements.tsx` | Abstract floating shapes for hero |
| `SectionHeading.tsx` | Animated section heading with label + title + subtitle |
| `FeatureCard.tsx` | Animated feature card with hover depth + bottom line reveal |
| `StepCard.tsx` | How-it-works step with number, icon, connecting line |

### 1.3 Landing Page Sections (`site/src/app/page.tsx`)

| Section | Description |
|---------|-------------|
| **Hero** | Massive animated headline reveal, floating abstract elements, animated grid bg, Beta badge, CTA buttons ("Start Splitting" → /app, "Learn More" → #features), subtitle |
| **Problem** | "Who paid?" chaos → organized flow. Animated conversational cards showing common pain points transforming into clean flows |
| **Features** | 6 animated feature cards: Smart Splits, UPI-first, Payment Verification, WhatsApp reminders, Real-time balances, PWA installable |
| **How It Works** | 3-step cinematic storytelling: Create split → Share payment links → Verify & settle. Scroll-triggered with connecting lines |
| **Beta / Early Access** | Exclusive community-driven section: "Free during beta", early access to features, help shape the platform |
| **Final CTA** | Emotion-driven ending: "Start your first split", magnetic button, animated background |

### 1.4 SEO (Landing Page)

- Dynamic metadata in `layout.tsx`
- OpenGraph tags (title, description, image)
- Twitter Card tags
- Canonical URL
- robots.txt (allow all)
- sitemap.xml (static for now)
- JSON-LD structured data (Organization + SoftwareApplication)

---

## Phase 2: Marketing Pages

### 2.1 Pricing Page (`/pricing`)

- Single "Early Bird" tier (no fake premium tiers)
- Free during beta
- Early access to upcoming features
- Help shape the platform
- Unlimited core usage during beta
- Beautifully designed, exclusive feel
- FAQ section
- CTA to launch app

### 2.2 About Page (`/about`)

- Story-driven, personal
- Why SplitSquad exists
- Frustration with messy settlements
- Fake payment confirmations
- WhatsApp chaos
- Simplifying group finances
- Team/creator section
- Timeline of the project
- CTA section

### 2.3 Features Page (`/features`)

- Detailed feature showcase
- Each feature gets its own section with animation
- Smart Splits (exact amounts, equal split, custom split)
- UPI-first flows (scan QR, auto-detect UPI)
- Payment Verification (public links, single-use codes)
- WhatsApp reminders (automated nudges)
- Real-time balances (who owes what)
- PWA installability (works offline, home screen)
- Contact management (save your squad)
- Comparison table (SplitSquad vs alternatives)

### 2.4 Splitwise Alternative Page (`/splitwise-alternative`)

- SEO-focused landing page
- "Splitwise alternative for India"
- Comparison table: SplitSquad vs Splitwise
- UPI-first advantage
- WhatsApp integration
- Payment verification
- No need for everyone to have the app
- Free during beta
- CTA to try

### 2.5 UPI Expense Splitting Page (`/upi-expense-splitting`)

- SEO-focused landing page
- "UPI expense splitting made simple"
- How UPI changes group payments
- Scan QR → auto-detect → split
- Payment verification flow
- Indian payment behavior focus
- CTA to try

---

## Phase 3: Sanity CMS + Blog

### 3.1 Sanity Setup

| File | Purpose |
|------|---------|
| `site/sanity/schemaTypes/post.ts` | Blog post schema (title, slug, body, cover image, categories, tags, author, publishedAt, seo) |
| `site/sanity/schemaTypes/category.ts` | Category schema |
| `site/sanity/schemaTypes/author.ts` | Author schema |
| `site/sanity/client.ts` | Sanity client configuration |
| `site/sanity/queries.ts` | GROQ queries for posts |
| `site/sanity/studio/**` | Embedded Sanity Studio at `/studio` |

### 3.2 Blog Index Page (`/blog`)

- Grid of blog posts
- Featured article (larger card)
- Filter by category
- Search functionality
- Pagination
- SEO metadata

### 3.3 Dynamic Blog Pages (`/blog/[slug]`)

- Full article rendering (Sanity portable text)
- Table of contents
- Reading time estimate
- Author info
- Related articles
- Share buttons
- SEO metadata (dynamic from Sanity)
- JSON-LD Article schema

### 3.4 Blog Content Strategy

Topics around:
- Splitwise alternatives
- Expense splitting for trips
- Roommate expense management
- UPI payment tracking
- Group settlements
- Indian payment behavior
- How to split bills fairly
- Best practices for group travel expenses

---

## Phase 4: Polish + Deploy

### 4.1 Express App Updates

- Add `/app` prefix to all web routes in `src/routes/web/index.js`
- Update all internal redirects to use `/app` prefix
- Keep `/api` routes as-is
- Update start/stop scripts

### 4.2 Nginx Configuration

```nginx
# Marketing site (Next.js on port 3001)
location / {
    proxy_pass http://localhost:3001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}

# Express app on /app prefix
location /app {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}

# Express API (keep existing)
location /api {
    proxy_pass http://localhost:3000;
    # ... existing proxy headers
}

# WhatsApp webhook (keep existing)
location /webhook {
    proxy_pass http://localhost:3000;
    # ... existing proxy headers
}
```

### 4.3 Animation Polish

- Page transition animations (Framer Motion AnimatePresence)
- Custom cursor (optional, desktop only)
- Magnetic buttons (follow cursor on hover)
- Scroll progress indicator
- Parallax effects on hero
- Text reveal animations (word-by-word)
- Stagger animations for lists
- Hover micro-interactions on all interactive elements
- Loading screen for Next.js transitions

### 4.4 Performance

- Image optimization (next/image)
- Font optimization (next/font — already done)
- Code splitting
- Lazy loading for below-fold sections
- Static generation for blog posts
- Incremental Static Regeneration (ISR) for blog
- Compress assets

### 4.5 Accessibility

- Proper heading hierarchy
- ARIA labels
- Keyboard navigation
- Focus states
- Color contrast (WCAG AA)
- Reduced motion support

### 4.6 Deploy

- Build Next.js app (`npm run build`)
- Start on port 3001
- Update Nginx config
- Restart Nginx
- Test all routes
- Verify Express app at `/app`
- Test API routes
- Verify blog (if Sanity is set up)

---

## File Structure (Final)

```
SplitSquad/
├── src/                          # Express app (unchanged, routes prefixed with /app)
├── views/                        # EJS templates (unchanged)
├── public/                       # Express static assets (unchanged)
├── site/                         # Next.js marketing site
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx          # Landing page
│   │   │   ├── globals.css
│   │   │   ├── providers.tsx
│   │   │   ├── lenis-provider.tsx
│   │   │   ├── pricing/
│   │   │   │   └── page.tsx
│   │   │   ├── about/
│   │   │   │   └── page.tsx
│   │   │   ├── features/
│   │   │   │   └── page.tsx
│   │   │   ├── splitwise-alternative/
│   │   │   │   └── page.tsx
│   │   │   ├── upi-expense-splitting/
│   │   │   │   └── page.tsx
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx       # Blog index
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx   # Dynamic blog post
│   │   │   ├── studio/
│   │   │   │   └── [[...tool]]/
│   │   │   │       └── page.tsx   # Sanity Studio
│   │   │   ├── sitemap.ts
│   │   │   ├── robots.ts
│   │   │   └── not-found.tsx
│   │   └── components/
│   │       ├── Navbar.tsx
│   │       ├── Footer.tsx
│   │       ├── BetaBadge.tsx
│   │       ├── BrutalistButton.tsx
│   │       ├── ScrollReveal.tsx
│   │       ├── AnimatedGrid.tsx
│   │       ├── FloatingElements.tsx
│   │       ├── SectionHeading.tsx
│   │       ├── FeatureCard.tsx
│   │       ├── StepCard.tsx
│   │       ├── Marquee.tsx
│   │       ├── MagneticButton.tsx
│   │       └── CustomCursor.tsx
│   ├── sanity/
│   │   ├── schemaTypes/
│   │   │   ├── post.ts
│   │   │   ├── category.ts
│   │   │   └── author.ts
│   │   ├── client.ts
│   │   ├── queries.ts
│   │   └── studio/
│   │       └── index.ts
│   ├── public/
│   │   └── images/
│   ├── tailwind.config.ts
│   ├── next.config.ts
│   └── package.json
├── .env
├── start.sh
├── stop.sh
└── nginx.conf (updated)
```

---

## Design Rules (Non-Negotiable)

1. **NO border-radius** — sharp corners everywhere
2. **3px solid #1a1c1c borders** on all cards/buttons
3. **4px 4px 0px #1a1c1c hard shadows** (brutalist-shadow)
4. **Active state**: translate(4px, 4px) + no shadow (mechanical press)
5. **Uppercase labels** in Space Mono
6. **Pixelify Sans** for headlines
7. **Inter** for body text
8. **Grid background** pattern (20px grid)
9. **Primary accent**: #f4bd31
10. **Background**: #f9f9f9
11. **Text**: #1a1c1c
12. **NO stock images** — use abstract UI elements, motion, CSS
13. **NO generic SaaS templates** — everything custom
14. **NO boring sections** — every section must have motion/interaction

---

## Animation Principles

1. **Scroll-triggered**: Elements reveal as user scrolls (useInView)
2. **Stagger**: Lists reveal one-by-one with delay
3. **Hover depth**: Cards lift on hover (y: -8, shadow increases)
4. **Magnetic**: Buttons follow cursor slightly on hover
5. **Parallax**: Hero elements move at different speeds
6. **Text reveal**: Words animate in sequentially
7. **Line drawing**: Connecting lines animate on scroll
8. **Glow**: Primary elements have subtle pulsing glow
9. **Marquee**: Infinite scrolling text for social proof
10. **Page transitions**: Smooth fade/slide between pages

---

## SEO Checklist

- [ ] Dynamic metadata on every page
- [ ] OpenGraph tags (title, description, image, url, type)
- [ ] Twitter Card tags (summary_large_image)
- [ ] Canonical URLs
- [ ] robots.txt (allow all, point to sitemap)
- [ ] sitemap.xml (dynamic, includes all pages + blog posts)
- [ ] JSON-LD structured data (Organization, SoftwareApplication, Article for blog)
- [ ] Semantic HTML (h1, h2, h3 hierarchy)
- [ ] Alt text on all images
- [ ] Fast LCP (< 2.5s)
- [ ] Mobile-friendly
- [ ] Accessible (WCAG AA)
