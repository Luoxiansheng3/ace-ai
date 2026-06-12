<template>
  <div class="admin-layout">
    <!-- Mobile overlay -->
    <div
      v-if="sidebarOpen && showSidebar"
      class="sidebar-overlay"
      @click="sidebarOpen = false"
    />

    <!-- Sidebar (hidden on post editor page) -->
    <aside v-if="showSidebar" :class="['admin-sidebar', { open: sidebarOpen }]">
      <nav class="sidebar-nav">
        <div class="nav-section">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="nav-link"
            @click="sidebarOpen = false"
          >
            <span class="nav-prefix">$</span>
            <span class="nav-text">{{ link.label }}</span>
          </NuxtLink>
        </div>
      </nav>

      <div class="sidebar-footer">
        <div class="terminal-line">
          <span class="terminal-prompt">admin@ace</span>
          <span class="terminal-separator">:</span>
          <span class="terminal-path">~</span>
          <span class="terminal-cursor">_</span>
        </div>
      </div>
    </aside>

    <!-- Main area -->
    <div class="admin-main" :style="!showSidebar ? 'margin-left: 0' : ''">
      <!-- Top bar -->
      <header class="admin-topbar">
        <div class="topbar-left">
          <button v-if="showSidebar" class="menu-toggle" @click="sidebarOpen = !sidebarOpen">
            <span class="hamburger">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
        <div class="topbar-right">
          <div class="user-info">
            <span class="user-badge">A</span>
            <span class="user-name">admin</span>
          </div>
        </div>
      </header>

      <!-- Content -->
      <main class="admin-content">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const sidebarOpen = ref(false)

// Hide sidebar on post editor page
const showSidebar = computed(() => {
  return route.path !== '/admin/posts/new'
})

const navLinks = [
  { to: '/admin', label: '控制台', icon: 'terminal' },
  { to: '/admin/posts', label: '文章管理', icon: 'file' },
  { to: '/', label: '返回前台', icon: 'external' },
]

const pageTitleMap: Record<string, string> = {
  '/admin': '控制台',
  '/admin/posts': '文章管理',
  '/admin/posts/create': '新建文章',
  '/admin/posts/edit': '编辑文章',
}

const pageTitle = computed(() => {
  const path = route.path
  return pageTitleMap[path] || '管理后台'
})
</script>

<style scoped>
:root {
  --admin-bg-primary: #0a0a0f;
  --admin-bg-secondary: #12121a;
  --admin-bg-tertiary: #1a1a2e;
  --admin-bg-card: #161622;
  --admin-border: #2a2a3a;
  --admin-neon-green: #00ff88;
  --admin-purple: #a855f7;
  --admin-blue: #38bdf8;
  --admin-text-primary: #ffffff;
  --admin-text-secondary: #9ca3af;
  --admin-text-muted: #6b7280;
  --admin-sidebar-width: 220px;
}

.admin-layout {
  display: flex;
  min-height: 100vh;
  background-color: var(--admin-bg-primary);
  color: var(--admin-text-primary);
  background-image:
    linear-gradient(rgba(42, 42, 58, 0.15) 1px, transparent 1px),
    linear-gradient(90deg, rgba(42, 42, 58, 0.15) 1px, transparent 1px);
  background-size: 40px 40px;
}

/* Sidebar */
.admin-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: var(--admin-sidebar-width);
  background-color: var(--admin-bg-secondary);
  border-right: 1px solid var(--admin-border);
  display: flex;
  flex-direction: column;
  z-index: 100;
  transition: transform 0.3s ease;
}

.sidebar-overlay {
  display: none;
}

.sidebar-header {
  padding: 20px 16px;
  border-bottom: 1px solid var(--admin-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
  font-size: 1.2rem;
  font-weight: 700;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 2px;
}

.logo-bracket {
  color: var(--admin-text-muted);
}

.logo-text {
  color: var(--admin-neon-green);
}

.sidebar-close {
  display: none;
  background: none;
  border: none;
  color: var(--admin-text-secondary);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0 4px;
  line-height: 1;
}

.sidebar-close:hover {
  color: var(--admin-text-primary);
}

/* Navigation */
.sidebar-nav {
  flex: 1;
  padding: 24px 12px;
  overflow-y: auto;
}

.nav-section {
  padding: 0;
}

.nav-label {
  display: block;
  font-size: 0.7rem;
  color: var(--admin-text-muted);
  font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
  padding: 4px 12px 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: 6px;
  text-decoration: none;
  color: var(--admin-text-secondary);
  font-size: 0.875rem;
  font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
  transition: all 0.2s ease;
  margin-bottom: 2px;
}

.nav-link:hover {
  background-color: var(--admin-bg-tertiary);
  color: var(--admin-text-primary);
}

.nav-link.router-link-active {
  background-color: rgba(0, 255, 136, 0.08);
  color: var(--admin-neon-green);
}

.nav-prefix {
  color: var(--admin-neon-green);
  font-weight: 700;
  font-size: 0.8rem;
  width: 14px;
  text-align: center;
  flex-shrink: 0;
  opacity: 0.7;
}

.nav-link.router-link-active .nav-prefix {
  opacity: 1;
}

.nav-text {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Sidebar footer */
.sidebar-footer {
  padding: 16px;
  border-top: 1px solid var(--admin-border);
}

.terminal-line {
  font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
  font-size: 0.7rem;
  color: var(--admin-text-muted);
  display: flex;
  align-items: center;
  gap: 2px;
}

.terminal-prompt {
  color: var(--admin-purple);
}

.terminal-separator {
  color: var(--admin-text-muted);
}

.terminal-path {
  color: var(--admin-blue);
}

.terminal-cursor {
  color: var(--admin-neon-green);
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

/* Main area */
.admin-main {
  flex: 1;
  margin-left: var(--admin-sidebar-width);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Top bar */
.admin-topbar {
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 56px;
  background-color: rgba(10, 10, 15, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--admin-border);
  z-index: 50;
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.menu-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}

.hamburger {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.hamburger span {
  display: block;
  width: 18px;
  height: 2px;
  background-color: var(--admin-text-secondary);
  border-radius: 1px;
  transition: background-color 0.2s;
}

.menu-toggle:hover .hamburger span {
  background-color: var(--admin-text-primary);
}

.page-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--admin-text-primary);
  margin: 0;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background-color: rgba(0, 255, 136, 0.12);
  color: var(--admin-neon-green);
  font-size: 0.75rem;
  font-weight: 700;
  font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
}

.user-name {
  font-size: 0.8rem;
  color: var(--admin-text-secondary);
  font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
}

/* Content area */
.admin-content {
  flex: 1;
  padding: 24px;
}

/* Responsive */
@media (max-width: 768px) {
  .admin-sidebar {
    transform: translateX(-100%);
  }

  .admin-sidebar.open {
    transform: translateX(0);
  }

  .sidebar-overlay {
    display: block;
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 90;
  }

  .sidebar-close {
    display: block;
  }

  .admin-main {
    margin-left: 0;
  }

  .menu-toggle {
    display: block;
  }

  .admin-content {
    padding: 16px;
  }

  .user-name {
    display: none;
  }
}

@media (max-width: 480px) {
  .admin-topbar {
    padding: 0 12px;
  }

  .admin-content {
    padding: 12px;
  }
}
</style>
