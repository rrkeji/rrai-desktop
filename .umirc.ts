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
      wrappers: ['@/wrappers/auth'],
      path: "/rrapp/:datasetId/:id",
      component: "@/pages/rrapp/index"
    },
    {
      wrappers: ['@/wrappers/auth'],
      path: "/storage",
      component: "@/pages/storage/index"
    },
    {
      wrappers: ['@/wrappers/auth'],
      path: "/containers",
      component: "@/pages/containers/index"
    },
    {
      wrappers: ['@/wrappers/auth'],
      path: "/discovery",
      component: "@/pages/discovery/index"
    },
    {
      path: '/ghost',
      component: '@/layouts/empty',
      layout: false,
      routes: [
        {
          path: 'forbid',
          component: '@/pages/forbid/index',
        },
      ]
    },
    {
      path: '/',
      component: '@/pages/settings/index',
      wrappers: ['@/wrappers/auth'],
      routes: [
        {
          path: "/settings/account",
          component: "@/pages/settings/account/index",
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
          path: "/settings/feedback",
          component: "@/pages/settings/feedback/index",
        },
        {
          path: "/settings/about",
          component: "@/pages/settings/about/index",
        },
        {
          path: "/settings/customerservice",
          component: "@/pages/settings/customer-service/index",
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
