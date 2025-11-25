# The Hobbinomicon

A beautiful, performant personal portfolio and blog built with Astro 5, featuring an illuminated manuscript aesthetic for blog posts and full-screen hero sections for stunning visual impact.

# To Do List
- [ ] Search Functionality (High Impact, Medium Effort)
Add Pagefind or Algolia search so users can find specific content

- [ ] SEO Enhancements (High Impact, Medium Effort)
Add Schema.org structured data (BlogPosting, Person) for rich snippets
Generate sitemap.xml automatically
Add category-specific meta descriptions

 - [ ] Social Sharing Buttons (Medium Impact, Low Effort)
Add Twitter, Facebook, Pinterest share buttons to blog posts
Include Twitter card creator attribution

## Quick Wins (Low Effort, Good Impact)
- [ ] Add skip-to-content link for accessibility
- [ ] Extract duplicate code (date formatting, YouTube fallback - [ ] logic) into utilities
- [ ] Improve color contrast on hover states (bg-white/10 → bg-white/20)
- [ ] Add breadcrumbs to category pages
- [ ] Add "Back to Top" button on long posts

## User Experience Polish
- [ ] Table of Contents for long blog posts
- [ ] Newsletter signup form in footer
- [ ] Comments system 
- [ ] View counter to show popular posts
- [ ] Loading skeletons for images

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
