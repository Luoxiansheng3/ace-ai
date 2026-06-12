<template>
  <div class="min-h-screen flex flex-col bg-dark-900 relative">
    <!-- Animated background grid -->
    <div class="fixed inset-0 bg-grid opacity-20 pointer-events-none z-0" />

    <!-- Glow orb background -->
    <div class="fixed top-1/4 left-1/4 w-96 h-96 bg-neon-green/5 rounded-full blur-3xl pointer-events-none animate-float" />
    <div class="fixed bottom-1/4 right-1/4 w-96 h-96 bg-neon-blue/5 rounded-full blur-3xl pointer-events-none animate-float" style="animation-delay: -3s;" />

    <NavBar />

    <main class="flex-1 relative z-20">
      <slot />
    </main>

    <FooterBar />
  </div>
</template>

<script setup lang="ts">
</script>
