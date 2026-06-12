<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const { isLoggedIn, checkAuth } = useAdmin()

const router = useRouter()

onMounted(async () => {
  await checkAuth()
  if (!isLoggedIn.value) {
    navigateTo('/admin/login')
  }
})

const posts = ref<any[]>([])
const search = ref('')
const statusFilter = ref<'all' | 'published' | 'draft'>('all')
const categoryFilter = ref('')
const loading = ref(false)

let searchTimer: ReturnType<typeof setTimeout> | null = null

const categories = computed(() => {
  const cats = new Set<string>()
  posts.value.forEach((p) => {
    if (p.category) cats.add(p.category)
  })
  return Array.from(cats).sort()
})

const filteredPosts = computed(() => {
  let list = posts.value
  if (categoryFilter.value) {
    list = list.filter((p) => p.category === categoryFilter.value)
  }
  return list
})

async function fetchPosts() {
  loading.value = true
  const params = new URLSearchParams()
  if (statusFilter.value !== 'all') params.set('status', statusFilter.value)
  if (search.value) params.set('search', search.value)
  try {
    const data = await $fetch<any>(`/api/posts?${params}`)
    posts.value = data.posts || []
  } catch (e) {
    posts.value = []
  }
  loading.value = false
}

watch(statusFilter, () => {
  fetchPosts()
})

watch(search, () => {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    fetchPosts()
  }, 300)
})

onMounted(() => {
  fetchPosts()
})

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

function statusLabel(status: string) {
  return status === 'published' ? '已发布' : '草稿'
}

