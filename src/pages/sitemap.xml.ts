import { supabase } from "../../lib/supabase";

export const prerender = true;

export async function GET() {
  const baseUrl = "https://hobbinomicon.com";

  const { data: games } = await supabase.from("games").select("slug");
  const { data: posts } = await import("astro:content").then(mod => mod.getCollection("blog"));

  let urls = [
    "", "games", "stores", "blog", "tags"
  ].map((page) => `${baseUrl}/${page}`);

  if (games) {
    urls = urls.concat(games.map((game) => `${baseUrl}/games/${game.slug}`));
  }

  if (posts) {
    urls = urls.concat(posts.map((post) => `${baseUrl}/blog/${post.slug}`));
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `<url><loc>${url}</loc></url>`).join("\n")}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
