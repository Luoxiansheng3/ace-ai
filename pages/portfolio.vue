<template>
  <div class="max-w-6xl mx-auto px-6 py-16">
    <!-- Page header -->
    <div class="mb-12 animate-fade-in">
      <SectionTitle number="02" title="作品集" subtitle="portfolio" />
      <p class="text-gray-400 mt-4 max-w-2xl">
        这里是我创业和独立开发过程中打造的产品。每一个项目都是从用户需求出发，用产品和技术的组合拳来解决真实问题。
      </p>
    </div>

    <!-- Filter tags -->
    <div class="flex flex-wrap gap-2 mb-8">
      <button
        v-for="tag in allTags"
        :key="tag"
        class="tag cursor-pointer transition-all duration-200"
        :class="{
          'bg-neon-green/20 text-neon-green border-neon-green/40': activeTag === tag,
          'opacity-50 hover:opacity-80': activeTag && activeTag !== tag,
        }"
        @click="activeTag = activeTag === tag ? '' : tag"
      >
        {{ tag }}
      </button>
      <button
        v-if="activeTag"
        class="font-mono text-xs text-gray-500 hover:text-gray-300 ml-2"
        @click="activeTag = ''"
      >
        [clear filter]
      </button>
    </div>

    <!-- Projects grid -->
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ProjectCard
        v-for="(project, i) in filteredProjects"
        :key="i"
        v-bind="project"
        class="animate-slide-up"
        :style="{ animationDelay: `${i * 0.1}s` }"
      />
    </div>

    <!-- Empty state -->
    <div v-if="filteredProjects.length === 0" class="text-center py-20">
      <p class="font-mono text-gray-500">
        <span class="text-neon-green">$</span> find projects --tag "{{ activeTag }}"<br>
        <span class="text-gray-600">// No results found</span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: '作品集 | Ace.AI' })

const allProjects = [
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

const activeTag = ref('')

const allTags = computed(() => {
  const tags = new Set<string>()
  allProjects.forEach(p => p.tags.forEach(t => tags.add(t)))
  return Array.from(tags).sort()
})

const filteredProjects = computed(() => {
  if (!activeTag.value) return allProjects
  return allProjects.filter(p => p.tags.includes(activeTag.value))
})
</script>
