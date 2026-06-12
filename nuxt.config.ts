import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

// Auto-sync posts.json to public/api for static deployment
function syncPostsToPublic() {
  const src = join(process.cwd(), 'server/data/posts.json')
  const dest = join(process.cwd(), 'public/api/posts.json')
  if (existsSync(src)) {
    mkdirSync(join(process.cwd(), 'public/api'), { recursive: true })
    writeFileSync(dest, readFileSync(src))
  }
}

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },

  hooks: {
    'build:before'() { syncPostsToPublic() },
    'prepare:types'() { syncPostsToPublic() },
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/content',
    '@nuxtjs/color-mode',
  ],

  colorMode: {
    classSuffix: '',
    preference: 'dark',
    fallback: 'dark',
  },

  css: ['~/assets/css/main.css'],

  app: {
    baseURL: '/ace-ai/',
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'Ace.AI - 产品 × AI × 创业',
      meta: [
        { name: 'description', content: 'Mr.Ace 的个人网站 | 资深产品经理、连续创业者、AI 独立开发者' },
        { name: 'theme-color', content: '#0f172a' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Inter:wght@400;500;600;700&display=swap',
        },
      ],
    },
  },

  content: {
    documentDriven: false,
    highlight: {
      theme: 'github-dark',
      langs: ['js', 'ts', 'vue', 'bash', 'json', 'python', 'css', 'html'],
    },
  },

  tailwindcss: {
    configPath: 'tailwind.config.ts',
  },

  nitro: {
    prerender: {
      routes: [
        '/',
        '/portfolio',
        '/blog',
        '/about',
        '/blog/ai-indie-hacker-playbook',
        '/blog/product-thinking-for-developers',
        '/blog/from-zero-to-mrr',
        '/blog/solo-founder-toolkit-2026',
      ],
      crawlLinks: true,
    },
  },
})
