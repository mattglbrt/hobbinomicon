import { getCollection } from "astro:content";

export async function GET() {
  const blogPosts = await getCollection("blog");

  const pages = [
    { url: "/", lastmod: new Date().toISOString() },
    { url: "/games", lastmod: new Date().toISOString() },
    { url: "/stores", lastmod: new Date().toISOString() },
    { url: "/blog", lastmod: new Date().toISOString() },
    { url: "/tags", lastmod: new Date().toISOString() },
    // Add more static pages if needed
  ];

  const posts = blogPosts.map((post) => ({
    url: `/blog/${post.slug}`,
    lastmod: post.data.pubDate.toISOString(),
  }));

  const allPages = [...pages, ...posts];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allPages
    .map(
      (page) => `
    <url>
      <loc>${import.meta.env.SITE}${page.url}</loc>
      <lastmod>${page.lastmod}</lastmod>
    </url>
  `
    )
    .join("")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
