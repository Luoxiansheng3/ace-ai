<template>
  <nav class="sticky top-0 z-50 bg-dark-900/80 backdrop-blur-xl border-b border-dark-600/30">
    <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-2 group">
        <span class="text-neon-green font-mono text-lg font-bold">&lt;</span>
        <span class="font-mono font-bold text-white group-hover:text-neon-green transition-colors">
          {{ siteName }}
        </span>
        <span class="text-neon-green font-mono text-lg font-bold">/&gt;</span>
      </NuxtLink>

      <!-- Desktop Nav Links -->
      <div class="hidden md:flex items-center gap-8">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="font-mono text-sm text-gray-400 hover:text-neon-green transition-colors relative group"
          active-class="text-neon-green"
        >
          <span class="text-neon-green/60 mr-1">{{ link.prefix }}</span>
          {{ link.label }}
          <span class="absolute -bottom-1 left-0 w-0 h-px bg-neon-green group-hover:w-full transition-all duration-300" />
        </NuxtLink>
      </div>

      <!-- Mobile menu button -->
      <button
        class="md:hidden text-gray-400 hover:text-neon-green transition-colors"
        @click="mobileOpen = !mobileOpen"
      >
        <svg v-if="!mobileOpen" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Mobile menu -->
    <Transition name="slide-down">
      <div v-if="mobileOpen" class="md:hidden bg-dark-800/95 backdrop-blur-xl border-b border-dark-600/30 px-6 pb-4">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="block py-2 font-mono text-sm text-gray-400 hover:text-neon-green transition-colors"
          active-class="text-neon-green"
          @click="mobileOpen = false"
        >
          <span class="text-neon-green/60 mr-1">{{ link.prefix }}</span>
          {{ link.label }}
        </NuxtLink>
      </div>
    </Transition>
  </nav>
</template>

<script setup lang="ts">
const siteName = 'Ace.AI'

const navLinks = [
  { to: '/', label: '首页', prefix: '01.' },
  { to: '/portfolio', label: '作品集', prefix: '02.' },
  { to: '/blog', label: '博客', prefix: '03.' },
  { to: '/about', label: '关于', prefix: '04.' },
]

const mobileOpen = ref(false)
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
