/* empty css                                     */
import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_Y56nUB79.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../../chunks/BaseLayout_qhExvPGW.mjs';
import { $ as $$GameCard } from '../../chunks/GameCard_D19G_al-.mjs';
import { s as supabase } from '../../chunks/supabase_Bke0IiNp.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://hobbinomicon.com");
async function getStaticPaths() {
  const { data: games } = await supabase.from("games").select("tags");
  if (!games) return [];
  const tags = Array.from(new Set(
    games.flatMap((game) => game.tags || [])
  ));
  return tags.map((tag) => ({
    params: { slug: tag.toLowerCase().replace(/\s+/g, "-") }
  }));
}
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  const humanReadableTag = slug.replace(/-/g, " ");
  const { data: games } = await supabase.from("games").select("*");
  const filteredGames = (games || []).filter(
    (game) => game.tags?.some((tag) => tag.toLowerCase().replace(/\s+/g, "-") === slug)
  );
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": `Games Tagged "${humanReadableTag}"` }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="py-12"> <div class="max-w-7xl mx-auto px-4"> <nav class="text-sm text-gray-500 mb-6"> <a href="/" class="hover:underline">Home</a> › <a href="/tags" class="hover:underline">Tags</a> › <span class="font-bold">${humanReadableTag}</span> </nav> <h1 class="text-3xl font-bold mb-8">Games Tagged: ${humanReadableTag}</h1> ${filteredGames.length > 0 ? renderTemplate`<div class="grid md:grid-cols-3 gap-8"> ${filteredGames.map((game) => renderTemplate`${renderComponent($$result2, "GameCard", $$GameCard, { "game": game, "size": "small" })}`)} </div>` : renderTemplate`<p class="text-center text-gray-600">No games found with this tag.</p>`} <div class="mt-12 text-center"> <a href="/games" class="inline-block bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition">
← Back to All Games
</a> </div> </div> </section> ` })}`;
}, "/Users/mattglbrt/Documents/dev/hobbinomicon/src/pages/tags/[slug].astro", void 0);

const $$file = "/Users/mattglbrt/Documents/dev/hobbinomicon/src/pages/tags/[slug].astro";
const $$url = "/tags/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
