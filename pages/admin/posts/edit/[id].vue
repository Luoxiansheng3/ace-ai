<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const route = useRoute()
const id = route.params.id as string

navigateTo({ path: '/admin/posts/new', query: { id } }, { replace: true })
</script>

<template>
  <div class="min-h-screen bg-[#0a0a0f] p-6 text-[#6b7280] font-mono flex items-center justify-center">
    <span class="text-sm">
      <span class="text-[#00ff88]">$</span> redirecting to editor...
    </span>
  </div>
</template>
