<template>
  <div class="admin-dashboard">
    <!-- Welcome terminal card -->
    <div class="terminal-card">
      <div class="terminal-header">
        <span class="terminal-dot red"></span>
        <span class="terminal-dot yellow"></span>
        <span class="terminal-dot green"></span>
        <span class="terminal-title">bash</span>
      </div>
      <div class="terminal-body">
        <div class="terminal-line">
          <span class="terminal-prompt">$</span>
          <span class="terminal-command">echo "Welcome back, Mr.Ace"</span>
        </div>
        <div class="terminal-output">Welcome back, Mr.Ace</div>
        <div class="terminal-line">
          <span class="terminal-prompt">$</span>
          <span class="terminal-command">date</span>
        </div>
        <div class="terminal-output">{{ currentDate }}</div>
        <div class="terminal-line">
          <span class="terminal-prompt">$</span>
          <span class="terminal-cursor">_</span>
        </div>
      </div>
    </div>

    <!-- Stats cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon total">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.total }}</span>
          <span class="stat-label">Total Posts</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon published">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.published }}</span>
          <span class="stat-label">Published</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon drafts">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.drafts }}</span>
          <span class="stat-label">Drafts</span>
        </div>
      </div>
    </div>

    <!-- Recent posts -->
    <div class="section-card">
      <div class="section-header">
        <h2 class="section-title">
          <span class="title-prefix">#</span>
          Recent Posts
        </h2>
        <NuxtLink to="/admin/posts" class="section-link">
          View all &rarr;
        </NuxtLink>
      </div>

      <div v-if="loading" class="loading-state">
        <span class="loading-spinner"></span>
        <span>Loading posts...</span>
      </div>

      <div v-else-if="recentPosts.length === 0" class="empty-state">
        <p>No posts yet.</p>
        <NuxtLink to="/admin/posts/new" class="create-link">
          Create your first post &rarr;
        </NuxtLink>
      </div>

      <div v-else class="posts-list">
        <div
          v-for="post in recentPosts"
          :key="post.id"
          class="post-item"
        >
          <div class="post-info">
            <NuxtLink :to="`/admin/posts/new?id=${post.id}`" class="post-title">
              {{ post.title }}
            </NuxtLink>
            <div class="post-meta">
              <span :class="['post-status', post.status === 'published' ? 'is-published' : 'is-draft']">
                {{ post.status === 'published' ? 'Published' : 'Draft' }}
              </span>
              <span class="post-date">{{ formatDate(post.publishTime || post.createdAt) }}</span>
            </div>
          </div>
          <div class="post-actions">
            <NuxtLink :to="`/admin/posts/new?id=${post.id}`" class="action-btn">
              Edit
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

const { isLoggedIn, checkAuth } = useAdmin()

// Redirect to login if not authenticated, otherwise fetch data
onMounted(() => {
  if (!checkAuth()) {
    navigateTo('/admin/login')
  } else {
    fetchDashboardData()
  }
})

// Current date for the terminal display
const currentDate = new Date().toLocaleString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

// Stats
const stats = reactive({
  total: 0,
  published: 0,
  drafts: 0,
})

// Recent posts
const recentPosts = ref<any[]>([])
const loading = ref(true)

async function fetchDashboardData() {
  loading.value = true
  try {
    // Fetch all posts (no status filter = all posts)
    const data = await $fetch<any>('/api/posts')

    if (data && Array.isArray(data.posts)) {
      const allPosts = data.posts

      // Calculate stats from posts array
      stats.total = allPosts.length
      stats.published = allPosts.filter((p: any) => p.status === 'published').length
      stats.drafts = allPosts.filter((p: any) => p.status === 'draft').length

      // Recent posts: latest 5 (already sorted by createdAt desc from API)
      recentPosts.value = allPosts.slice(0, 5)
    }
  } catch (error) {
    console.error('[Dashboard] Failed to fetch data:', error)
  } finally {
    loading.value = false
  }
}

function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>

<style scoped>
.admin-dashboard {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Terminal card */
.terminal-card {
  background-color: #12121a;
  border: 1px solid #2a2a3a;
  border-radius: 8px;
  overflow: hidden;
}

.terminal-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  background-color: #1a1a2e;
  border-bottom: 1px solid #2a2a3a;
}

