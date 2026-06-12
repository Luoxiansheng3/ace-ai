<template>
  <div class="max-w-4xl mx-auto px-6 py-16">
    <!-- Page header -->
    <div class="mb-12 animate-fade-in">
      <SectionTitle number="04" title="关于我" subtitle="about" />
    </div>

    <div class="grid md:grid-cols-5 gap-10">
      <!-- Left: Avatar + Info -->
      <div class="md:col-span-2">
        <div class="sticky top-24">
          <!-- Avatar placeholder -->
          <div class="w-48 h-48 mx-auto mb-6 rounded-lg glow-border bg-dark-700 flex items-center justify-center overflow-hidden">
            <img src="/images/avatar.png" alt="Mr.Ace" class="w-full h-full object-cover object-top" />
          </div>

          <!-- Quick info terminal -->
          <TerminalWindow title="~/about.json" class="mt-6">
            <div class="text-sm space-y-1">
              <p class="text-gray-500">{</p>
              <p class="pl-4"><span class="text-neon-blue">"name"</span>: <span class="text-neon-green">"Mr.Ace"</span>,</p>
              <p class="pl-4"><span class="text-neon-blue">"identity"</span>: <span class="text-neon-green">"连续创业者"</span>,</p>
              <p class="pl-4"><span class="text-neon-blue">"focus"</span>: <span class="text-neon-green">"AI + Product"</span>,</p>
              <p class="pl-4"><span class="text-neon-blue">"projects"</span>: <span class="text-neon-purple">Multiple</span></p>
              <p class="text-gray-500">}</p>
            </div>
          </TerminalWindow>

          <!-- Social links -->
          <div class="flex items-center justify-center gap-4 mt-6">
            <QrPopup image-src="/images/qrcodes/wechat.png" image-alt="微信二维码" label="扫码添加微信">微信</QrPopup>
            <span class="text-dark-600">|</span>
            <QrPopup image-src="/images/qrcodes/gongzhonghao.jpg" image-alt="公众号二维码" label="扫码关注公众号">公众号</QrPopup>
            <span class="text-dark-600">|</span>
            <QrPopup image-src="/images/qrcodes/douyin.jpg" image-alt="抖音二维码" label="扫码关注抖音">抖音</QrPopup>
            <span class="text-dark-600">|</span>
            <QrPopup card-class="px-4 py-3" label="">
              邮箱
              <template #content>
                <p class="text-xs text-gray-400 font-mono whitespace-nowrap">mraceluoxiansheng33@gmail.com</p>
              </template>
            </QrPopup>
          </div>
        </div>
      </div>

      <!-- Right: Content -->
      <div class="md:col-span-3">
        <div class="prose-dark">
          <h2>Hello, World!</h2>
          <p>
            我是一名连续创业者、资深产品经理和 AI 独立开发人。擅长从用户洞察中发现产品机会，用 AI 和全栈技术快速把想法变成真实的产品。多个创业项目从 0 到 1 落地，深信最好的产品经理要能写代码，最好的开发者要懂商业。
          </p>

          <h2>创业经历</h2>

          <div class="space-y-6">
            <div class="card-dark p-4">
              <div class="flex items-center justify-between mb-2">
                <h3 class="text-white font-semibold">联合创始人 · 青柠智慧科技</h3>
                <span class="font-mono text-xs text-gray-500">2023 - Present</span>
              </div>
              <p class="text-gray-400 text-sm">独立创办 AI 工具类产品，负责产品设计、开发和运营全链路</p>
            </div>

            <div class="card-dark p-4">
              <div class="flex items-center justify-between mb-2">
                <h3 class="text-white font-semibold">研发工程师 → 产品经理 → 产品总监</h3>
                <span class="font-mono text-xs text-gray-500">2012 - 2022</span>
              </div>
              <p class="text-gray-400 text-sm">从研发工程师成长为产品负责人，服务全球独角兽与行业龙头企业，主导供应链、酒店及企业数字化产品建设，持续推动复杂业务场景的数字化创新。</p>
            </div>
          </div>

          <h2>核心能力</h2>
          <p>
            产品思维与 AI 技术的深度结合。擅长用户调研、需求分析、产品定义和增长策略，同时具备全栈开发能力，能独立完成从原型设计到上线部署的完整闭环。专注于 AI 应用层开发，把大模型能力转化为用户真正用得上的产品体验。
          </p>

          <h2>独立开发理念</h2>
          <p>
            相信独立开发的本质不是一个人写代码，而是一个人运营一家公司。从发现需求、设计产品、编写代码、到营销推广和用户服务，每个环节都要亲力亲为。这种全栈能力是连续创业最大的底气。
          </p>

          <h2>联系方式</h2>
          <p>
            如果你也是独立开发者或创业者，想聊聊产品想法、AI 应用或者创业心得，欢迎通过邮件或社交媒体联系我。我通常会在 24 小时内回复。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: '关于我 | Ace.AI' })
</script>
