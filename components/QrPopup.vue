<template>
  <div class="relative inline-block" @mouseenter="show" @mouseleave="hide">
    <span class="text-gray-400 hover:text-neon-green transition-colors font-mono text-sm cursor-pointer">
      <slot />
    </span>

    <Teleport to="body">
      <Transition name="popup-fade">
        <div
          v-if="visible"
          ref="popupRef"
          class="fixed z-[9999] pointer-events-none"
          :style="popupStyle"
        >
          <!-- Card -->
          <div class="bg-[#1a1a2e] border border-[#2a2a3a] rounded-lg shadow-xl" :class="cardClass">
            <img
              v-if="resolvedImage"
              :src="resolvedImage"
              :alt="imageAlt"
              class="w-full rounded object-cover"
            />
            <slot v-else name="content" />
            <p v-if="label" class="text-xs text-center text-gray-500 mt-1.5 pb-1">{{ label }}</p>
          </div>
          <!-- Arrow (pointing down) -->
          <div class="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-[#2a2a3a]" />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  imageSrc?: string
  imageAlt?: string
  label?: string
  cardClass?: string
}>()

const visible = ref(false)
const popupRef = ref<HTMLElement>()
const triggerRef = ref<HTMLElement>()
const pos = ref({ left: 0, bottom: 0 })

const baseURL = useRuntimeConfig().app.baseURL
const resolvedImage = computed(() => {
  if (!props.imageSrc) return ''
  if (props.imageSrc.startsWith('http')) return props.imageSrc
  return (baseURL + props.imageSrc).replace(/\/\//g, '/')
})

const popupStyle = computed(() => ({
  left: `${pos.value.left}px`,
  bottom: `${pos.value.bottom}px`,
  transform: 'translateX(-50%)',
}))

const cardClass = computed(() => props.cardClass || 'p-1.5 w-[220px]')

function show(event: MouseEvent) {
  const el = (event.currentTarget as HTMLElement)
  triggerRef.value = el
  const rect = el.getBoundingClientRect()
  pos.value = {
    left: rect.left + rect.width / 2,
    bottom: window.innerHeight - rect.top + 12,
  }
  visible.value = true
}

function hide() {
  visible.value = false
}
</script>

<style scoped>
.popup-fade-enter-active,
.popup-fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.popup-fade-enter-from,
.popup-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(4px);
}
</style>
