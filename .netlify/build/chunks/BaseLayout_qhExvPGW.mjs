import { c as createAstro, a as createComponent, m as maybeRenderHead, r as renderTemplate, d as renderComponent, e as renderSlot, f as renderHead, b as addAttribute } from './astro/server_Y56nUB79.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                          */

const $$Astro$1 = createAstro("https://hobbinomicon.com");
const $$Navbar = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Navbar;
  Astro2.request.url.pathname !== "/" && Astro2.request.url.pathname !== "/index.html";
  return renderTemplate`${maybeRenderHead()}<nav id="site-header" class="fixed top-0 w-full z-50 transition-all duration-500 ease-in-out bg-transparent"> <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between"> <a href="/" class="flex items-center"> <!-- Red Logo (for dark background) --> <img src="/images/hobbinomicon-logo-red.svg" alt="Hobbinomicon Logo Red" class="h-10 transition-all duration-300 logo-image red-logo hidden"> <!-- Dark Logo (for light background) --> <img src="/images/hobbinomicon.svg" alt="Hobbinomicon Logo" class="h-10 transition-all duration-300 logo-image dark-logo"> </a> <!-- Desktop Menu --> <ul class="hidden md:flex space-x-8 text-lg font-medium font-sans"> <li><a href="/games" class="transition-colors duration-300 nav-link">Games</a></li> <li><a href="/stores" class="transition-colors duration-300 nav-link">Stores</a></li> <li><a href="/blog" class="transition-colors duration-300 nav-link">Blog</a></li> </ul> <!-- Mobile Hamburger Button --> <div class="md:hidden"> <button id="mobile-menu-button" class="text-gray-800 focus:outline-none"> <div id="hamburger" class="flex flex-col justify-between w-6 h-5"> <span class="block w-full h-0.5 bg-current transition-all duration-300"></span> <span class="block w-full h-0.5 bg-current transition-all duration-300"></span> <span class="block w-full h-0.5 bg-current transition-all duration-300"></span> </div> </button> </div> </div> <!-- Mobile Menu --> <div id="mobile-menu" class="md:hidden px-4 pt-4 pb-6 space-y-4 bg-white shadow transition-all duration-300 transform origin-top scale-y-0 opacity-0"> <a href="/games" class="block text-lg font-medium font-sans transition-colors duration-300 nav-link">Games</a> <a href="/stores" class="block text-lg font-medium font-sans transition-colors duration-300 nav-link">Stores</a> <a href="/blog" class="block text-lg font-medium font-sans transition-colors duration-300 nav-link">Blog</a> </div> </nav>`;
}, "/Users/mattglbrt/Documents/dev/hobbinomicon/src/components/Navbar.astro", void 0);

const $$Footer = createComponent(($$result, $$props, $$slots) => {
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  return renderTemplate`${maybeRenderHead()}<footer class="bg-gray-100 mt-16 border-t border-gray-200"> <div class="max-w-7xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-3 text-gray-600 text-sm"> <div> <h3 class="font-bold text-gray-800 mb-2">Hobbinomicon</h3> <p>Discover tabletop games, local stores, and indie creators.</p> </div> <div> <h3 class="font-bold text-gray-800 mb-2">Explore</h3> <ul class="space-y-2"> <li><a href="/games" class="hover:text-red-600 transition">Games</a></li> <li><a href="/stores" class="hover:text-red-600 transition">Stores</a></li> <li><a href="/blog" class="hover:text-red-600 transition">Blog</a></li> <li><a href="/tags" class="hover:text-red-600 transition">Browse Game Tags</a></li> </ul> </div> <div> <h3 class="font-bold text-gray-800 mb-2">Connect</h3> <ul class="space-y-2"> <li><a href="https://www.instagram.com/" class="hover:text-red-600 transition" target="_blank" rel="noopener noreferrer">Instagram</a></li> <li><a href="https://discord.com/" class="hover:text-red-600 transition" target="_blank" rel="noopener noreferrer">Discord</a></li> <li><a href="mailto:contact@hobbinomicon.com" class="hover:text-red-600 transition">Email Us</a></li> </ul> </div> </div> <div class="text-center text-xs text-gray-500 py-6 border-t border-gray-200">
© ${year} Hobbinomicon. All rights reserved.
</div> </footer>`;
}, "/Users/mattglbrt/Documents/dev/hobbinomicon/src/components/Footer.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://hobbinomicon.com");
const $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$BaseLayout;
  const { title } = Astro2.props;
  return renderTemplate(_a || (_a = __template(['<html lang="en" data-astro-cid-37fxchfa> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>', '</title><meta name="description" content="Discover tabletop wargames, RPGs, miniatures, local stores, guides, and more at Hobbinomicon."><!-- Social Sharing Meta --><meta property="og:title"', '><meta property="og:description" content="Discover tabletop wargames, RPGs, miniatures, local stores, guides, and more at Hobbinomicon."><meta property="og:image" content="/images/social-share.jpg"><meta property="og:type" content="website"><meta name="twitter:card" content="summary_large_image"><link rel="icon" type="image/svg+xml" href="/images/hobbinomicon.svg"><!-- Faster, optimized font loading --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville&display=swap" rel="stylesheet">', '</head> <body class="relative" data-astro-cid-37fxchfa> ', ' <main class="pt-20" data-astro-cid-37fxchfa> ', " </main> ", ' <script src="/scripts/nav.js" defer><\/script>  </body> </html>'])), title ? `${title} | Hobbinomicon` : "Hobbinomicon", addAttribute(title ? `${title} | Hobbinomicon` : "Hobbinomicon", "content"), renderHead(), renderComponent($$result, "Navbar", $$Navbar, { "data-astro-cid-37fxchfa": true }), renderSlot($$result, $$slots["default"]), renderComponent($$result, "Footer", $$Footer, { "data-astro-cid-37fxchfa": true }));
}, "/Users/mattglbrt/Documents/dev/hobbinomicon/src/layouts/BaseLayout.astro", void 0);

export { $$BaseLayout as $ };
