import { c as createAstro, a as createComponent, m as maybeRenderHead, b as addAttribute, r as renderTemplate } from './astro/server_Y56nUB79.mjs';
import 'kleur/colors';
import 'clsx';

const $$Astro = createAstro("https://hobbinomicon.com");
const $$BlogPostCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$BlogPostCard;
  const { post } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<a${addAttribute(`/blog/${post.slug}`, "href")} class="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"> ${post.data.featuredImage && renderTemplate`<img${addAttribute(post.data.featuredImage, "src")}${addAttribute(post.data.title, "alt")} class="w-full h-48 object-cover">`} <div class="p-4"> <h3 class="text-lg font-bold mb-2">${post.data.title}</h3> <p class="text-gray-600 text-sm mb-4"> ${post.data.description.length > 100 ? `${post.data.description.slice(0, 100)}...` : post.data.description} </p> <div class="flex items-center justify-between text-xs text-gray-500"> <span>${post.data.category}</span> <span>${new Date(post.data.pubDate).toLocaleDateString()}</span> </div> </div> </a>`;
}, "/Users/mattglbrt/Documents/dev/hobbinomicon/src/components/BlogPostCard.astro", void 0);

export { $$BlogPostCard as $ };
