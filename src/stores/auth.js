import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: !!localStorage.getItem('TMDb-Key'),
    apiKey: localStorage.getItem('TMDb-Key')
  }),

  actions: {
    login(apiKey) {
      localStorage.setItem('TMDb-Key', apiKey)
      this.apiKey = apiKey
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
