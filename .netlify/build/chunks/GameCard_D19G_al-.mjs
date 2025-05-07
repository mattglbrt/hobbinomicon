import { c as createAstro, a as createComponent, m as maybeRenderHead, b as addAttribute, r as renderTemplate } from './astro/server_Y56nUB79.mjs';
import 'kleur/colors';
import 'clsx';

const $$Astro = createAstro("https://hobbinomicon.com");
const $$GameCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$GameCard;
  const { game } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<a${addAttribute(`/games/${game.slug}`, "href")} class="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"> ${game.cover_url && renderTemplate`<img${addAttribute(game.cover_url, "src")}${addAttribute(game.title, "alt")} class="w-full h-48 object-cover">`} <div class="p-4"> <h3 class="text-xl font-bold mb-2">${game.title}</h3> ${game.description && renderTemplate`<p class="text-gray-600 text-sm mb-4">${game.description.slice(0, 100)}...</p>`} ${game.tags && game.tags.length > 0 && renderTemplate`<div class="flex flex-wrap gap-2"> ${game.tags.slice(0, 3).map((tag) => renderTemplate`<span class="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs"> ${tag} </span>`)} </div>`} </div> </a>`;
}, "/Users/mattglbrt/Documents/dev/hobbinomicon/src/components/GameCard.astro", void 0);

export { $$GameCard as $ };
