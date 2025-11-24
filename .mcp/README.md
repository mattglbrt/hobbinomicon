# Model Context Protocol (MCP) Documentation

This directory contains pattern guides and documentation for creating consistent content in the Hobbinomicon blog.

## What is this?

These guides document the established patterns, styles, and conventions used throughout the site. They serve as reference documentation for maintaining consistency when creating new content.

## Available Guides

### [Resource Posts Guide](./resource-posts-guide.md)
Learn how to create resource pages with the card-based design system. Includes:
- Frontmatter templates
- Card styling patterns
- Auto-generated content sections
- External link formatting
- Complete examples

**Use this when:** Creating new resource pages for topics like game systems, painting techniques, or community resources.

### [Vlog Posts Guide](./vlog-posts-guide.md)
Learn how to create vlog posts that embed YouTube videos. Includes:
- YouTube integration patterns
- Frontmatter templates
- Tagging strategies
- Auto-thumbnail generation
- Resource page integration

**Use this when:** Publishing new YouTube videos to the blog.

### [Netlify Deployment Guide](./netlify-deployment-guide.md)
Learn how to deploy and manage The Hobbinomicon on Netlify. Includes:
- Initial deployment setup
- Netlify Forms configuration
- Email notification setup
- Custom domain configuration
- Troubleshooting common issues
- Performance optimization

**Use this when:** Deploying the site, configuring forms, or troubleshooting deployment issues.

## Purpose

These guides ensure:
- **Consistency** - All content follows the same patterns
- **Quality** - Best practices are documented and followed
- **Efficiency** - Quick reference for creating new content
- **Maintainability** - Future updates can follow established patterns

## Design System

The Hobbinomicon uses a custom design system based on:
- **Colors:** Parchment background (#F4ECD8) and Ink text (#1a1614)
- **Typography:** IM Fell DW Pica for headings, Besley for body
- **Components:** Card-based layouts with hover effects
- **Framework:** Astro + Tailwind CSS + MDX

## How to Use These Guides

1. **Reference before creating new content** - Check the relevant guide first
2. **Follow the templates** - Copy and adapt the provided examples
3. **Maintain consistency** - Use the established patterns and styling
4. **Update when patterns evolve** - Keep these guides current

## File Structure

```
.mcp/
├── README.md                      # This file
├── resource-posts-guide.md        # Resource page patterns
├── vlog-posts-guide.md            # Vlog post patterns
└── netlify-deployment-guide.md    # Deployment and hosting
```

## Contributing

When you discover new patterns or update existing ones:
1. Document the change in the relevant guide
2. Update examples to reflect the new pattern
3. Ensure consistency across all similar content

## Questions?

- Check the examples in each guide
- Look at existing posts in `/src/content/blog/`
- Review component code in `/src/components/`
- Check utility functions in `/src/utils/`
