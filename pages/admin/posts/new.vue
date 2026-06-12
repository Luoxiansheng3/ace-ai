<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const route = useRoute()
const { isLoggedIn, checkAuth } = useAdmin()
const { calculateReadTime, generateSlug } = useMarkdown()

onMounted(async () => {
  await checkAuth()
  if (!isLoggedIn.value) {
    navigateTo('/admin/login')
  }
})

const post = reactive({
  id: '',
  title: '',
  slug: '',
  body: '',
  summary: '',
  coverImage: '',
  category: '',
  tags: [] as string[],
  status: 'draft',
  publishTime: new Date().toISOString().split('T')[0],
  readTime: 1,
})

const isEditing = ref(false)
const saving = ref(false)
const showPreview = ref(false)
const saveMessage = ref('')
const tagInput = ref('')

// Auto-generate slug when title changes (only for new posts)
watch(
  () => post.title,
  (newTitle) => {
    if (newTitle && !isEditing.value) {
      post.slug = generateSlug(newTitle)
    }
  }
)

// Auto-calculate read time when body changes
watch(
  () => post.body,
  (newBody) => {
    post.readTime = calculateReadTime(newBody)
  }
)

// Load existing post if editing
onMounted(async () => {
  const editId = route.query.id as string
  if (editId) {
    isEditing.value = true
    try {
      const data = await $fetch<any>(`/api/posts/${editId}`)
      Object.assign(post, data)
    } catch (e) {
      alert('文章未找到')
      navigateTo('/admin/posts')
    }
  }
})

// --- Tag Management ---
function addTag() {
  const tag = tagInput.value.trim()
  if (tag && !post.tags.includes(tag)) {
    post.tags.push(tag)
  }
  tagInput.value = ''
}

function removeTag(tag: string) {
  post.tags = post.tags.filter((t) => t !== tag)
}

function onTagKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    e.preventDefault()
    addTag()
  }
}

// --- Save Functions ---
async function saveDraft() {
  post.status = 'draft'
  await savePost()
}

async function publishPost() {
  if (!post.title.trim()) {
    alert('请输入文章标题')
    return
  }
  post.status = 'published'
  await savePost()
}

async function savePost() {
  saving.value = true
  saveMessage.value = ''
  try {
    if (isEditing.value && post.id) {
      await $fetch(`/api/posts/${post.id}`, { method: 'PUT', body: post })
      saveMessage.value = '已保存'
    } else {
      const created = await $fetch<any>('/api/posts', { method: 'POST', body: post })
      post.id = created.id
      isEditing.value = true
      saveMessage.value = '已创建'
    }
    // Clear message after 3s
    setTimeout(() => { saveMessage.value = '' }, 3000)
  } catch (e) {
    alert('保存失败，请重试')
  }
  saving.value = false
}

// --- Preview ---
const { renderMarkdown } = useMarkdown()

const previewHtml = computed(() => {
  return renderMarkdown(post.body)
})

function closePreview() {
  showPreview.value = false
}

// Summary char counter
const summaryCount = computed(() => post.summary.length)
</script>

