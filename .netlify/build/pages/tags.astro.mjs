/* empty css                                  */
import { a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute } from '../chunks/astro/server_Y56nUB79.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_qhExvPGW.mjs';
import { s as supabase } from '../chunks/supabase_Bke0IiNp.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const { data: games, error } = await supabase.from("games").select("tags");
  if (error) {
    console.error("Failed to fetch games for tags:", error);
  }
  const tagCounts = {};
  if (games) {
    games.forEach((game) => {
      (game.tags || []).forEach((tag) => {
        const slug = tag.toLowerCase().replace(/\s+/g, "-");
        if (!tagCounts[slug]) {
          tagCounts[slug] = { label: tag, count: 1 };
        } else {
          tagCounts[slug].count++;
        }
      });
    });
  }
  const tags = Object.entries(tagCounts).map(([slug, { label, count }]) => ({
    slug,
    label,
    count
  }));
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Browse by Tags" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="py-12"> <div class="max-w-7xl mx-auto px-4"> <nav class="text-sm text-gray-500 mb-6"> <a href="/" class="hover:underline">Home</a> › <span class="font-bold">Tags</span> </nav> <h1 class="text-3xl font-bold mb-8">Browse by Tags</h1> ${tags.length > 0 ? renderTemplate`<div class="grid md:grid-cols-3 gap-6"> ${tags.map((tag) => renderTemplate`<a${addAttribute(`/tags/${tag.slug}`, "href")} class="block rounded-xl shadow-md bg-white hover:shadow-lg transition p-6"> <div class="flex justify-between items-center"> <span class="font-semibold text-lg">${tag.label}</span> <span class="bg-gray-200 text-gray-700 text-xs rounded-full px-3 py-1">${tag.count}</span> </div> </a>`)} </div>` : renderTemplate`<p class="text-center text-gray-600">No tags found.</p>`} </div> </section> ` })}`;
}, "/Users/mattglbrt/Documents/dev/hobbinomicon/src/pages/tags/index.astro", void 0);

const $$file = "/Users/mattglbrt/Documents/dev/hobbinomicon/src/pages/tags/index.astro";
const $$url = "/tags";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
