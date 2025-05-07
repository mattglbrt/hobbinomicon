/* empty css                                     */
import { c as createAstro, a as createComponent, m as maybeRenderHead, b as addAttribute, r as renderTemplate, d as renderComponent } from '../../chunks/astro/server_Y56nUB79.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../../chunks/BaseLayout_qhExvPGW.mjs';
import { s as supabase } from '../../chunks/supabase_Bke0IiNp.mjs';
import 'clsx';
export { renderers } from '../../renderers.mjs';

const $$Astro$1 = createAstro("https://hobbinomicon.com");
const $$GameDetails = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$GameDetails;
  const { game } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<section class="py-12"> <div class="max-w-7xl mx-auto px-4"> <!-- Game Banner --> ${game.cover_url && renderTemplate`<div class="w-full h-[50vh] bg-cover bg-center rounded-lg mb-12"${addAttribute(`background-image: url(${game.cover_url})`, "style")}></div>`} <!-- Title and Description --> <h1 class="text-4xl font-bold mb-4">${game.title}</h1> <p class="text-gray-700 mb-8">${game.description}</p> <!-- Game Details --> <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"> <div> <h2 class="text-2xl font-semibold mb-2">Game Details</h2> <ul class="text-gray-600 space-y-1"> ${game.publication_year && renderTemplate`<li><strong>Published:</strong> ${game.publication_year}</li>`} ${game.min_players && renderTemplate`<li><strong>Players:</strong> ${game.min_players}–${game.max_players}</li>`} ${game.play_time && renderTemplate`<li><strong>Play Time:</strong> ${game.play_time}</li>`} ${game.age_range && renderTemplate`<li><strong>Age Range:</strong> ${game.age_range}</li>`} </ul> </div> <div> <h2 class="text-2xl font-semibold mb-2">Official Links</h2> <ul class="text-gray-600 space-y-1"> ${game.official_website && renderTemplate`<li><a${addAttribute(game.official_website, "href")} class="text-red-600 hover:underline" target="_blank" rel="noopener noreferrer">Official Website</a></li>`} ${game.rules_url && renderTemplate`<li><a${addAttribute(game.rules_url, "href")} class="text-red-600 hover:underline" target="_blank" rel="noopener noreferrer">Rules</a></li>`} </ul> </div> </div> <!-- Tags --> ${game.tags && game.tags.length > 0 && renderTemplate`<div class="mt-8"> <h2 class="text-2xl font-semibold mb-4">Tags</h2> <div class="flex flex-wrap gap-3"> ${game.tags.map((tag) => renderTemplate`<a${addAttribute(`/tags/${tag.toLowerCase().replace(/\s+/g, "-")}`, "href")} class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-full text-sm"> ${tag} </a>`)} </div> </div>`} </div> </section>`;
}, "/Users/mattglbrt/Documents/dev/hobbinomicon/src/components/GameDetails.astro", void 0);

const $$Astro = createAstro("https://hobbinomicon.com");
async function getStaticPaths() {
  const { data: games, error } = await supabase.from("games").select("slug");
  if (error) {
    console.error("Failed to fetch games:", error);
    return [];
  }
  return games.map((game) => ({
    params: { slug: game.slug }
  }));
}
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  const { data: game, error } = await supabase.from("games").select("*").eq("slug", slug).single();
  if (error) {
    console.error("Failed to fetch game:", error);
  }
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {}, { "default": async ($$result2) => renderTemplate`${game ? renderTemplate`${renderComponent($$result2, "GameDetails", $$GameDetails, { "game": game })}` : renderTemplate`${maybeRenderHead()}<div class="text-center py-24"> <h2 class="text-2xl font-bold">Game not found.</h2> </div>`}` })}`;
}, "/Users/mattglbrt/Documents/dev/hobbinomicon/src/pages/games/[slug].astro", void 0);

const $$file = "/Users/mattglbrt/Documents/dev/hobbinomicon/src/pages/games/[slug].astro";
const $$url = "/games/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