<template>
  <div class="min-h-screen bg-[#0a0a0f] font-mono text-white">
    <!-- Header -->
    <div class="flex items-center justify-between border-b border-[#2a2a3a] px-6 py-4">
      <div class="flex items-center gap-4">
        <NuxtLink
          to="/admin/posts"
          class="text-sm text-[#9ca3af] transition-colors hover:text-[#00ff88]"
        >
          ← 返回列表
        </NuxtLink>
        <h1 class="text-lg font-bold tracking-tight">
          <span class="text-[#00ff88]">$</span>
          <span class="ml-2">{{ isEditing ? '编辑文章' : '新建文章' }}</span>
        </h1>
      </div>

      <div class="flex items-center gap-3">
        <!-- Save feedback -->
        <span
          v-if="saveMessage"
          class="text-xs text-[#00ff88] animate-pulse"
        >
          ✓ {{ saveMessage }}
        </span>

        <!-- Saving indicator -->
        <span
          v-if="saving"
          class="text-xs text-[#6b7280]"
        >
          saving...
        </span>

        <button
          @click="saveDraft"
          :disabled="saving"
          class="rounded-lg border border-[#2a2a3a] bg-[#12121a] px-4 py-2 text-sm text-[#9ca3af] transition-all hover:border-[#9ca3af] hover:text-white disabled:opacity-50"
        >
          保存草稿
        </button>

        <button
          @click="showPreview = true"
          class="rounded-lg border border-[#a855f7]/30 bg-[#a855f7]/5 px-4 py-2 text-sm text-[#a855f7] transition-all hover:bg-[#a855f7]/10 hover:border-[#a855f7]/50"
        >
          预览
        </button>

        <button
          @click="publishPost"
          :disabled="saving"
          class="rounded-lg bg-[#00ff88] px-4 py-2 text-sm font-semibold text-[#0a0a0f] transition-all hover:bg-[#00ff88]/90 hover:shadow-[0_0_20px_rgba(0,255,136,0.3)] disabled:opacity-50"
        >
          发布
        </button>
      </div>
    </div>

    <!-- Main Content: Two Columns -->
    <div class="flex gap-6 p-6">
      <!-- Left Column: Editor (70%) -->
      <div class="flex-1 min-w-0 space-y-4" style="flex: 0 0 70%; max-width: 70%;">
        <!-- Title Input -->
        <input
          v-model="post.title"
          type="text"
          placeholder="文章标题"
          class="w-full rounded-lg border border-[#2a2a3a] bg-[#12121a] px-4 py-3 text-xl font-bold text-white placeholder-[#6b7280] outline-none transition-colors focus:border-[#00ff88]/50 focus:ring-1 focus:ring-[#00ff88]/20"
        />

        <!-- Slug Field -->
        <div class="flex items-center gap-2">
          <span class="text-xs text-[#6b7280] shrink-0">/blog/</span>
          <input
            v-model="post.slug"
            type="text"
            placeholder="post-slug"
            class="flex-1 rounded-lg border border-[#2a2a3a] bg-[#12121a] px-3 py-1.5 text-xs text-[#9ca3af] placeholder-[#6b7280] outline-none transition-colors focus:border-[#00ff88]/50"
          />
        </div>

        <!-- Markdown Editor -->
        <div class="rounded-lg border border-[#2a2a3a] bg-[#161622]">
          <div class="flex items-center gap-2 border-b border-[#2a2a3a] px-4 py-2">
            <span class="h-2.5 w-2.5 rounded-full bg-[#ef4444]/60"></span>
            <span class="h-2.5 w-2.5 rounded-full bg-yellow-500/60"></span>
            <span class="h-2.5 w-2.5 rounded-full bg-[#00ff88]/60"></span>
            <span class="ml-2 text-xs text-[#6b7280]">editor.md</span>
          </div>
          <MarkdownEditor v-model="post.body" />
        </div>
      </div>

      <!-- Right Column: Metadata (28%) -->
      <div class="space-y-4" style="flex: 0 0 28%; max-width: 28%;">
        <!-- Metadata Panel -->
        <div class="rounded-lg border border-[#2a2a3a] bg-[#161622] p-5 space-y-5">
          <h2 class="text-xs font-semibold text-[#6b7280] uppercase tracking-widest">
            <span class="text-[#00ff88]">▸</span> Metadata
          </h2>

          <!-- Status -->
          <div class="space-y-1.5">
            <label class="block text-xs text-[#9ca3af]">状态</label>
            <select
              v-model="post.status"
              class="w-full rounded-lg border border-[#2a2a3a] bg-[#12121a] px-3 py-2 text-sm text-white outline-none transition-colors focus:border-[#00ff88]/50"
            >
              <option value="draft">草稿</option>
              <option value="published">已发布</option>
            </select>
          </div>

          <!-- Category -->
          <div class="space-y-1.5">
            <label class="block text-xs text-[#9ca3af]">分类</label>
            <input
              v-model="post.category"
              type="text"
              placeholder="例如：技术、随笔"
              class="w-full rounded-lg border border-[#2a2a3a] bg-[#12121a] px-3 py-2 text-sm text-white placeholder-[#6b7280] outline-none transition-colors focus:border-[#00ff88]/50"
            />
          </div>

          <!-- Tags -->
          <div class="space-y-1.5">
            <label class="block text-xs text-[#9ca3af]">标签</label>
            <div class="flex flex-wrap gap-1.5 mb-2">
              <span
                v-for="tag in post.tags"
                :key="tag"
                class="inline-flex items-center gap-1 rounded-md bg-[#1a1a2e] border border-[#2a2a3a] px-2 py-0.5 text-xs text-[#9ca3af]"
              >
                #{{ tag }}
                <button
                  @click="removeTag(tag)"
                  class="text-[#6b7280] hover:text-[#ef4444] transition-colors ml-0.5"
                >
                  ×
                </button>
              </span>
            </div>
            <input
              v-model="tagInput"
              @keydown="onTagKeydown"
              type="text"
              placeholder="输入标签后按 Enter"
              class="w-full rounded-lg border border-[#2a2a3a] bg-[#12121a] px-3 py-2 text-sm text-white placeholder-[#6b7280] outline-none transition-colors focus:border-[#00ff88]/50"
            />
          </div>

          <!-- Cover Image -->
          <div class="space-y-1.5">
            <label class="block text-xs text-[#9ca3af]">封面图片 URL</label>
            <input
              v-model="post.coverImage"
              type="text"
              placeholder="https://..."
              class="w-full rounded-lg border border-[#2a2a3a] bg-[#12121a] px-3 py-2 text-sm text-white placeholder-[#6b7280] outline-none transition-colors focus:border-[#00ff88]/50"
            />
            <div
              v-if="post.coverImage"
              class="mt-2 rounded-md border border-[#2a2a3a] overflow-hidden"
            >
              <img
                :src="post.coverImage"
                alt="Cover preview"
                class="w-full h-24 object-cover"
                @error="($event.target as HTMLImageElement).style.display = 'none'"
              />
            </div>
          </div>

          <!-- Publish Time -->
          <div class="space-y-1.5">
            <label class="block text-xs text-[#9ca3af]">发布时间</label>
            <input
              v-model="post.publishTime"
              type="date"
              class="w-full rounded-lg border border-[#2a2a3a] bg-[#12121a] px-3 py-2 text-sm text-white outline-none transition-colors focus:border-[#00ff88]/50 [color-scheme:dark]"
            />
          </div>

          <!-- Read Time (display only) -->
          <div class="space-y-1.5">
            <label class="block text-xs text-[#9ca3af]">阅读时间</label>
            <div class="rounded-lg border border-[#2a2a3a] bg-[#12121a] px-3 py-2 text-sm text-[#6b7280]">
              {{ post.readTime }} min read
            </div>
          </div>

          <!-- Summary -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <label class="block text-xs text-[#9ca3af]">摘要</label>
              <span
                :class="[
                  'text-xs',
                  summaryCount > 200 ? 'text-[#ef4444]' : 'text-[#6b7280]'
                ]"
              >
                {{ summaryCount }}/200
              </span>
            </div>
            <textarea
              v-model="post.summary"
              maxlength="200"
              rows="3"
              placeholder="文章摘要..."
              class="w-full rounded-lg border border-[#2a2a3a] bg-[#12121a] px-3 py-2 text-sm text-white placeholder-[#6b7280] outline-none transition-colors focus:border-[#00ff88]/50 resize-none"
            ></textarea>
          </div>
        </div>
      </div>
    </div>

    <!-- Preview Modal -->
    <Teleport to="body">
      <div
        v-if="showPreview"
        class="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto"
      >
        <!-- Backdrop -->
        <div
          class="fixed inset-0 bg-[#0a0a0f]/90 backdrop-blur-sm"
          @click="closePreview"
        ></div>

        <!-- Modal Content -->
        <div class="relative z-10 w-full max-w-3xl mx-4 my-8">
          <!-- Modal Header -->
          <div class="flex items-center justify-between rounded-t-lg border border-[#2a2a3a] border-b-0 bg-[#12121a] px-6 py-3">
            <div class="flex items-center gap-2">
              <span class="h-2.5 w-2.5 rounded-full bg-[#ef4444]/60"></span>
              <span class="h-2.5 w-2.5 rounded-full bg-yellow-500/60"></span>
              <span class="h-2.5 w-2.5 rounded-full bg-[#00ff88]/60"></span>
              <span class="ml-2 text-xs text-[#6b7280]">preview — {{ post.title || 'Untitled' }}</span>
            </div>
            <button
              @click="closePreview"
              class="text-sm text-[#6b7280] hover:text-white transition-colors"
            >
              ✕ 关闭
            </button>
          </div>

          <!-- Article Preview -->
          <div class="rounded-b-lg border border-[#2a2a3a] bg-[#161622] p-8">
            <!-- Cover Image -->
            <img
              v-if="post.coverImage"
              :src="post.coverImage"
              :alt="post.title"
              class="w-full h-48 object-cover rounded-lg mb-6 border border-[#2a2a3a]"
            />

            <!-- Title -->
            <h1 class="text-3xl font-bold text-white mb-4">
              {{ post.title || 'Untitled Post' }}
            </h1>

            <!-- Meta -->
            <div class="flex flex-wrap items-center gap-3 text-xs text-[#6b7280] mb-8 pb-6 border-b border-[#2a2a3a]">
              <span v-if="post.category" class="text-[#00ff88]">{{ post.category }}</span>
              <span v-if="post.category">·</span>
              <span>{{ post.publishTime }}</span>
              <span>·</span>
              <span>{{ post.readTime }} min read</span>
              <span
                v-for="tag in post.tags"
                :key="tag"
                class="bg-[#1a1a2e] px-2 py-0.5 rounded text-[#9ca3af]"
              >
                #{{ tag }}
              </span>
            </div>

            <!-- Rendered Markdown -->
            <div
              class="prose prose-invert prose-sm max-w-none prose-headings:text-white prose-p:text-[#9ca3af] prose-a:text-[#38bdf8] prose-strong:text-white prose-code:text-[#00ff88] prose-code:bg-[#1a1a2e] prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-[#12121a] prose-pre:border prose-pre:border-[#2a2a3a] prose-blockquote:border-[#00ff88]/30 prose-blockquote:text-[#9ca3af]"
              v-html="previewHtml"
            ></div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
