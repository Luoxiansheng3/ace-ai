<template>
  <NuxtLink :to="`/blog/${slug}`" class="card-dark p-6 block group">
    <!-- Date and reading time -->
    <div class="flex items-center gap-3 mb-3 font-mono text-xs text-gray-500">
      <time>{{ formatDate(date) }}</time>
      <span class="text-dark-500">//</span>
      <span>{{ readTime }} min read</span>
    </div>

    <!-- Title -->
    <h3 class="font-bold text-white text-lg mb-2 group-hover:text-neon-green transition-colors">
      {{ title }}
    </h3>

    <!-- Description -->
    <p class="text-gray-400 text-sm mb-4 line-clamp-2">{{ description }}</p>

    <!-- Tags -->
    <div class="flex flex-wrap gap-2">
      <span v-for="tag in tags" :key="tag" class="tag">{{ tag }}</span>
    </div>

    <!-- Read more indicator -->
    <div class="mt-4 font-mono text-xs text-neon-green/60 group-hover:text-neon-green transition-colors">
      read_more <span class="inline-block group-hover:translate-x-1 transition-transform">&rarr;</span>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{
  slug: string
  title: string
  description: string
  date: string
  readTime: number
  tags: string[]
}>()

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}
</script>
