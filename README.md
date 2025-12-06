# The Hobbinomicon

A beautiful, performant personal portfolio and blog built with Astro 5, featuring an illuminated manuscript aesthetic for blog posts and full-screen hero sections for stunning visual impact.

**Live site:** [hobbinomicon.com](https://hobbinomicon.com)

## Features

### Content & Navigation
- **Full-screen hero sections** with image overlays on homepage
- **Illuminated manuscript styling** for blog posts (cream background, rich black typography)
- **Content Collections** for type-safe blog posts with frontmatter validation
- **Categories & Tags** for organized content browsing
- **Project collections** with series navigation (previous/next posts)
- **Related posts** automatically generated based on shared tags
- **Paginated blog index** for browsing large content archives
- **Client-side search** with keyboard shortcut (Cmd/Ctrl+K)

### User Experience
- **Dark mode** with system preference detection and toggle (dark by default)
- **View Transitions** for smooth, SPA-like navigation
- **Back to top button** for easy navigation on long posts
- **Skip links** for keyboard/screen reader accessibility
- **Reading time estimates** displayed on posts
- **Print stylesheet** for clean printed articles

### Comments System
- **Self-hosted comments** using Cloudflare Workers + D1 database
- **Rate limiting** (5 comments per IP per hour)
- **Honeypot spam protection** to catch bots
- **XSS sanitization** for secure content
- **Privacy-preserving** IP hashing
- **Moderation queue** - comments require approval by default

### SEO & Performance
- **Structured data (JSON-LD)** for blog posts and breadcrumbs
- **OpenGraph and Twitter Card** meta tags
- **Sitemap** auto-generated
- **Responsive images** with lazy loading
- **Optimized fonts** with proper fallbacks
- **Tailwind CSS tree-shaking** eliminates unused styles

### Rich Media
- **YouTube embeds** with privacy-enhanced mode
- **Image galleries** with lightbox support
- **Video transcripts** collapsible component
- **YouTube thumbnail fallbacks** for hero images

## Tech Stack

- [Astro 5](https://astro.build) - Web framework
- [Tailwind CSS 3](https://tailwindcss.com) - Styling
- TypeScript - Type safety
- Content Collections - Type-safe content management
- [Cloudflare Workers](https://workers.cloudflare.com) - Comments API
- [Cloudflare D1](https://developers.cloudflare.com/d1/) - SQLite database for comments
- [Netlify](https://netlify.com) - Hosting

## Project Structure

```
/
├── public/
│   └── images/              # Static images
├── src/
│   ├── components/          # Reusable components
│   │   ├── Header.astro     # Navigation with dark mode toggle
│   │   ├── Footer.astro
│   │   ├── HeroSection.astro
│   │   ├── PostCard.astro
│   │   ├── Search.astro     # Client-side search modal
│   │   ├── Comments.astro   # Comment form and display
│   │   ├── BackToTop.astro
│   │   ├── YouTubeEmbed.astro
│   │   ├── ImageGallery.astro
│   │   └── VideoTranscript.astro
│   ├── content/
│   │   ├── config.ts        # Content collections schema
│   │   ├── blog/            # Blog posts (Markdown/MDX)
│   │   └── projects/        # Project collections
│   ├── layouts/
│   │   ├── BaseLayout.astro # Dark mode, meta tags, structured data
│   │   └── BlogLayout.astro # Post layout with comments
│   ├── pages/
│   │   ├── index.astro      # Homepage
│   │   ├── 404.astro        # Custom 404 page
│   │   ├── blog/
│   │   │   ├── index.astro  # Paginated blog index
│   │   │   └── [...slug].astro
│   │   ├── categories/
│   │   │   ├── index.astro
│   │   │   └── [category].astro
│   │   └── tags/
│   │       └── [tag].astro
│   └── styles/
│       └── print.css        # Print stylesheet
├── comments-api/            # Cloudflare Worker for comments
│   ├── src/index.ts         # API endpoints
│   ├── schema.sql           # D1 database schema
│   ├── wrangler.toml        # Worker configuration
│   └── README.md            # Setup instructions
├── astro.config.mjs
├── tailwind.config.mjs
├── netlify.toml             # Netlify deployment config
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:4321](http://localhost:4321) in your browser

## Commands

| Command | Action |
| :--- | :--- |
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server at `localhost:4321` |
| `npm run build` | Build production site to `./dist/` |
| `npm run preview` | Preview production build locally |
| `npm run sync-vlogs` | Sync new videos from YouTube channel and create blog posts |
| `npm run download-heroes` | Download YouTube thumbnails for hero images |

### Adding New YouTube Content

When you publish a new video to your YouTube channel, run the following to sync it to your blog:

```bash
npm run sync-vlogs           # Pulls new videos and creates blog posts
npm run build                # Downloads thumbnails (via prebuild) and builds site
git add src/content/blog/ src/assets/hero-cache/
git commit -m "Add new video post + hero image"
git push
```

**What each script does:**

`npm run sync-vlogs`:
- Connects to YouTube API via Google Cloud
- Fetches new videos from your channel
- Creates blog post files with video metadata (title, description, youtubeId)

`npm run build`:
- Automatically runs `download-hero-images.js` first (via `prebuild` hook)
- Downloads maxres thumbnails to `src/assets/hero-cache/`
- Skips already-cached images
- Then builds the Astro site with optimized WebP images

`npm run download-heroes` (optional):
- Run manually if you want to download thumbnails without a full build
- Useful during development to cache images before committing

## Creating Content

### Adding a Blog Post

Create a new `.md` file in `src/content/blog/`:

```markdown
---
title: "Your Post Title"
description: "A brief description of your post"
pubDate: 2024-01-20
heroImage: "/images/your-image.jpg"
heroImageAlt: "Description of the image"
category: "Your Category"
tags: ["tag1", "tag2"]
featured: false
youtubeId: "optional-youtube-id"
---

Your content here...
```

### Using Media Components

**YouTube Embed:**
```astro
import YouTubeEmbed from '../../components/YouTubeEmbed.astro';

<YouTubeEmbed videoId="dQw4w9WgXcQ" title="Video Title" />
```

**Image Gallery:**
```astro
import ImageGallery from '../../components/ImageGallery.astro';

<ImageGallery
  images={[
    { src: '/images/1.jpg', alt: 'Description', caption: 'Optional caption' },
    { src: '/images/2.jpg', alt: 'Description' }
  ]}
  columns={2}
/>
```

**Video Transcript:**
```astro
import VideoTranscript from '../../components/VideoTranscript.astro';

<VideoTranscript transcript="Your full transcript text here..." />
```

### Creating a Game/Topic Resource Page

Resource pages serve as hubs for specific games or topics, pulling in related projects and content automatically. Create a new `.mdx` file in `src/content/blog/resources/`:

**1. Create the resource page file** (e.g., `src/content/blog/resources/my-game-resources.mdx`):

```mdx
---
title: "My Game Resources"
description: "Essential tools, guides, and community resources for My Game players and hobbyists"
pubDate: 2025-01-01
category: "Resources"
tags: ["my game", "resources", "wargaming"]
heroImage: "/images/my-game-hero.jpg"
heroImageAlt: "My Game resources and guides"
hideRelatedPosts: true
resourceType: "hub"
---

import TaggedPostsList from '../../../components/TaggedPostsList.astro';
import GameProjectsList from '../../../components/GameProjectsList.astro';
import ResourceCard from '../../../components/ResourceCard.astro';
import ResourceSection from '../../../components/ResourceSection.astro';

Your hub for all things My Game! Brief intro text here.

{/* Featured Start Here Card */}
<div class="not-prose my-8">
  <ResourceCard
    title="Start Here: Essential Guide"
    description="The best place to start learning the game. Covers all the basics you need to know."
    href="/blog/resources/my-game-guide"
    variant="featured"
    icon="🎯"
  />
</div>

<ResourceSection title="Official Resources" columns={2}>
  <ResourceCard
    title="Official Website"
    description="Rules, lore, and news"
    href="https://example.com"
    external
    icon="🌐"
  />
  <ResourceCard
    title="Rules PDF"
    description="Download the rulebook"
    href="https://example.com/rules"
    external
    icon="📜"
  />
</ResourceSection>

<ResourceSection title="Community" columns={2}>
  <ResourceCard
    title="Discord Server"
    description="Join the community"
    href="https://discord.gg/example"
    external
    icon="💬"
  />
  <ResourceCard
    title="Subreddit"
    description="r/MyGame"
    href="https://reddit.com/r/example"
    external
    icon="🔗"
  />
</ResourceSection>

<ResourceSection title="My Projects">
  <GameProjectsList game="my game" />
</ResourceSection>

<ResourceSection title="My Content">
  <TaggedPostsList tag="my game" excludeCategory="Resources" excludeProjectPosts={true} limit={4} />
</ResourceSection>

---

**Have a resource to suggest?** This guide is a living document!

*Last updated: January 1, 2025*
```

**2. Tag your blog posts** with the game name (e.g., `tags: ["my game"]`) so they appear in the content section.

**3. Set the `game` field on projects** in `src/content/projects/` to link them to this resource page:

```yaml
---
title: "My Project"
description: "Project description"
pubDate: 2025-01-01
draft: false
game: "my game"
---
```

**Resource Components:**

| Component | Props | Description |
| :--- | :--- | :--- |
| `ResourceCard` | `title`, `description?`, `href`, `external?`, `variant?`, `icon?` | Individual resource link card |
| `ResourceSection` | `title`, `description?`, `columns?` | Groups ResourceCards with a header |
| `TaggedPostsList` | `tag`, `excludeCategory?`, `excludeProjectPosts?`, `limit?` | Lists blog posts with a specific tag |
| `GameProjectsList` | `game`, `limit?` | Lists projects for a specific game (with latest post image) |

**ResourceCard variants:**
- `default` - Standard card with subtle background
- `featured` - Highlighted card with amber border (use for "Start Here" links)
- `compact` - Smaller card with left border accent

**ResourceSection columns:**
- `1` - Single column (default)
- `2` - Two columns on medium+ screens
- `3` - Three columns on large screens

**Key frontmatter fields:**
- `hideRelatedPosts: true` - Disables the auto-generated related posts section at the bottom
- `category: "Resources"` - Use this category for resource pages
- `tags` - Include the game name tag so it links to other content
- `resourceType` - Differentiates between resource page types (see below)

**Resource Types (`resourceType` field):**

Use this field to categorize resource pages. Hub pages are automatically excluded from post listings.

| Type | Use For | Example |
| :--- | :--- | :--- |
| `hub` | Main resource landing pages that link to other content | "Mage Knight Resources" |
| `guide` | Tutorial or how-to content | "Stormfox's Newbie Guide" |
| `article` | Reference articles, lists, or informational content | "2003 Tournament Meta" |
| `checklist` | Checklists or quick reference sheets | "Army Checklist" |

Example frontmatter for a guide:
```yaml
---
title: "My Strategy Guide"
description: "A guide to playing the game"
pubDate: 2025-01-01
category: "Resources"
tags: ["my game", "resources"]
heroImage: "/images/guide-hero.jpg"
heroImageAlt: "Guide banner"
hideRelatedPosts: true
resourceType: "guide"
---
```

## Customization

### Colors

Edit `tailwind.config.mjs`:

```js
colors: {
  'parchment': '#F4ECD8', // Blog background
  'ink': '#1a1614',       // Text color
}
```

### Typography

The site uses Georgia/Garamond serif fonts for the illuminated manuscript feel. Change in `tailwind.config.mjs`:

```js
fontFamily: {
  'serif': ['Georgia', 'Garamond', 'serif'],
}
```

## Performance Considerations

- Images use `loading="lazy"` and `decoding="async"` for optimal performance
- Hero images on homepage use `loading="eager"` for immediate display
- View Transitions provide SPA-like navigation without full page reloads
- Component-based architecture reduces code duplication
- Tailwind CSS tree-shaking eliminates unused styles

## Deployment

### Main Site (Netlify)

The site is hosted on Netlify. Build and deploy:

```bash
npm run build
```

The static site will be generated in `./dist/`. Netlify automatically deploys on push to main.

### Comments API (Cloudflare Workers)

The comments system requires a separate Cloudflare Worker deployment. See [comments-api/README.md](comments-api/README.md) for setup instructions.

Quick setup:
```bash
cd comments-api
npm install
npm run db:create    # Create D1 database
npm run db:init      # Initialize schema
npm run deploy       # Deploy worker
```

Then set the `PUBLIC_COMMENTS_API_URL` environment variable in Netlify to your Worker URL.

## License

MIT

## Acknowledgments

Built with [Astro](https://astro.build) - The web framework for content-driven websites.
