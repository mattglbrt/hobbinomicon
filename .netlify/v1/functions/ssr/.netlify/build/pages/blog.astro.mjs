/* empty css                                  */
import { a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_Y56nUB79.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_qhExvPGW.mjs';
import { g as getCollection } from '../chunks/_astro_content_JM_KWxUd.mjs';
import { $ as $$BlogPostCard } from '../chunks/BlogPostCard_DLBb-79f.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const posts = await getCollection("blog");
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {}, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="py-12"> <div class="max-w-7xl mx-auto px-4"> <h1 class="text-3xl font-bold mb-8">Blog</h1> <div class="grid md:grid-cols-3 gap-6"> ${posts.map((post) => renderTemplate`${renderComponent($$result2, "BlogPostCard", $$BlogPostCard, { "post": post })}`)} </div> </div> </section> ` })}`;
}, "/Users/mattglbrt/Documents/dev/hobbinomicon/src/pages/blog/index.astro", void 0);

const $$file = "/Users/mattglbrt/Documents/dev/hobbinomicon/src/pages/blog/index.astro";
const $$url = "/blog";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
