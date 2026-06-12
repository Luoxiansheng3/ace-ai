<template>
  <div class="max-w-6xl mx-auto px-6 py-16">
    <!-- Page header -->
    <div class="mb-12 animate-fade-in">
      <SectionTitle number="03" title="博客" subtitle="blog" />
      <p class="text-gray-400 mt-4 max-w-2xl">
        记录创业思考、产品方法论和 AI 开发实战。用文字复盘经验，用产品验证想法。
      </p>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-20 font-mono text-gray-500">
      <span class="text-neon-green">$</span> loading posts...<span class="cursor-blink text-neon-green ml-0.5">|</span>
    </div>

    <!-- Blog posts list -->
    <div v-else class="grid md:grid-cols-2 gap-6">
      <BlogCard
        v-for="(post, i) in posts"
        :key="post.slug"
        :slug="post.slug"
        :title="post.title"
        :description="post.summary"
        :date="post.publishTime"
        :read-time="post.readTime"
        :tags="post.tags"
        class="animate-slide-up"
        :style="{ animationDelay: `${i * 0.1}s` }"
      />
    </div>

    <!-- Empty state -->
    <div v-if="!loading && posts.length === 0" class="text-center py-20">
      <TerminalWindow title="~/blog" class="max-w-md mx-auto">
        <p class="text-gray-400">
          <span class="text-neon-green">$</span> ls -la posts/<br>
          <span class="text-gray-500">No published articles yet.</span><br>
          <span class="text-gray-500">// 前往后台发布文章</span><span class="cursor-blink text-neon-green ml-0.5">|</span>
        </p>
      </TerminalWindow>
    </div>

    <!-- Blog footer -->
    <div v-else class="mt-16 text-center">
      <TerminalWindow title="~/blog" class="max-w-md mx-auto">
        <p class="text-gray-400">
          <span class="text-neon-green">$</span> ls -la posts/<br>
          <span class="text-gray-500">total {{ posts.length }} articles</span><br>
          <span class="text-gray-500">// More coming soon...</span><span class="cursor-blink text-neon-green ml-0.5">|</span>
        </p>
      </TerminalWindow>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: '博客 | Ace.AI' })

const { data, pending } = await useAsyncData('blog-posts', async () => {
  // Try server API first (works in dev mode with Nitro server)
  try {
    return await $fetch('/api/posts', { params: { status: 'published' } })
  } catch {
    // Fallback to static JSON file (works in static/GitHub Pages deployment)
    try {
      const staticData = await $fetch('/api/posts.json') as any
      const published = (staticData.posts || []).filter((p: any) => p.status === 'published')
      published.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      return { posts: published, total: published.length }
    } catch {
      return { posts: [], total: 0 }
    }
  }
})

const posts = computed(() => (data.value as any)?.posts || [])
const loading = computed(() => pending.value)
</script>
