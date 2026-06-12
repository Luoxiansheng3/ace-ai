interface AdminUser {
  username: string
  displayName?: string
  role?: string
}

export function useAdmin() {
  const isLoggedIn = ref(false)
  const user = ref<AdminUser | null>(null)
  const token = ref<string | null>(null)

  const cookie = useCookie('admin-token', {
    maxAge: 86400 * 7,
    sameSite: 'lax',
    secure: false,
  })

  async function login(username: string, password: string): Promise<boolean> {
    try {
      const response = await $fetch<{ token: string; user: AdminUser }>('/api/admin/login', {
        method: 'POST',
        body: { username, password },
      })

      if (response && response.token) {
        cookie.value = response.token
        token.value = response.token
        user.value = response.user || { username }
        isLoggedIn.value = true
        return true
      }

      return false
    } catch (error) {
      console.error('[Admin] Login failed:', error)
      isLoggedIn.value = false
      user.value = null
      token.value = null
      return false
    }
  }

  function logout() {
    cookie.value = null
    token.value = null
    user.value = null
    isLoggedIn.value = false
    navigateTo('/admin/login')
  }

  function checkAuth(): boolean {
    const storedToken = cookie.value
    if (storedToken) {
      token.value = storedToken
      isLoggedIn.value = true
      return true
    }
    isLoggedIn.value = false
    token.value = null
    user.value = null
    return false
  }

  async function fetchAuth(): Promise<boolean> {
    const storedToken = cookie.value
    if (!storedToken) {
      isLoggedIn.value = false
      token.value = null
      user.value = null
      return false
    }

    try {
      const response = await $fetch<{ valid: boolean; user?: AdminUser }>('/api/admin/auth/validate', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      })

      if (response && response.valid) {
        token.value = storedToken
        user.value = response.user || { username: 'admin' }
        isLoggedIn.value = true
        return true
      }

      // Token is invalid, clear everything
      cookie.value = null
      token.value = null
      user.value = null
      isLoggedIn.value = false
      return false
    } catch (error) {
      console.error('[Admin] Auth validation failed:', error)
      cookie.value = null
      token.value = null
      user.value = null
      isLoggedIn.value = false
      return false
    }
  }

  function getAuthHeaders(): Record<string, string> {
    const t = token.value || cookie.value
    if (t) {
      return { Authorization: `Bearer ${t}` }
    }
    return {}
  }

  // Auto-check on initialization
  checkAuth()

  return {
    isLoggedIn: readonly(isLoggedIn),
    user: readonly(user),
    token: readonly(token),
    login,
    logout,
    checkAuth,
    fetchAuth,
    getAuthHeaders,
  }
}
