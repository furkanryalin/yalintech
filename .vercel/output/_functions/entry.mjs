import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_Brt4o02Q.mjs';
import { manifest } from './manifest_9fjNv-uU.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/404.astro.mjs');
const _page2 = () => import('./pages/about.astro.mjs');
const _page3 = () => import('./pages/admin.astro.mjs');
const _page4 = () => import('./pages/api/admin/comments/_id_.astro.mjs');
const _page5 = () => import('./pages/api/admin/comments.astro.mjs');
const _page6 = () => import('./pages/api/admin/login.astro.mjs');
const _page7 = () => import('./pages/api/admin/status.astro.mjs');
const _page8 = () => import('./pages/api/admin/users/_id_.astro.mjs');
const _page9 = () => import('./pages/api/admin/users.astro.mjs');
const _page10 = () => import('./pages/api/auth/check.astro.mjs');
const _page11 = () => import('./pages/api/auth/register.astro.mjs');
const _page12 = () => import('./pages/api/auth/resend-request.astro.mjs');
const _page13 = () => import('./pages/api/comments.astro.mjs');
const _page14 = () => import('./pages/api/contact.astro.mjs');
const _page15 = () => import('./pages/api/messages/_id_.astro.mjs');
const _page16 = () => import('./pages/api/messages.astro.mjs');
const _page17 = () => import('./pages/api/register-profile.astro.mjs');
const _page18 = () => import('./pages/cerez.astro.mjs');
const _page19 = () => import('./pages/contact.astro.mjs');
const _page20 = () => import('./pages/gizlilik.astro.mjs');
const _page21 = () => import('./pages/kullanim-sartlari.astro.mjs');
const _page22 = () => import('./pages/kvkk.astro.mjs');
const _page23 = () => import('./pages/login.astro.mjs');
const _page24 = () => import('./pages/projects.astro.mjs');
const _page25 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/404.astro", _page1],
    ["src/pages/about.astro", _page2],
    ["src/pages/admin/index.astro", _page3],
    ["src/pages/api/admin/comments/[id].ts", _page4],
    ["src/pages/api/admin/comments.ts", _page5],
    ["src/pages/api/admin/login.ts", _page6],
    ["src/pages/api/admin/status.ts", _page7],
    ["src/pages/api/admin/users/[id].ts", _page8],
    ["src/pages/api/admin/users.ts", _page9],
    ["src/pages/api/auth/check.ts", _page10],
    ["src/pages/api/auth/register.ts", _page11],
    ["src/pages/api/auth/resend-request.ts", _page12],
    ["src/pages/api/comments.ts", _page13],
    ["src/pages/api/contact.ts", _page14],
    ["src/pages/api/messages/[id].ts", _page15],
    ["src/pages/api/messages.ts", _page16],
    ["src/pages/api/register-profile.ts", _page17],
    ["src/pages/cerez.astro", _page18],
    ["src/pages/contact.astro", _page19],
    ["src/pages/gizlilik.astro", _page20],
    ["src/pages/kullanim-sartlari.astro", _page21],
    ["src/pages/kvkk.astro", _page22],
    ["src/pages/login.astro", _page23],
    ["src/pages/projects.astro", _page24],
    ["src/pages/index.astro", _page25]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "87aba81a-d213-4f5c-9c2c-3de662f12259",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
