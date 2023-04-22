import { defineConfig } from "umi";
// base: './',
// publicPath: './',
export default defineConfig({
  outputPath: './dist',
  hash: true,
  history: {
    type: 'hash',
  },
  routes: [
    {
      path: '/login',
      component: '@/pages/login/index',
      layout: false
    },
    {
      path: '/tklogin',
      component: '@/pages/login/tklogin',
      layout: false
    },
    {
      path: "/home",
      component: "home/index",
      wrappers: ['@/wrappers/auth'],
    },
    {
      path: "/miniprogram",
      component: "@/pages/miniprogram/index"
    },
    {
      wrappers: ['@/wrappers/auth'],
      path: "/conversation/:conversationType",
      component: "@/pages/conversation/index"
    },
    {
      wrappers: ['@/wrappers/auth'],
      path: "/conversation/:conversationType/:conversationId",
      component: "@/pages/conversation/index"
    },
    {
      path: '/',
      component: '@/layouts/side-layout',
      wrappers: ['@/wrappers/auth'],
      routes: [
        {
          path: "/browser/:src",
          component: "@/pages/browser/index"
        },
        {
          path: "/settings/account",
          component: "@/pages/settings/account/index",
        },
        {
          path: "/settings/settings",
          component: "@/pages/settings/settings/index",
        },
        {
          path: "/settings/upgrade",
          component: "@/pages/settings/upgrade/index",
        },
        {
          path: "/settings/helper",
          component: "@/pages/settings/helper/index",
        },
        {
          path: "/settings/customerservice",
          component: "@/pages/settings/customer-service/index",
        },
        {
          path: "/tools",
          component: "tools/index"
        },
        {
          path: "/tools/sdinstall",
          component: "@/pages/tools/sdinstall/index"
        },
        {
          path: "/tools/terminal",
          component: "@/pages/tools/terminal/index"
        },
      ],
    },
  ],
  npmClient: 'pnpm',
  esbuildMinifyIIFE: true,
  links: [
    { rel: 'icon', href: '/public/favicon.ico' },
  ],
  title: '软软AI-ChatGPT、Stable-diffusion、智能对话、AIGC',
  metas: [
    { name: 'keywords', content: '软软AI, ChatGPT, 文心一言, 通义千问, stable diffusion, AIGC, AI, huggingface, civitai' },
    { name: 'description', content: '软软AI,智能 AI 体验馆。ChatGPT、Stable-diffusion、智能对话、AIGC、提示词分享、模型分享。' },
  ],
});
