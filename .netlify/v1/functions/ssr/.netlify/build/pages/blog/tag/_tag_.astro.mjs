/* empty css                                        */
import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute } from '../../../chunks/astro/server_Y56nUB79.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../../../chunks/BaseLayout_qhExvPGW.mjs';
import { g as getCollection } from '../../../chunks/_astro_content_JM_KWxUd.mjs';
export { renderers } from '../../../renderers.mjs';

const $$Astro = createAstro("https://hobbinomicon.com");
async function getStaticPaths() {
  const posts = await getCollection("blog");
  const tags = /* @__PURE__ */ new Set();
  for (const post of posts) {
    post.data.tags.forEach((tag) => tags.add(tag));
  }
  return Array.from(tags).map((tag) => ({
    params: { tag }
  }));
}
const $$tag = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$tag;
  const { tag } = Astro2.params;
  const posts = await getCollection("blog");
  const taggedPosts = posts.filter((post) => post.data.tags.includes(tag));
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": `Posts tagged "${tag}" | Hobbinomicon` }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="py-12"> <div class="max-w-7xl mx-auto px-4"> <!-- Breadcrumbs --> <nav class="text-sm mb-6 text-gray-500"> <a href="/" class="hover:text-red-600">Home</a> &rsaquo;
<a href="/blog" class="hover:text-red-600">Blog</a> &rsaquo;
<span class="text-gray-900">${tag}</span> </nav> <h1 class="text-3xl md:text-4xl font-bold mb-8">Posts tagged with "${tag}"</h1> ${taggedPosts.length > 0 ? renderTemplate`<div class="grid md:grid-cols-3 gap-6"> ${taggedPosts.map((post) => renderTemplate`<div class="border rounded-lg overflow-hidden shadow hover:shadow-lg transition p-4"> <a${addAttribute(`/blog/${post.slug}`, "href")} class="block"> ${post.data.featuredImage && renderTemplate`<img${addAttribute(post.data.featuredImage, "src")}${addAttribute(post.data.title, "alt")} class="rounded mb-4">`} <h2 class="text-xl font-semibold">${post.data.title}</h2> <p class="text-gray-500 text-sm mt-2">${new Date(post.data.pubDate).toLocaleDateString()}</p> </a> </div>`)} </div>` : renderTemplate`<p>No posts found for this tag.</p>`} </div> </section> ` })}`;
}, "/Users/mattglbrt/Documents/dev/hobbinomicon/src/pages/blog/tag/[tag].astro", void 0);

const $$file = "/Users/mattglbrt/Documents/dev/hobbinomicon/src/pages/blog/tag/[tag].astro";
const $$url = "/blog/tag/[tag]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$tag,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
