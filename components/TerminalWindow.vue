<template>
  <div class="rounded-lg overflow-hidden border border-dark-600/50 bg-dark-800">
    <!-- Terminal header -->
    <div class="flex items-center gap-2 px-4 py-2.5 bg-dark-700 border-b border-dark-600/50">
      <div class="w-3 h-3 rounded-full bg-red-500/80" />
      <div class="w-3 h-3 rounded-full bg-yellow-500/80" />
      <div class="w-3 h-3 rounded-full bg-green-500/80" />
      <span class="ml-3 font-mono text-xs text-gray-500">{{ title || 'terminal' }}</span>
    </div>

    <!-- Terminal body -->
    <div class="p-4 font-mono text-sm leading-relaxed">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>
