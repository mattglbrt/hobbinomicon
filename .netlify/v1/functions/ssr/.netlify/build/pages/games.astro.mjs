/* empty css                                  */
import { a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_Y56nUB79.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_qhExvPGW.mjs';
import { $ as $$GameCard } from '../chunks/GameCard_D19G_al-.mjs';
import { s as supabase } from '../chunks/supabase_Bke0IiNp.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const { data: games, error } = await supabase.from("games").select("*");
  if (error) {
    console.error("Failed to fetch games:", error);
  }
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {}, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="py-12"> <div class="max-w-7xl mx-auto px-4"> <h1 class="text-3xl md:text-4xl font-bold mb-8 text-center">All Games</h1> <div class="grid md:grid-cols-3 gap-8"> ${games?.length > 0 ? games.map((game) => renderTemplate`${renderComponent($$result2, "GameCard", $$GameCard, { "game": game })}`) : renderTemplate`<p class="text-center text-gray-500">No games found.</p>`} </div> </div> </section> ` })}`;
}, "/Users/mattglbrt/Documents/dev/hobbinomicon/src/pages/games/index.astro", void 0);

const $$file = "/Users/mattglbrt/Documents/dev/hobbinomicon/src/pages/games/index.astro";
const $$url = "/games";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
