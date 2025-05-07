/* empty css                                     */
import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead, F as Fragment, b as addAttribute } from '../../chunks/astro/server_Y56nUB79.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../../chunks/BaseLayout_qhExvPGW.mjs';
import { g as getCollection } from '../../chunks/_astro_content_JM_KWxUd.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://hobbinomicon.com");
async function getStaticPaths() {
  const posts = await getCollection("blog");
  return posts.map((post) => ({
    params: { slug: post.slug }
  }));
}
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  const posts = await getCollection("blog");
  const post = posts.find((post2) => post2.slug === slug);
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": post ? `${post.data.title} | Hobbinomicon` : "Post Not Found | Hobbinomicon" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="py-12"> <div class="max-w-4xl mx-auto px-4"> ${post ? renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate`  <nav class="text-sm mb-6 text-gray-500"> <a href="/" class="hover:text-red-600">Home</a> &rsaquo;
<a href="/blog" class="hover:text-red-600">Blog</a> &rsaquo;
<span class="text-gray-900">${post.data.title}</span> </nav>  <h1 class="text-4xl font-bold mb-4">${post.data.title}</h1> <p class="text-gray-500 text-sm mb-8">${new Date(post.data.pubDate).toLocaleDateString()}</p>  ${post.data.featuredImage && renderTemplate`<img${addAttribute(post.data.featuredImage, "src")}${addAttribute(post.data.title, "alt")} class="rounded-lg mb-8 w-full">`} <article class="prose prose-lg max-w-none"> ${post.body} </article> ` })}` : renderTemplate`<div class="text-center py-24"> <h2 class="text-2xl font-bold">Post not found.</h2> </div>`} </div> </section> ` })}`;
}, "/Users/mattglbrt/Documents/dev/hobbinomicon/src/pages/blog/[slug].astro", void 0);

const $$file = "/Users/mattglbrt/Documents/dev/hobbinomicon/src/pages/blog/[slug].astro";
const $$url = "/blog/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
