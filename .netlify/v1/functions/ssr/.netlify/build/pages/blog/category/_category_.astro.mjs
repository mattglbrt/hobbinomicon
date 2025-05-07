/* empty css                                        */
import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../../chunks/astro/server_Y56nUB79.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../../../chunks/BaseLayout_qhExvPGW.mjs';
import { $ as $$BlogPostCard } from '../../../chunks/BlogPostCard_DLBb-79f.mjs';
import { g as getCollection } from '../../../chunks/_astro_content_JM_KWxUd.mjs';
export { renderers } from '../../../renderers.mjs';

const $$Astro = createAstro("https://hobbinomicon.com");
async function getStaticPaths() {
  const posts = await getCollection("blog");
  const categories = new Set(posts.map((post) => post.data.category));
  return Array.from(categories).map((category) => ({
    params: { category }
  }));
}
const $$category = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$category;
  const { category } = Astro2.params;
  const posts = await getCollection("blog");
  const categoryPosts = posts.filter((post) => post.data.category === category);
  const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": `Category: ${categoryTitle} | Hobbinomicon` }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="py-12"> <div class="max-w-7xl mx-auto px-4"> <!-- Breadcrumbs --> <nav class="text-sm mb-6 text-gray-500"> <a href="/" class="hover:text-red-600">Home</a> &rsaquo;
<a href="/blog" class="hover:text-red-600">Blog</a> &rsaquo;
<span class="text-gray-900">${categoryTitle}</span> </nav> <!-- Category Title --> <h1 class="text-3xl font-bold mb-8">Category: ${categoryTitle}</h1> ${categoryPosts.length > 0 ? renderTemplate`<div class="grid md:grid-cols-3 gap-6"> ${categoryPosts.map((post) => renderTemplate`${renderComponent($$result2, "BlogPostCard", $$BlogPostCard, { "post": post })}`)} </div>` : renderTemplate`<p>No posts found for this category.</p>`} </div> </section> ` })}`;
}, "/Users/mattglbrt/Documents/dev/hobbinomicon/src/pages/blog/category/[category].astro", void 0);

const $$file = "/Users/mattglbrt/Documents/dev/hobbinomicon/src/pages/blog/category/[category].astro";
const $$url = "/blog/category/[category]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$category,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
