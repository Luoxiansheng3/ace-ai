<template>
  <div class="max-w-3xl mx-auto px-6 py-16">
    <!-- Loading -->
    <div v-if="loading" class="text-center py-20 font-mono text-gray-500">
      <span class="text-neon-green">$</span> loading article...<span class="cursor-blink text-neon-green ml-0.5">|</span>
    </div>

    <!-- Error -->
    <div v-else-if="!article" class="text-center py-20">
      <TerminalWindow title="~/error" class="max-w-md mx-auto">
        <p class="text-gray-400">
          <span class="text-red-400">$</span> cat article.md<br>
          <span class="text-red-400">Error: Article not found</span><br>
          <span class="text-gray-500">// 文章不存在或尚未发布</span>
        </p>
      </TerminalWindow>
      <NuxtLink to="/blog" class="btn-neon inline-block mt-8">
        &larr; 返回博客列表
      </NuxtLink>
    </div>

    <!-- Article -->
    <article v-else class="animate-fade-in">
      <!-- Back link -->
      <NuxtLink to="/blog" class="inline-flex items-center gap-2 font-mono text-sm text-gray-500 hover:text-neon-green transition-colors mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        cd ../blog
      </NuxtLink>

      <!-- Cover image -->
      <div v-if="article.coverImage" class="mb-8 rounded-lg overflow-hidden border border-dark-600/50">
        <img :src="article.coverImage" :alt="article.title" class="w-full h-64 object-cover" />
      </div>

      <!-- Header -->
      <header class="mb-10">
        <div class="flex items-center gap-3 mb-4 font-mono text-sm text-gray-500">
          <time>{{ formatDate(article.publishTime) }}</time>
          <span class="text-dark-500">//</span>
          <span>{{ article.readTime }} min read</span>
          <span class="text-dark-500">//</span>
          <span class="text-neon-green/60">{{ article.category }}</span>
        </div>

        <h1 class="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
          {{ article.title }}
        </h1>

        <p class="text-gray-400 text-lg">{{ article.summary }}</p>

        <div class="flex flex-wrap gap-2 mt-4">
          <span v-for="tag in article.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </header>

      <!-- Content -->
      <div class="prose-dark" v-html="renderedBody" />

      <!-- Footer -->
      <footer class="mt-16 pt-8 border-t border-dark-600/30">
        <TerminalWindow title="~/feedback" class="mb-8">
          <p class="text-gray-400">
            <span class="text-neon-green">$</span> echo "Thanks for reading!"<br>
            <span class="text-white">Thanks for reading!</span><br>
            <span class="text-neon-green">$</span> <span class="cursor-blink text-neon-green">_</span>
          </p>
        </TerminalWindow>

        <div class="flex justify-between items-center">
          <NuxtLink to="/blog" class="btn-neon text-sm">
            &larr; 返回博客列表
          </NuxtLink>
        </div>
      </footer>
    </article>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

const { renderMarkdown } = useMarkdown()

const { data, pending } = await useAsyncData(`blog-post-${slug}`, async () => {
  // Try server API first (works in dev mode with Nitro server)
  try {
    return await $fetch(`/api/posts-by-slug/${slug}`)
  } catch {
    // Fallback to static JSON file (works in static/GitHub Pages deployment)
    try {
      const staticData = await $fetch('/api/posts.json') as any
      const post = (staticData.posts || []).find((p: any) => p.slug === slug && p.status === 'published')
      return post || null
    } catch {
      return null
    }
  }
})

const article = computed(() => data.value || null)
const loading = computed(() => pending.value)

const renderedBody = computed(() => {
  if (!article.value?.body) return ''
  return renderMarkdown(article.value.body)
})

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

useHead({
  title: () => article.value ? `${article.value.title} | Ace.AI` : 'Blog | Ace.AI',
})
</script>
