import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: !!localStorage.getItem('user_email') || !!localStorage.getItem('kakao_access_token'),
    apiKey: import.meta.env.VITE_TMDB_API_KEY,
    kakaoToken: localStorage.getItem('kakao_access_token'),
    user: JSON.parse(localStorage.getItem('user_info')),
    userEmail: localStorage.getItem('user_email')
  }),

  getters: {
    getIsAuthenticated: (state) => state.isAuthenticated,
    getApiKey: (state) => state.apiKey
  },

  actions: {
    login(email) {
      localStorage.setItem('user_email', email)
      this.userEmail = email
      this.isAuthenticated = true
      console.log('Store: 일반 로그인 완료', {
        email: this.userEmail,
        isAuthenticated: this.isAuthenticated
      })
    },

    kakaoLogin(token, userData) {
      localStorage.setItem('kakao_access_token', token)
      localStorage.setItem('user_info', JSON.stringify(userData))
      this.kakaoToken = token
      this.user = userData
      this.isAuthenticated = true
      console.log('Store: 카카오 로그인 완료', {
        user: this.user,
        isAuthenticated: this.isAuthenticated
      })
    },

    logout() {
      localStorage.removeItem('user_email')
      localStorage.removeItem('kakao_access_token')
      localStorage.removeItem('user_info')
      this.userEmail = null
      this.kakaoToken = null
      this.user = null
      this.isAuthenticated = false
      console.log('Store: 로그아웃 완료')
    },

    checkAuth() {
      const userEmail = localStorage.getItem('user_email')
      const kakaoToken = localStorage.getItem('kakao_access_token')
      const userInfo = localStorage.getItem('user_info')

      if (userEmail) {
        this.userEmail = userEmail
        this.isAuthenticated = true
      } else if (kakaoToken && userInfo) {
        this.kakaoToken = kakaoToken
        this.user = JSON.parse(userInfo)
        this.isAuthenticated = true
      } else {
        this.userEmail = null
        this.kakaoToken = null
        this.user = null
        this.isAuthenticated = false
      }

      console.log('Store: 인증 상태 체크', {
        email: this.userEmail,
        kakaoToken: this.kakaoToken,
        isAuthenticated: this.isAuthenticated,
        user: this.user
      })

      return this.isAuthenticated
    }
  }
})
