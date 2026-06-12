<template>
  <div class="relative">
    <!-- Hero Section -->
    <section class="min-h-[90vh] flex items-center justify-center px-6 relative">
      <div class="max-w-4xl mx-auto text-center animate-fade-in">
        <!-- Terminal greeting -->
        <TerminalWindow title="~/startup.sh" class="mb-10 max-w-2xl mx-auto">
          <div class="text-gray-400">
            <p><span class="text-neon-green">$</span> whoami</p>
            <p class="text-white mt-1">{{ config.name }}</p>
            <p class="mt-2"><span class="text-neon-green">$</span> cat mission.txt</p>
            <p class="text-neon-blue mt-1">{{ config.role }}</p>
            <p class="mt-2"><span class="text-neon-green">$</span> echo $CURRENT_MODE</p>
            <p class="text-neon-purple mt-1">Shipping AI products to real users<span class="cursor-blink text-neon-green ml-0.5">|</span></p>
          </div>
        </TerminalWindow>

        <!-- Main heading -->
        <h1 class="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          <span class="text-white">Hi, I'm </span>
          <span class="glow-text">{{ config.name }}</span>
        </h1>

        <p class="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          {{ config.bio }}
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-wrap items-center justify-center gap-4">
          <NuxtLink to="/portfolio" class="btn-neon">
            <span class="text-neon-green/60 mr-2">01.</span>
            查看作品集
          </NuxtLink>
          <NuxtLink to="/blog" class="btn-neon border-dark-600/50 text-gray-400 hover:text-neon-green">
            <span class="text-neon-green/60 mr-2">02.</span>
            阅读博客
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Skills Section -->
    <section class="py-20 px-6 relative">
      <div class="max-w-6xl mx-auto">
        <SectionTitle number="01" title="核心能力" subtitle="core_competencies" />

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-10">
          <div
            v-for="(skill, i) in skills"
            :key="skill.name"
            class="card-dark p-4 text-center animate-slide-up"
            :style="{ animationDelay: `${i * 0.05}s` }"
          >
            <div class="text-2xl mb-2">{{ skill.icon }}</div>
            <div class="font-mono text-sm text-white">{{ skill.name }}</div>
            <div class="font-mono text-xs text-gray-500 mt-1">{{ skill.en }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Projects Section -->
    <section class="py-20 px-6 relative">
      <div class="max-w-6xl mx-auto">
        <SectionTitle number="02" title="精选项目" subtitle="featured_projects" />

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          <ProjectCard
            v-for="(project, i) in homeProjects"
            :key="i"
            v-bind="project"
          />
        </div>

        <div class="text-center mt-10">
          <NuxtLink to="/portfolio" class="btn-neon">
            查看全部项目 &rarr;
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Latest Blog Posts Section -->
    <section class="py-20 px-6 relative">
      <div class="max-w-6xl mx-auto">
        <SectionTitle number="03" title="最新文章" subtitle="latest_posts" />

        <div class="grid md:grid-cols-2 gap-6 mt-10">
          <BlogCard
            v-for="post in latestPosts"
            :key="post.slug"
            :slug="post.slug"
            :title="post.title"
            :description="post.summary"
            :date="post.publishTime"
            :read-time="post.readTime"
            :tags="post.tags"
          />
        </div>

        <div class="text-center mt-10">
          <NuxtLink to="/blog" class="btn-neon">
            阅读更多 &rarr;
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const config = {
  name: 'Mr.Ace',
  role: 'Entrepreneur · Product Leader · AI Builder',
  bio: '资深产品经理、连续创业者、AI 独立开发者。长期专注于发现真实需求，并用产品、AI 与技术构建解决方案。相信伟大的产品源于深刻的问题，而技术的价值终将回归用户。',
}

const skills = [
  { name: '产品战略', icon: '🎯', en: 'Product Strategy' },
  { name: 'AI产品创新', icon: '🤖', en: 'AI Product Building' },
  { name: '商业模式设计', icon: '💡', en: 'Business Thinking' },
  { name: '用户增长', icon: '📈', en: 'Growth Engineering' },
  { name: 'MVP验证', icon: '✅', en: 'Rapid Validation' },
  { name: 'AI Coding', icon: '💻', en: 'AI-Assisted Development' },
  { name: '内容增长', icon: '✍️', en: 'Content Marketing' },
  { name: '创业执行力', icon: '🚀', en: 'Startup Execution' },
]

const featuredProjects = [
  {
    title: 'WowProduct',
    description: '发现全球最具创意的产品，帮助年轻用户快速找到符合自己调性的产品，让优秀产品被更多人看见。',
    tags: ['AI Discovery', 'Community', 'Marketplace'],
    icon: '🌍',
    subtitle: 'global product discovery',
    image: '/images/projects/wowproduct-1.png',
    liveUrl: '#',
  },
  {
    title: 'Hospitality Management Platform',
    description: '面向酒店与养老机构的一体化运营管理平台，覆盖入住管理、服务流程、资源调度与经营分析，提升机构运营效率。',
    tags: ['Enterprise SaaS', 'Hospitality', 'Operations'],
    icon: '🏨',
    subtitle: 'hospitality operations',
    image: '/images/projects/hospitality-2.png',
    liveUrl: '#',
  },
  {
    title: 'Media Matrix OS',
    description: '多账号自媒体运营平台，实现内容生产、分发、发布与数据追踪的自动化管理，提升内容运营效率。',
    tags: ['Content Tech', 'Automation', 'Growth'],
    icon: '📡',
    subtitle: 'content automation platform',
    image: '/images/projects/mediamatrix-1.png',
    liveUrl: '#',
  },
  {
    title: 'Supply Chain Management Suite',
    description: '整合仓储管理（WMS）与运输管理（TMS），帮助企业实现订单履约、库存协同与物流可视化。',
    tags: ['Supply Chain', 'WMS', 'TMS'],
    icon: '🔗',
    subtitle: 'WMS + TMS system',
    image: '/images/projects/supplychain-1.png',
    liveUrl: '#',
  },
  {
    title: 'Digital Pathology Platform',
    description: '面向医院病理科的全流程信息管理平台，覆盖标本管理、AI诊断、质控管理与区域病理协同。',
    tags: ['Healthcare', 'SaaS', 'AI Diagnosis'],
    icon: '🔬',
    subtitle: 'digital pathology platform',
    image: '/images/projects/pathology-1.png',
    liveUrl: '#',
  },
]

// Homepage only shows projects 01, 03, 04 (indices 0, 2, 3)
const homeProjects = computed(() => [featuredProjects[0], featuredProjects[2], featuredProjects[3]])

const { data: blogData } = await useAsyncData('home-posts', async () => {
  try {
    return await $fetch('/api/posts', { params: { status: 'published' } })
  } catch {
    try {
      const staticData = await $fetch('/api/posts.json') as any
      const published = (staticData.posts || []).filter((p: any) => p.status === 'published')
      published.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      return { posts: published, total: published.length }
    } catch {
      return { posts: [], total: 0 }
    }
  }
})

const latestPosts = computed(() => ((blogData.value as any)?.posts || []).slice(0, 2))
</script>
