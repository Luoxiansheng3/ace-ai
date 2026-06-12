<template>
  <div class="flex items-center gap-4">
    <span class="font-mono text-sm text-neon-green/60">{{ number }}.</span>
    <h2 class="text-2xl md:text-3xl font-bold text-white">{{ title }}</h2>
    <span class="hidden md:inline font-mono text-sm text-gray-600">// {{ subtitle }}</span>
    <div class="flex-1 h-px bg-dark-600/50 ml-4" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  number: string
  title: string
  subtitle: string
}>()
</script>
