/* empty css                                     */
import { c as createAstro, a as createComponent, m as maybeRenderHead, r as renderTemplate, b as addAttribute, d as renderComponent } from '../../chunks/astro/server_Y56nUB79.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../../chunks/BaseLayout_qhExvPGW.mjs';
import { s as supabase } from '../../chunks/supabase_Bke0IiNp.mjs';
import 'clsx';
export { renderers } from '../../renderers.mjs';

const $$Astro$1 = createAstro("https://hobbinomicon.com");
const $$StoreDetails = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$StoreDetails;
  const { store } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="max-w-5xl mx-auto py-12 px-4"> <div class="bg-white rounded-lg shadow-md p-8"> <h1 class="text-3xl font-bold mb-4">${store.name}</h1> <p class="text-gray-600 mb-6">${store.description}</p> <div class="space-y-4"> ${store.location && renderTemplate`<div> <h2 class="text-lg font-semibold">Location</h2> <p>${store.location}</p> </div>`} ${store.website && renderTemplate`<div> <h2 class="text-lg font-semibold">Website</h2> <a${addAttribute(store.website, "href")} class="text-red-600 hover:underline" target="_blank" rel="noopener noreferrer"> ${store.website} </a> </div>`} ${store.contact_email && renderTemplate`<div> <h2 class="text-lg font-semibold">Contact</h2> <a${addAttribute(`mailto:${store.contact_email}`, "href")} class="text-red-600 hover:underline"> ${store.contact_email} </a> </div>`} </div> <div class="mt-8"> <a href="/stores" class="inline-block text-red-600 hover:underline">
← Back to All Stores
</a> </div> </div> </div>`;
}, "/Users/mattglbrt/Documents/dev/hobbinomicon/src/components/StoreDetails.astro", void 0);

const $$Astro = createAstro("https://hobbinomicon.com");
async function getStaticPaths() {
  const { data: stores, error } = await supabase.from("stores").select("slug");
  if (error) {
    console.error("Failed to fetch stores:", error);
    return [];
  }
  return stores.map((store) => ({
    params: { slug: store.slug }
  }));
}
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  const { data: store, error } = await supabase.from("stores").select("*").eq("slug", slug).single();
  if (error) {
    console.error("Failed to fetch store:", error);
  }
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": store?.name ? `${store.name} | Hobbinomicon` : "Store not found" }, { "default": async ($$result2) => renderTemplate`${store ? renderTemplate`${renderComponent($$result2, "StoreDetails", $$StoreDetails, { "store": store })}` : renderTemplate`${maybeRenderHead()}<div class="text-center py-24"> <h2 class="text-2xl font-bold">Store not found.</h2> <a href="/stores" class="mt-4 inline-block text-red-600 hover:underline">← Back to All Stores</a> </div>`}` })}`;
}, "/Users/mattglbrt/Documents/dev/hobbinomicon/src/pages/stores/[slug].astro", void 0);

const $$file = "/Users/mattglbrt/Documents/dev/hobbinomicon/src/pages/stores/[slug].astro";
const $$url = "/stores/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
