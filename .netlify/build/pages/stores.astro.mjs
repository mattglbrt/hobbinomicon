/* empty css                                  */
import { a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute } from '../chunks/astro/server_Y56nUB79.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_qhExvPGW.mjs';
import { s as supabase } from '../chunks/supabase_Bke0IiNp.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const { data: stores, error } = await supabase.from("stores").select("*");
  if (error) {
    console.error("Failed to fetch stores:", error);
  }
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Find Local Game Stores | Hobbinomicon" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="max-w-7xl mx-auto px-4 py-12"> <h1 class="text-3xl md:text-4xl font-bold mb-8 text-center">Local Game Stores</h1> ${stores && stores.length > 0 ? renderTemplate`<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3"> ${stores.map((store) => renderTemplate`<a${addAttribute(`/stores/${store.slug}`, "href")} class="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"> <div class="p-6"> <h2 class="text-xl font-bold mb-2">${store.name}</h2> ${store.location && renderTemplate`<p class="text-gray-600 text-sm mb-2">${store.location}</p>`} <p class="text-gray-700 line-clamp-3">${store.description}</p> </div> </a>`)} </div>` : renderTemplate`<p class="text-center text-gray-600">No stores found.</p>`} </section> ` })}`;
}, "/Users/mattglbrt/Documents/dev/hobbinomicon/src/pages/stores/index.astro", void 0);

const $$file = "/Users/mattglbrt/Documents/dev/hobbinomicon/src/pages/stores/index.astro";
const $$url = "/stores";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
