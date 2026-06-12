<template>
  <footer class="relative z-10 border-t border-dark-600/30 bg-dark-900/80 backdrop-blur-xl">
    <div class="max-w-6xl mx-auto px-6 py-8">
      <div class="flex flex-col md:flex-row items-center justify-between gap-4">
        <!-- Left: copyright -->
        <div class="font-mono text-sm text-gray-500">
          <span class="text-neon-green/60">&copy;</span>
          {{ new Date().getFullYear() }}
          <span class="text-gray-400">{{ siteName }}</span>
          <span class="text-gray-600 ml-2">// Shipping AI products to real users</span>
        </div>

        <!-- Right: social links -->
        <div class="flex items-center gap-6">
          <!-- 微信 -->
          <QrPopup image-src="/images/qrcodes/wechat.png" image-alt="微信二维码" label="扫码添加微信">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05a6.127 6.127 0 01-.253-1.728c0-3.572 3.231-6.467 7.213-6.467.267 0 .527.022.788.046C16.42 4.986 12.867 2.188 8.691 2.188zm-2.37 4.053a.96.96 0 110 1.92.96.96 0 010-1.92zm4.74 0a.96.96 0 110 1.92.96.96 0 010-1.92zM16.462 9.63c-3.467 0-6.28 2.503-6.28 5.593 0 3.09 2.813 5.593 6.28 5.593a7.46 7.46 0 002.167-.322.636.636 0 01.526.074l1.393.812a.263.263 0 00.122.04.214.214 0 00.213-.217c0-.053-.02-.105-.035-.156l-.286-1.084a.433.433 0 01.156-.487c1.345-.987 2.202-2.45 2.202-4.073 0-3.27-2.813-5.773-6.28-5.773h-.178zm-1.886 2.937a.72.72 0 110 1.44.72.72 0 010-1.44zm3.772 0a.72.72 0 110 1.44.72.72 0 010-1.44z"/>
            </svg>
          </QrPopup>

          <!-- 微信公众号 -->
          <QrPopup image-src="/images/qrcodes/gongzhonghao.jpg" image-alt="公众号二维码" label="扫码关注公众号">
            <span
              class="w-5 h-5 bg-current inline-block"
              style="-webkit-mask-image: url('/images/icons/gongzhonghao.png'); mask-image: url('/images/icons/gongzhonghao.png'); -webkit-mask-size: contain; mask-size: contain; -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat; -webkit-mask-position: center; mask-position: center;"
            />
          </QrPopup>

          <!-- 抖音 -->
          <QrPopup image-src="/images/qrcodes/douyin.jpg" image-alt="抖音二维码" label="扫码关注抖音">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.88-2.88 2.89 2.89 0 012.88-2.88c.28 0 .54.04.79.1V9a6.33 6.33 0 00-.79-.05A6.34 6.34 0 003.15 15.3a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.73a8.19 8.19 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.16z"/>
            </svg>
          </QrPopup>

          <!-- 邮箱 -->
          <QrPopup card-class="px-4 py-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            <template #content>
              <p class="text-xs text-gray-400 font-mono whitespace-nowrap">mraceluoxiansheng33@gmail.com</p>
            </template>
          </QrPopup>
        </div>
      </div>

      <!-- Terminal-style footer -->
      <div class="mt-6 font-mono text-xs text-gray-600 text-center">
        <span class="text-neon-green/40">$</span> echo "Thanks for visiting" <span class="cursor-blink text-neon-green">|</span>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const siteName = 'Ace.AI'
</script>
