# The Hobbinomicon

A beautiful, performant personal portfolio and blog built with Astro 5, featuring an illuminated manuscript aesthetic for blog posts and full-screen hero sections for stunning visual impact.

## To Do List
RSS feed - Let readers subscribe to new posts
Reading progress indicator - Shows how far through an article
Social share buttons - Twitter, Facebook, copy link
Table of contents - Auto-generated for longer posts
Estimated reading time - Already in BlogLayout, but could add to PostCard
Image lazy loading with blur placeholders - Already partially done
Newsletter signup - If you want to collect emails
Comments - Giscus, Disqus, or similar

## Features

- **Full-screen hero sections** with image overlays on homepage
- **Illuminated manuscript styling** for blog posts (cream background, rich black typography)
- **Content Collections** for type-safe blog posts with frontmatter validation
- **Categories & Tags** for organized content browsing
- **Reusable components** for maintainable code
- **View Transitions** for smooth, SPA-like navigation
- **Responsive design** with Tailwind CSS
- **Performance optimized** with lazy loading and proper image handling
- **Rich media support**: YouTube embeds, image galleries, and video transcripts
- **SEO ready** with OpenGraph and Twitter Card meta tags

## Tech Stack

- [Astro 5.15.9](https://astro.build) - Web framework
- [Tailwind CSS 3](https://tailwindcss.com) - Styling
- TypeScript - Type safety
- Content Collections - Type-safe content management

## Project Structure

```
/
├── public/
│   └── images/          # Static images
├── src/
│   ├── components/      # Reusable components
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── HeroSection.astro
│   │   ├── PostCard.astro
│   │   ├── YouTubeEmbed.astro
│   │   ├── ImageGallery.astro
│   │   └── VideoTranscript.astro
│   ├── content/
│   │   ├── config.ts    # Content collections schema
│   │   └── blog/        # Blog posts (Markdown)
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── BlogLayout.astro
│   └── pages/
│       ├── index.astro         # Homepage
│       ├── blog/
│       │   ├── index.astro     # Blog index
│       │   └── [...slug].astro # Individual blog posts
│       ├── categories/
│       │   ├── index.astro
│       │   └── [category].astro
│       └── tags/
│           └── [tag].astro
├── astro.config.mjs
├── tailwind.config.mjs
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
---

import TaggedPostsList from '../../../components/TaggedPostsList.astro';
import GameProjectsList from '../../../components/GameProjectsList.astro';
import TableOfContents from '../../../components/TableOfContents.astro';

Your hub for all things My Game! Brief intro text here.

<TableOfContents items={[
  { title: "Essential Links", slug: "essential-links" },
  { title: "My Projects", slug: "my-projects" },
  { title: "My Content", slug: "my-content" },
]} />

---

## Essential Links

<div class="not-prose grid gap-6 my-8">
  <div class="p-6 bg-ink/5 border-l-4 border-ink/20 rounded-r-lg">
    <h3 class="text-xl font-heading font-bold text-ink mb-3">Official Resources</h3>
    <ul class="space-y-2 text-ink/80">
      <li><a href="https://example.com" class="underline hover:text-ink">Official Website</a></li>
      <li><a href="https://example.com/rules" class="underline hover:text-ink">Rules PDF</a></li>
    </ul>
  </div>

  <div class="p-6 bg-ink/5 border-l-4 border-ink/20 rounded-r-lg">
    <h3 class="text-xl font-heading font-bold text-ink mb-3">Community Tools</h3>
    <ul class="space-y-2 text-ink/80">
      <li><a href="https://discord.gg/example" class="underline hover:text-ink">Discord Server</a></li>
      <li><a href="https://reddit.com/r/example" class="underline hover:text-ink">Subreddit</a></li>
    </ul>
  </div>
</div>

---

## My Projects

<GameProjectsList game="my game" />

---

## My Content

<TaggedPostsList tag="my game" excludeCategory="Resources" excludeProjectPosts={true} limit={4} />

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

**Component Options:**

| Component | Props | Description |
| :--- | :--- | :--- |
| `TaggedPostsList` | `tag`, `excludeCategory?`, `excludeProjectPosts?`, `limit?` | Lists blog posts with a specific tag |
| `GameProjectsList` | `game`, `limit?` | Lists projects for a specific game (with latest post image) |
| `TableOfContents` | `items: {title, slug}[]` | Jump links to page sections |

**Key frontmatter fields:**
- `hideRelatedPosts: true` - Disables the auto-generated related posts section at the bottom
- `category: "Resources"` - Use this category for resource pages
- `tags` - Include the game name tag so it links to other content

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

Build the production site:

```bash
npm run build
```

The static site will be generated in `./dist/` and can be deployed to any static hosting provider:

- [Vercel](https://vercel.com)
- [Netlify](https://netlify.com)
- [Cloudflare Pages](https://pages.cloudflare.com)
- [GitHub Pages](https://pages.github.com)

## License

MIT

## Acknowledgments

Built with [Astro](https://astro.build) - The web framework for content-driven websites.
