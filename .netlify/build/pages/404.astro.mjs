/* empty css                                  */
import { a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_Y56nUB79.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_qhExvPGW.mjs';
export { renderers } from '../renderers.mjs';

const $$404 = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Page Not Found" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="flex flex-col items-center justify-center min-h-screen px-6 py-16 text-center"> <h1 class="text-6xl font-bold mb-4 text-primary">404</h1> <p class="text-lg mb-8 text-gray-600">Sorry, the page you are looking for does not exist.</p> <a href="/" class="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded">
Return Home
</a> </main> ` })}`;
}, "/Users/mattglbrt/Documents/dev/hobbinomicon/src/pages/404.astro", void 0);

const $$file = "/Users/mattglbrt/Documents/dev/hobbinomicon/src/pages/404.astro";
const $$url = "/404";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$404,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
