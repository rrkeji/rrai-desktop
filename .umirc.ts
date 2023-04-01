import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    {
      path: '/login',
      component: 'login',
      layout: false
    },
    {
      path: '/',
      wrappers: ['@/wrappers/auth'],
      routes: [
        {
          path: "/chat",
          component: "@/pages/chat/index"
        },
        {
          path: "/home",
          component: "home/index"
        },
        {
          path: "/models",
          component: "models/index"
        },
        {
          path: "/painter",
          component: "painter/index"
        },
        {
          path: "/settings",
          component: "settings/index"
        },
        {
          path: "/tools",
          component: "tools/index"
        },
      ],
    },
  ],
  npmClient: 'yarn',
  links: [
    { rel: 'icon', href: '/public/favicon.ico' },
  ],
  title: '软软AI',
});
