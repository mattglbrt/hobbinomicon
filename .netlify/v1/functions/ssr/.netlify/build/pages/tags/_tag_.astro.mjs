/* empty css                                     */
import { c as createAstro, a as createComponent, m as maybeRenderHead, d as renderComponent, F as Fragment, r as renderTemplate, b as addAttribute } from '../../chunks/astro/server_Y56nUB79.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../../chunks/BaseLayout_qhExvPGW.mjs';
import { s as supabase } from '../../chunks/supabase_Bke0IiNp.mjs';
import { $ as $$GameCard } from '../../chunks/GameCard_D19G_al-.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro$1 = createAstro("https://hobbinomicon.com");
const $$Breadcrumbs = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Breadcrumbs;
  const { items } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<nav aria-label="Breadcrumb" class="text-sm mb-6"> <ol class="flex flex-wrap items-center space-x-2"> ${items.map((item, idx) => renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate` <li class="inline-flex items-center"> ${item.href ? renderTemplate`<a${addAttribute(item.href, "href")} class="text-gray-600 hover:text-red-600">${item.title}</a>` : renderTemplate`<span class="text-gray-900">${item.title}</span>`} </li> ${idx < items.length - 1 && renderTemplate`<li class="text-gray-400">/</li>`}` })}`)} </ol> </nav>`;
}, "/Users/mattglbrt/Documents/dev/hobbinomicon/src/components/Breadcrumbs.astro", void 0);

const $$Astro = createAstro("https://hobbinomicon.com");
async function getStaticPaths() {
  const { data: games, error } = await supabase.from("games").select("tags");
  if (error) {
    console.error("Failed to fetch tags:", error);
    return [];
  }
  const uniqueTags = /* @__PURE__ */ new Set();
  games?.forEach((game) => {
    game.tags?.forEach((tag) => uniqueTags.add(tag));
  });
  return Array.from(uniqueTags).map((tag) => ({
    params: { tag }
  }));
}
const $$tag = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$tag;
  const { tag } = Astro2.params;
  const { data: gamesWithTag, error } = await supabase.from("games").select("*").contains("tags", [tag]);
  if (error) {
    console.error("Failed to fetch games with tag:", error);
  }
  const breadcrumbs = [
    { title: "Home", href: "/" },
    { title: "Tags", href: "/tags" },
    { title: tag }
  ];
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {}, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="py-8"> <div class="max-w-7xl mx-auto px-4"> ${renderComponent($$result2, "Breadcrumbs", $$Breadcrumbs, { "items": breadcrumbs })} <h1 class="text-3xl font-bold mb-8">Games tagged with "${tag}"</h1> ${gamesWithTag && gamesWithTag.length > 0 ? renderTemplate`<div class="grid md:grid-cols-3 gap-6"> ${gamesWithTag.map((game) => renderTemplate`${renderComponent($$result2, "GameCard", $$GameCard, { "game": game })}`)} </div>` : renderTemplate`<p>No games found with this tag.</p>`} </div> </section> ` })}`;
}, "/Users/mattglbrt/Documents/dev/hobbinomicon/src/pages/tags/[tag].astro", void 0);

const $$file = "/Users/mattglbrt/Documents/dev/hobbinomicon/src/pages/tags/[tag].astro";
const $$url = "/tags/[tag]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$tag,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
