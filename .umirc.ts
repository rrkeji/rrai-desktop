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
      path: '/',
      component: '@/layouts/side-layout',
      wrappers: ['@/wrappers/auth'],
      routes: [
        {
          path: "/chat/chatgpt",
          component: "@/pages/chat/chatgpt"
        },
        {
          path: "/browser/:src",
          component: "@/pages/browser/index"
        },
        {
          path: "/chat",
          component: "@/pages/chat/index"
        },
        {
          path: "/models",
          component: "models/index"
        },
        {
          path: "/prompts",
          component: "prompts/index"
        },
        {
          path: "/painter",
          component: "painter/index"
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
          path: "/tools",
          component: "tools/index"
        },
        {
          path: "/tools/sdinstall",
          component: "@/pages/tools/sdinstall/index"
        },
      ],
    },
  ],
  npmClient: 'pnpm',
  links: [
    { rel: 'icon', href: '/public/favicon.ico' },
  ],
  title: '软软AI',
});
