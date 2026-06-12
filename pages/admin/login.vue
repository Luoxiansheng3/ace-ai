<template>
  <div class="login-page">
    <div class="login-terminal">
      <!-- Terminal chrome -->
      <div class="terminal__chrome">
        <div class="terminal__dots">
          <span class="terminal__dot terminal__dot--red" />
          <span class="terminal__dot terminal__dot--yellow" />
          <span class="terminal__dot terminal__dot--green" />
        </div>
        <div class="terminal__title">ssh admin@ace.ai</div>
        <div class="terminal__chrome-spacer" />
      </div>

      <!-- Terminal body -->
      <div class="terminal__body">
        <!-- Welcome text -->
        <div class="terminal__welcome">
          <p class="terminal__welcome-line terminal__welcome-line--green">
            $ ssh admin@ace.ai
          </p>
          <p class="terminal__welcome-line">
            Connected to ace.ai admin panel
          </p>
          <p class="terminal__welcome-line terminal__welcome-line--dim">
            Please authenticate to continue.
          </p>
          <p class="terminal__welcome-line terminal__welcome-line--spacer">&nbsp;</p>
        </div>

        <!-- Login form -->
        <form class="terminal__form" @submit.prevent="handleLogin">
          <div class="terminal__field">
            <label class="terminal__label" for="username">username:</label>
            <div class="terminal__input-wrap">
              <span class="terminal__prompt">$</span>
              <input
                id="username"
                v-model="username"
                class="terminal__input"
                type="text"
                autocomplete="username"
                placeholder="admin"
                autofocus
                :disabled="loading"
              />
            </div>
          </div>

          <div class="terminal__field">
            <label class="terminal__label" for="password">password:</label>
            <div class="terminal__input-wrap">
              <span class="terminal__prompt">$</span>
              <input
                id="password"
                v-model="password"
                class="terminal__input"
                type="password"
                autocomplete="current-password"
                placeholder="********"
                :disabled="loading"
              />
            </div>
          </div>

          <!-- Error message -->
          <Transition name="fade">
            <div v-if="error" class="terminal__error">
              <span class="terminal__error-icon">!</span>
              {{ error }}
            </div>
          </Transition>

          <button
            class="terminal__submit"
            type="submit"
            :disabled="loading || !username || !password"
          >
            <span v-if="loading" class="terminal__spinner" />
            <span v-else>{{ '> login' }}</span>
          </button>
        </form>

        <!-- Footer -->
        <div class="terminal__footer">
          <span class="terminal__footer-text">
            ace.ai admin &mdash; secure connection
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
});

useHead({
  title: 'Admin Login',
});

const { login, checkAuth } = useAdmin();

// State
const username = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

// Check if already authenticated on mount
onMounted(async () => {
  const isAuthenticated = await checkAuth();
  if (isAuthenticated) {
    navigateTo('/admin');
  }
});

