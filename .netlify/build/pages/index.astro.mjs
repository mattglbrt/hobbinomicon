/* empty css                                  */
import { a as createComponent, m as maybeRenderHead, r as renderTemplate, c as createAstro, b as addAttribute, d as renderComponent } from '../chunks/astro/server_Y56nUB79.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_qhExvPGW.mjs';
import 'clsx';
import { $ as $$GameCard } from '../chunks/GameCard_D19G_al-.mjs';
import { $ as $$BlogPostCard } from '../chunks/BlogPostCard_DLBb-79f.mjs';
import { s as supabase } from '../chunks/supabase_Bke0IiNp.mjs';
import { g as getCollection } from '../chunks/_astro_content_JM_KWxUd.mjs';
export { renderers } from '../renderers.mjs';

const $$HeroBanner = createComponent(($$result, $$props, $$slots) => {
  const title = "Find Your Next Game";
  return renderTemplate`${maybeRenderHead()}<section class="relative w-full h-[50vh] bg-cover bg-center flex items-center justify-center -mt-[6%]" style="background-image: url('/images/assets/libraryhero.png');"> <div class="absolute inset-0 bg-black bg-opacity-50"></div> <div class="relative text-center px-4 pt-24"> <h1 class="text-4xl md:text-6xl font-bold text-white"> ${title} </h1> </div> <div id="hero-marker" class="absolute bottom-0 w-full h-1"></div> </section>`;
}, "/Users/mattglbrt/Documents/dev/hobbinomicon/src/components/HeroBanner.astro", void 0);

const $$Astro$1 = createAstro("https://hobbinomicon.com");
const $$FeaturedBanner = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$FeaturedBanner;
  const { game } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<section class="relative w-full h-[400px] md:h-[500px] bg-cover bg-center"${addAttribute(`background-image: url('${game.cover}');`, "style")}> <div class="absolute inset-0 bg-black bg-opacity-60 flex flex-col justify-center items-center text-center px-4"> <h2 class="text-3xl md:text-5xl font-bold text-white mb-4">${game.title}</h2> <p class="text-white max-w-2xl">${game.description}</p> <a${addAttribute(`/games/${game.slug}`, "href")} class="mt-6 inline-block bg-red-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-red-700 transition">
Learn More
</a> </div> </section>`;
}, "/Users/mattglbrt/Documents/dev/hobbinomicon/src/components/FeaturedBanner.astro", void 0);

const $$Astro = createAstro("https://hobbinomicon.com");
const $$CategorySection = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$CategorySection;
  const { title, posts } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<section class="my-12"> <div class="max-w-7xl mx-auto px-4"> <h2 class="text-2xl md:text-3xl font-bold mb-6">${title}</h2> <div class="grid md:grid-cols-3 gap-6"> ${posts.map((post) => renderTemplate`${renderComponent($$result, "BlogPostCard", BlogPostCard, { "post": post })}`)} </div> </div> </section>`;
}, "/Users/mattglbrt/Documents/dev/hobbinomicon/src/components/CategorySection.astro", void 0);

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const { data: games, error } = await supabase.from("games").select("*");
  const posts = await getCollection("blog");
  const newsPosts = posts.filter((post) => post.data.category === "News").slice(0, 6);
  const featuredGame = games?.find((game) => game.slug === "warmachine") || games?.[0] || null;
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {}, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "HeroBanner", $$HeroBanner, {})} ${maybeRenderHead()}<section class="py-12"> <div class="max-w-7xl mx-auto px-4"> <h2 class="text-3xl md:text-4xl font-bold mb-8 text-center">Recently Updated Games</h2> <div class="grid md:grid-cols-3 gap-8"> ${games?.length > 0 ? games.slice(0, 3).map((game) => renderTemplate`${renderComponent($$result2, "GameCard", $$GameCard, { "game": game })}`) : renderTemplate`<p class="text-center text-gray-500">No games found.</p>`} </div> </div> </section> <section class="py-12 bg-gray-100"> <div class="max-w-7xl mx-auto px-4"> <h2 class="text-3xl md:text-4xl font-bold mb-8 text-center">Latest News</h2> <div class="grid md:grid-cols-3 gap-8"> ${newsPosts.map((post) => renderTemplate`${renderComponent($$result2, "BlogPostCard", $$BlogPostCard, { "post": post })}`)} </div> </div> </section> ${featuredGame && renderTemplate`${renderComponent($$result2, "FeaturedBanner", $$FeaturedBanner, { "game": featuredGame })}`}${renderComponent($$result2, "CategorySection", $$CategorySection, { "title": "Guides", "posts": posts.filter((post) => post.data.category === "Guides").slice(0, 6) })} ${renderComponent($$result2, "CategorySection", $$CategorySection, { "title": "Reviews", "posts": posts.filter((post) => post.data.category === "Reviews").slice(0, 6) })} ${renderComponent($$result2, "CategorySection", $$CategorySection, { "title": "Hobby Log", "posts": posts.filter((post) => post.data.category === "Hobby Log").slice(0, 6) })} ` })}`;
}, "/Users/mattglbrt/Documents/dev/hobbinomicon/src/pages/index.astro", void 0);

const $$file = "/Users/mattglbrt/Documents/dev/hobbinomicon/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