.terminal-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.terminal-dot.red {
  background-color: #ff5f57;
}

.terminal-dot.yellow {
  background-color: #ffbd2e;
}

.terminal-dot.green {
  background-color: #28c840;
}

.terminal-title {
  margin-left: 8px;
  font-size: 0.7rem;
  color: #6b7280;
  font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
}

.terminal-body {
  padding: 16px;
  font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
  font-size: 0.85rem;
  line-height: 1.8;
}

.terminal-line {
  display: flex;
  align-items: center;
  gap: 8px;
}

.terminal-prompt {
  color: #00ff88;
  font-weight: 700;
}

.terminal-command {
  color: #ffffff;
}

.terminal-output {
  color: #9ca3af;
  padding-left: 20px;
}

.terminal-cursor {
  color: #00ff88;
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

/* Stats grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.stat-card {
  background-color: #161622;
  border: 1px solid #2a2a3a;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: border-color 0.2s;
}

.stat-card:hover {
  border-color: #3a3a4a;
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 8px;
  flex-shrink: 0;
}

.stat-icon.total {
  background-color: rgba(56, 189, 248, 0.12);
  color: #38bdf8;
}

.stat-icon.published {
  background-color: rgba(0, 255, 136, 0.12);
  color: #00ff88;
}

.stat-icon.drafts {
  background-color: rgba(168, 85, 247, 0.12);
  color: #a855f7;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
  line-height: 1.2;
}

.stat-label {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 2px;
}

/* Section card */
.section-card {
  background-color: #161622;
  border: 1px solid #2a2a3a;
  border-radius: 8px;
  overflow: hidden;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #2a2a3a;
}

.section-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.title-prefix {
  color: #00ff88;
  font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
  font-weight: 700;
}

.section-link {
  font-size: 0.8rem;
  color: #00ff88;
  text-decoration: none;
  font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
  transition: opacity 0.2s;
}

.section-link:hover {
  opacity: 0.8;
}

/* Loading & empty states */
.loading-state {
  padding: 40px 20px;
  text-align: center;
  color: #6b7280;
  font-size: 0.85rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #2a2a3a;
  border-top-color: #00ff88;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.empty-state {
  padding: 40px 20px;
  text-align: center;
  color: #6b7280;
  font-size: 0.85rem;
}

.create-link {
  display: inline-block;
  margin-top: 8px;
  color: #00ff88;
  text-decoration: none;
  font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
  font-size: 0.8rem;
}

.create-link:hover {
  opacity: 0.8;
}

/* Posts list */
.posts-list {
  padding: 4px 0;
}

.post-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  transition: background-color 0.15s;
}

.post-item:hover {
  background-color: rgba(26, 26, 46, 0.5);
}

.post-item + .post-item {
  border-top: 1px solid rgba(42, 42, 58, 0.5);
}

.post-info {
  flex: 1;
  min-width: 0;
}

.post-title {
  font-size: 0.9rem;
  font-weight: 500;
  color: #ffffff;
  text-decoration: none;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.2s;
}

.post-title:hover {
  color: #00ff88;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 4px;
}

.post-status {
  font-size: 0.7rem;
  font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
  padding: 2px 8px;
  border-radius: 4px;
}

.post-status.is-published {
  background-color: rgba(0, 255, 136, 0.1);
  color: #00ff88;
}

.post-status.is-draft {
  background-color: rgba(168, 85, 247, 0.1);
  color: #a855f7;
}

.post-date {
  font-size: 0.7rem;
  color: #6b7280;
}

.post-actions {
  margin-left: 16px;
  flex-shrink: 0;
}

.action-btn {
  font-size: 0.75rem;
  color: #9ca3af;
  text-decoration: none;
  padding: 4px 10px;
  border: 1px solid #2a2a3a;
  border-radius: 4px;
  font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
  transition: all 0.2s;
}

.action-btn:hover {
  color: #00ff88;
  border-color: #00ff88;
}

/* Responsive */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .post-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .post-actions {
    margin-left: 0;
  }
}

@media (max-width: 480px) {
  .terminal-body {
    font-size: 0.75rem;
    padding: 12px;
  }

  .stat-card {
    padding: 14px;
  }

  .stat-value {
    font-size: 1.25rem;
  }
}
</style>