async function deletePost(id: string) {
  if (!confirm('确定要删除这篇文章吗？此操作不可撤销。')) return
  try {
    await $fetch(`/api/posts/${id}`, { method: 'DELETE' })
    await fetchPosts()
  } catch (e) {
    alert('删除失败，请重试')
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#0a0a0f] font-mono text-white">
    <div class="posts-container">
    <!-- Header Bar -->
    <div class="flex items-center justify-between border-b border-[#2a2a3a] px-6 py-4">
      <h1 class="text-xl font-bold tracking-tight">
        <span class="text-[#00ff88]">$</span>
        <span class="ml-2">文章管理</span>
        <span class="ml-2 text-[#6b7280] text-sm">/ posts</span>
      </h1>
      <NuxtLink
        to="/admin/posts/new"
        class="inline-flex items-center gap-2 rounded-lg bg-[#00ff88] px-4 py-2 text-sm font-semibold text-[#0a0a0f] transition-all hover:bg-[#00ff88]/90 hover:shadow-[0_0_20px_rgba(0,255,136,0.3)]"
      >
        <span>+</span>
        <span>新建文章</span>
      </NuxtLink>
    </div>

    <!-- Filter / Search Bar -->
    <div class="flex flex-wrap items-center gap-4 border-b border-[#2a2a3a] px-6 py-3">
      <!-- Search Input -->
      <div class="relative flex-1 min-w-[220px] max-w-md">
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280] text-sm">⌕</span>
        <input
          v-model="search"
          type="text"
          placeholder="搜索文章..."
          class="w-full rounded-lg border border-[#2a2a3a] bg-[#12121a] py-2 pl-9 pr-4 text-sm text-white placeholder-[#6b7280] outline-none transition-colors focus:border-[#00ff88]/50 focus:ring-1 focus:ring-[#00ff88]/20"
        />
      </div>

      <!-- Status Filter Buttons -->
      <div class="flex rounded-lg border border-[#2a2a3a] overflow-hidden">
        <button
          @click="statusFilter = 'all'"
          :class="[
            'px-3 py-1.5 text-xs font-medium transition-colors',
            statusFilter === 'all'
              ? 'bg-[#00ff88]/10 text-[#00ff88] border-r border-[#00ff88]/30'
              : 'bg-[#12121a] text-[#9ca3af] border-r border-[#2a2a3a] hover:text-white'
          ]"
        >
          全部
        </button>
        <button
          @click="statusFilter = 'published'"
          :class="[
            'px-3 py-1.5 text-xs font-medium transition-colors',
            statusFilter === 'published'
              ? 'bg-[#00ff88]/10 text-[#00ff88] border-r border-[#00ff88]/30'
              : 'bg-[#12121a] text-[#9ca3af] border-r border-[#2a2a3a] hover:text-white'
          ]"
        >
          已发布
        </button>
        <button
          @click="statusFilter = 'draft'"
          :class="[
            'px-3 py-1.5 text-xs font-medium transition-colors',
            statusFilter === 'draft'
              ? 'bg-[#00ff88]/10 text-[#00ff88]'
              : 'bg-[#12121a] text-[#9ca3af] hover:text-white'
          ]"
        >
          草稿
        </button>
      </div>

      <!-- Category Filter -->
      <select
        v-if="categories.length > 0"
        v-model="categoryFilter"
        class="rounded-lg border border-[#2a2a3a] bg-[#12121a] px-3 py-1.5 text-xs text-[#9ca3af] outline-none transition-colors focus:border-[#00ff88]/50"
      >
        <option value="">全部分类</option>
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>
    </div>

    <!-- Posts List -->
    <div class="px-6 py-4">
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="flex items-center gap-3 text-[#6b7280]">
          <span class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-[#2a2a3a] border-t-[#00ff88]"></span>
          <span class="text-sm">Loading posts...</span>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="filteredPosts.length === 0"
        class="flex flex-col items-center justify-center py-20 text-center"
      >
        <div class="rounded-lg border border-[#2a2a3a] bg-[#161622] px-8 py-6 max-w-md">
          <p class="text-sm text-[#6b7280] mb-1">
            <span class="text-[#00ff88]">$</span> ls posts/
          </p>
          <p class="text-sm text-[#9ca3af] mb-6">
            → No posts found
          </p>
          <NuxtLink
            to="/admin/posts/new"
            class="inline-flex items-center gap-2 rounded-lg border border-[#00ff88]/30 bg-[#00ff88]/5 px-4 py-2 text-sm text-[#00ff88] transition-all hover:bg-[#00ff88]/10 hover:border-[#00ff88]/50"
          >
            <span>+</span>
            <span>创建第一篇文章</span>
          </NuxtLink>
        </div>
      </div>

      <!-- Posts Grid -->
      <div v-else class="space-y-3">
        <div
          v-for="post in filteredPosts"
          :key="post.id"
          class="group rounded-lg border border-[#2a2a3a] bg-[#161622] p-5 transition-all duration-200 hover:border-[#00ff88]/40"
        >
          <div class="flex items-start justify-between gap-4">
            <!-- Post Info -->
            <div class="flex-1 min-w-0">
              <!-- Title -->
              <h3 class="text-base font-bold text-white mb-1.5 truncate">
                {{ post.title || 'Untitled' }}
              </h3>

              <!-- Summary -->
              <p
                v-if="post.summary"
                class="text-sm text-[#9ca3af] mb-3 line-clamp-2 leading-relaxed"
              >
                {{ post.summary }}
              </p>

              <!-- Meta Row -->
              <div class="flex flex-wrap items-center gap-2 text-xs">
                <!-- Category Badge -->
                <span
                  v-if="post.category"
                  class="inline-flex items-center rounded-md border border-[#00ff88]/30 bg-[#00ff88]/5 px-2 py-0.5 text-[#00ff88]"
                >
                  {{ post.category }}
                </span>

                <!-- Tags -->
                <span
                  v-for="tag in (post.tags || []).slice(0, 3)"
                  :key="tag"
                  class="inline-flex items-center rounded-md bg-[#1a1a2e] px-2 py-0.5 text-[#6b7280]"
                >
                  #{{ tag }}
                </span>
                <span
                  v-if="(post.tags || []).length > 3"
                  class="text-[#6b7280]"
                >
                  +{{ post.tags.length - 3 }}
                </span>

                <!-- Separator -->
                <span class="text-[#2a2a3a]">|</span>

                <!-- Status Badge -->
                <span
                  :class="[
                    'inline-flex items-center rounded-md px-2 py-0.5 font-medium',
                    post.status === 'published'
                      ? 'bg-[#00ff88]/10 text-[#00ff88]'
                      : 'bg-[#a855f7]/10 text-[#a855f7]'
                  ]"
                >
                  {{ statusLabel(post.status) }}
                </span>

                <!-- Separator -->
                <span class="text-[#2a2a3a]">|</span>

                <!-- Date -->
                <span class="text-[#6b7280]">
                  {{ formatDate(post.publishTime || post.createdAt) }}
                </span>

                <!-- Read Time -->
                <span v-if="post.readTime" class="text-[#6b7280]">
                  · {{ post.readTime }} min read
                </span>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center gap-2 shrink-0">
              <NuxtLink
                :to="{ path: '/admin/posts/new', query: { id: post.id } }"
                class="rounded-md border border-[#38bdf8]/30 bg-[#38bdf8]/5 px-3 py-1.5 text-xs font-medium text-[#38bdf8] transition-all hover:bg-[#38bdf8]/10 hover:border-[#38bdf8]/50"
              >
                编辑
              </NuxtLink>
              <NuxtLink
                :to="`/blog/${post.slug}`"
                target="_blank"
                class="rounded-md border border-[#2a2a3a] bg-[#1a1a2e] px-3 py-1.5 text-xs font-medium text-[#9ca3af] transition-all hover:text-white hover:border-[#9ca3af]"
              >
                预览
              </NuxtLink>
              <button
                @click="deletePost(post.id)"
                class="rounded-md border border-[#ef4444]/30 bg-[#ef4444]/5 px-3 py-1.5 text-xs font-medium text-[#ef4444] transition-all hover:bg-[#ef4444]/10 hover:border-[#ef4444]/50"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Post count -->
      <div v-if="filteredPosts.length > 0" class="mt-4 text-xs text-[#6b7280]">
        <span class="text-[#00ff88]">$</span> echo {{ filteredPosts.length }} posts found
      </div>
    </div>
    </div>
  </div>
</template>

<style scoped>
.posts-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px 0;
  display: flex;
  flex-direction: column;
  gap: 0;
}
</style>
