import { renderers } from './renderers.mjs';
import { s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_CvSoi7hX.mjs';
import { manifest } from './manifest_BQJqYxHu.mjs';
import { createExports } from '@astrojs/netlify/ssr-function.js';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/404.astro.mjs');
const _page2 = () => import('./pages/blog/category/_category_.astro.mjs');
const _page3 = () => import('./pages/blog/tag/_tag_.astro.mjs');
const _page4 = () => import('./pages/blog/_slug_.astro.mjs');
const _page5 = () => import('./pages/blog.astro.mjs');
const _page6 = () => import('./pages/games/_slug_.astro.mjs');
const _page7 = () => import('./pages/games.astro.mjs');
const _page8 = () => import('./pages/sitemap.xml.astro.mjs');
const _page9 = () => import('./pages/stores/_slug_.astro.mjs');
const _page10 = () => import('./pages/stores.astro.mjs');
const _page11 = () => import('./pages/tags/_slug_.astro.mjs');
const _page12 = () => import('./pages/tags/_tag_.astro.mjs');
const _page13 = () => import('./pages/tags.astro.mjs');
const _page14 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/404.astro", _page1],
    ["src/pages/blog/category/[category].astro", _page2],
    ["src/pages/blog/tag/[tag].astro", _page3],
    ["src/pages/blog/[slug].astro", _page4],
    ["src/pages/blog/index.astro", _page5],
    ["src/pages/games/[slug].astro", _page6],
    ["src/pages/games/index.astro", _page7],
    ["src/pages/sitemap.xml.ts", _page8],
    ["src/pages/stores/[slug].astro", _page9],
    ["src/pages/stores/index.astro", _page10],
    ["src/pages/tags/[slug].astro", _page11],
    ["src/pages/tags/[tag].astro", _page12],
    ["src/pages/tags/index.astro", _page13],
    ["src/pages/index.astro", _page14]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./_noop-actions.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "574b3aba-87ab-4c6b-9870-8e6326adc2d1"
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (_start in serverEntrypointModule) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { __astrojsSsrVirtualEntry as default, pageMap };
