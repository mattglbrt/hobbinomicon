import { g as getCollection } from '../chunks/_astro_content_JM_KWxUd.mjs';
export { renderers } from '../renderers.mjs';

async function GET() {
  const blogPosts = await getCollection("blog");
  const pages = [
    { url: "/", lastmod: (/* @__PURE__ */ new Date()).toISOString() },
    { url: "/games", lastmod: (/* @__PURE__ */ new Date()).toISOString() },
    { url: "/stores", lastmod: (/* @__PURE__ */ new Date()).toISOString() },
    { url: "/blog", lastmod: (/* @__PURE__ */ new Date()).toISOString() },
    { url: "/tags", lastmod: (/* @__PURE__ */ new Date()).toISOString() }
    // Add more static pages if needed
  ];
  const posts = blogPosts.map((post) => ({
    url: `/blog/${post.slug}`,
    lastmod: post.data.pubDate.toISOString()
  }));
  const allPages = [...pages, ...posts];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allPages.map(
    (page) => `
    <url>
      <loc>${"https://hobbinomicon.com"}${page.url}</loc>
      <lastmod>${page.lastmod}</lastmod>
    </url>
  `
  ).join("")}
</urlset>`;
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml"
    }
  });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
