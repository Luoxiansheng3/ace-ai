<template>
  <div class="card-dark p-6 flex flex-col h-full">
    <!-- Project image/thumbnail -->
    <div class="relative overflow-hidden rounded-md mb-4 aspect-video bg-dark-700">
      <img
        v-if="image"
        :src="resolveImage(image)"
        :alt="title"
        class="absolute inset-0 w-full h-full object-cover"
      />
      <div v-else class="absolute inset-0 flex items-center justify-center">
        <div class="text-center">
          <div class="text-3xl mb-2 font-mono text-neon-green/60">{{ icon }}</div>
          <div class="font-mono text-xs text-gray-500">// {{ subtitle }}</div>
        </div>
      </div>
      <!-- Overlay on hover -->
      <div class="absolute inset-0 bg-neon-green/5 opacity-0 hover:opacity-100 transition-opacity duration-300" />
    </div>

    <!-- Title -->
    <h3 class="font-bold text-white text-lg mb-2">{{ title }}</h3>

    <!-- Description -->
    <p class="text-gray-400 text-sm flex-1 mb-4">{{ description }}</p>

    <!-- Tags -->
    <div class="flex flex-wrap gap-2 mb-4">
      <span v-for="tag in tags" :key="tag" class="tag">{{ tag }}</span>
    </div>

    <!-- Links -->
    <div class="flex items-center gap-4 pt-2 border-t border-dark-600/30">
      <a
        v-if="liveUrl"
        :href="liveUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="font-mono text-xs text-neon-green hover:underline flex items-center gap-1"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
        Live Demo
      </a>
      <a
        v-if="repoUrl"
        :href="repoUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="font-mono text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
        Source
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description: string
  tags: string[]
  icon?: string
  subtitle?: string
  image?: string
  liveUrl?: string
  repoUrl?: string
}>()

const baseURL = useRuntimeConfig().app.baseURL

function resolveImage(path?: string) {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return (baseURL + path).replace(/\/\//g, '/')
}
</script>
