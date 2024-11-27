import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: !!localStorage.getItem('TMDb-Key'),
    apiKey: localStorage.getItem('TMDb-Key')
  }),

  getters: {
    getIsAuthenticated: (state) => state.isAuthenticated,
    getApiKey: (state) => state.apiKey
  },

  actions: {
    login(key) {
      localStorage.setItem('TMDb-Key', key)
      this.apiKey = key
      this.isAuthenticated = true
      console.log('Store: 로그인 완료', {
        apiKey: this.apiKey,
        isAuthenticated: this.isAuthenticated
      })
    },

    logout() {
      localStorage.removeItem('TMDb-Key')
      this.apiKey = null
      this.isAuthenticated = false
      console.log('Store: 로그아웃 완료')
    },

    checkAuth() {
      const key = localStorage.getItem('TMDb-Key')
      this.isAuthenticated = !!key
      this.apiKey = key
      console.log('Store: 인증 상태 체크', {
        apiKey: this.apiKey,
        isAuthenticated: this.isAuthenticated
      })
      return this.isAuthenticated
    }
  }
})