// Login handler
async function handleLogin() {
  if (!username.value || !password.value) return;

  error.value = '';
  loading.value = true;

  try {
    const success = await login(username.value, password.value);
    if (success) {
      navigateTo('/admin');
    } else {
      error.value = '用户名或密码错误';
    }
  } catch (e: any) {
    error.value = e?.message || '登录失败，请重试';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.login-page {
  --login-bg: #0a0a0f;
  --login-card: #12121a;
  --login-border: #2a2a3a;
  --login-green: #00ff88;
  --login-green-dim: rgba(0, 255, 136, 0.15);
  --login-red: #ff5f57;
  --login-yellow: #ffbd2e;
  --login-green-dot: #28c840;
  --login-text: #ffffff;
  --login-text-muted: #9ca3af;
  --login-text-dim: #6b7280;
  --login-error: #ef4444;
  --login-font-mono: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', ui-monospace,
    SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--login-bg);
  padding: 1rem;
  font-family: var(--login-font-mono);
}

/* ===== Terminal Window ===== */
.login-terminal {
  width: 100%;
  max-width: 480px;
  border: 1px solid var(--login-border);
  border-radius: 0.75rem;
  overflow: hidden;
  background: var(--login-card);
}

/* ===== Terminal Chrome (title bar) ===== */
.terminal__chrome {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid var(--login-border);
}

.terminal__dots {
  display: flex;
  gap: 0.4rem;
}

.terminal__dot {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
}

.terminal__dot--red {
  background: var(--login-red);
}

.terminal__dot--yellow {
  background: var(--login-yellow);
}

.terminal__dot--green {
  background: var(--login-green-dot);
}

.terminal__title {
  flex: 1;
  text-align: center;
  color: var(--login-text-dim);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.02em;
}

.terminal__chrome-spacer {
  width: 3rem; /* balance the dots */
}

/* ===== Terminal Body ===== */
.terminal__body {
  padding: 1.5rem;
}

/* ===== Welcome Text ===== */
.terminal__welcome {
  margin-bottom: 1.5rem;
}

.terminal__welcome-line {
  margin: 0.25rem 0;
  font-size: 0.8rem;
  color: var(--login-text-muted);
  line-height: 1.6;
}

.terminal__welcome-line--green {
  color: var(--login-green);
  font-weight: 600;
}

.terminal__welcome-line--dim {
  color: var(--login-text-dim);
}

.terminal__welcome-line--spacer {
  height: 0.5rem;
}

/* ===== Form ===== */
.terminal__form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.terminal__field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.terminal__label {
  color: var(--login-text-dim);
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.terminal__input-wrap {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid var(--login-border);
  border-radius: 0.5rem;
  padding: 0 0.75rem;
  transition: border-color 0.2s ease;
}

.terminal__input-wrap:focus-within {
  border-color: rgba(0, 255, 136, 0.5);
  box-shadow: 0 0 0 2px rgba(0, 255, 136, 0.08);
}

.terminal__prompt {
  color: var(--login-green);
  font-weight: 700;
  font-size: 0.85rem;
  user-select: none;
  flex-shrink: 0;
}

.terminal__input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--login-text);
  font-family: var(--login-font-mono);
  font-size: 0.85rem;
  padding: 0.65rem 0;
  caret-color: var(--login-green);
  min-width: 0;
}

.terminal__input::placeholder {
  color: var(--login-text-dim);
}

.terminal__input:-webkit-autofill,
.terminal__input:-webkit-autofill:hover,
.terminal__input:-webkit-autofill:focus {
  -webkit-text-fill-color: var(--login-text);
  -webkit-box-shadow: 0 0 0px 1000px rgba(0, 0, 0, 0.35) inset;
  transition: background-color 5000s ease-in-out 0s;
}

/* ===== Error ===== */
.terminal__error {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 0.75rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.25);
  border-radius: 0.5rem;
  color: var(--login-error);
  font-size: 0.8rem;
}

.terminal__error-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.2);
  font-size: 0.7rem;
  font-weight: 700;
  flex-shrink: 0;
}

/* ===== Submit Button ===== */
.terminal__submit {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.7rem 1.5rem;
  margin-top: 0.5rem;
  border: 1px solid var(--login-green);
  border-radius: 0.5rem;
  background: transparent;
  color: var(--login-green);
  font-family: var(--login-font-mono);
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 2.75rem;
}

.terminal__submit:hover:not(:disabled) {
  background: var(--login-green);
  color: var(--login-bg);
  box-shadow: 0 0 20px rgba(0, 255, 136, 0.25);
}

.terminal__submit:active:not(:disabled) {
  transform: scale(0.98);
}

.terminal__submit:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* ===== Spinner ===== */
.terminal__spinner {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(0, 255, 136, 0.3);
  border-top-color: var(--login-green);
  border-radius: 50%;
  animation: login-spin 0.6s linear infinite;
}

@keyframes login-spin {
  to {
    transform: rotate(360deg);
  }
}

/* ===== Footer ===== */
.terminal__footer {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--login-border);
  text-align: center;
}

.terminal__footer-text {
  color: var(--login-text-dim);
  font-size: 0.65rem;
  letter-spacing: 0.04em;
}

/* ===== Transitions ===== */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
