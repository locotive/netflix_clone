<template>
  <div id="container">
    <header class="app-header" :class="{ scrolled: isScrolled }">
      <div class="header-left">
        <div class="logo">
          <router-link to="/">
            <font-awesome-icon icon="ticket" style="height: 100%; color: #e50914" />
          </router-link>
        </div>
        <nav class="nav-links desktop-nav">
          <ul>
            <li><router-link to="/">홈</router-link></li>
            <li><router-link to="/popular">대세 콘텐츠</router-link></li>
            <li><router-link to="/wishlist">내가 찜한 리스트</router-link></li>
            <li><router-link to="/search">찾아보기</router-link></li>
          </ul>
        </nav>
      </div>
      <div class="header-right">
        <div class="user-info">
          <span class="user-email" v-if="currentUser">{{ currentUser.email }}</span>
          <button class="logout-button" @click="handleLogout">
            <font-awesome-icon icon="right-from-bracket" />
            <span>로그아웃</span>
          </button>
        </div>
        <button class="icon-button mobile-menu-button" @click="toggleMobileMenu">
          <font-awesome-icon icon="bars" />
        </button>
      </div>
    </header>

    <!-- Mobile Navigation -->
    <div class="mobile-nav" :class="{ open: isMobileMenuOpen }">
      <button class="close-button" @click="toggleMobileMenu">
        <font-awesome-icon icon="times" />
      </button>
      <nav>
        <ul>
          <li><router-link to="/" @click="toggleMobileMenu">홈</router-link></li>
          <li><router-link to="/popular" @click="toggleMobileMenu">대세 콘텐츠</router-link></li>
          <li>
            <router-link to="/wishlist" @click="toggleMobileMenu">내가 찜한 리스트</router-link>
          </li>
          <li><router-link to="/search" @click="toggleMobileMenu">찾아보기</router-link></li>
          <li><button class="logout-button" @click="handleLogout">
            <font-awesome-icon icon="right-from-bracket" />
            <span>로그아웃</span>
          </button></li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'HeaderComponent',
  setup() {
    const isScrolled = ref(false)
    const isMobileMenuOpen = ref(false)
    const currentUser = ref(null)
    const router = useRouter()
    const authStore = useAuthStore()
    const rememberMe = ref(false)

    const handleScroll = () => {
      isScrolled.value = window.scrollY > 50
    }

    const loadUserData = () => {
      const userData = localStorage.getItem('currentUser')
      if (userData) {
        currentUser.value = JSON.parse(userData)
      }
    }

    const handleLogout = () => {
      // localStorage에서 Remember Me 상태 확인
      const rememberMe = localStorage.getItem('rememberMe') === 'true'

      if (!rememberMe) {
        // Remember Me가 체크되지 않았을 때만 저장된 정보를 삭제
        localStorage.removeItem('currentUser')
        localStorage.removeItem('TMDb-Key')
        localStorage.removeItem('rememberMe')
      } else {
        // Remember Me가 체크되어 있을 때는 인증 상태만 초기화
        localStorage.removeItem('isAuthenticated')
      }

      currentUser.value = null
      authStore.logout()
      router.push('/signin')
    }

    const toggleMobileMenu = () => {
      isMobileMenuOpen.value = !isMobileMenuOpen.value
    }

    router.beforeEach((to, from, next) => {
      console.log('Route Change Detected:', { from: from.fullPath, to: to.fullPath })
      console.log('Route Meta:', to.meta)

      const isAuthenticated = localStorage.getItem('TMDb-Key') !== null
      console.log('Is Authenticated:', isAuthenticated)

      if (to.meta.requiresAuth && !isAuthenticated) {
        console.warn('Blocked: Authentication Required')
        next('/signin') // 인증이 필요한 경우 로그인 페이지로 리다이렉트
      } else {
        next() // 경로 변경 허용
      }
    })

    onMounted(() => {
      window.addEventListener('scroll', handleScroll)
      loadUserData()
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
    })

    return {
      isScrolled,
      isMobileMenuOpen,
      currentUser,
      handleLogout,
      toggleMobileMenu,
    }
  },
}
</script>

<style scoped>
.app-header {
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 4%;
  background-color: transparent;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  transition: background-color 0.3s ease;
}

.app-header:hover,
.app-header.scrolled {
  background-color: #141414;
}

.header-left,
.header-right {
  display: flex;
  align-items: center;
}

.logo {
  height: 30px;
  margin-top: 5px;
  margin-right: 25px;
  display: flex; /* 로고 내부 정렬을 위해 flex 사용 */
  align-items: center; /* 수직 정렬 */
  justify-content: center; /* 수평 정렬 */
}

.logo a {
  display: block; /* 링크가 블록 요소로 처리되도록 설정 */
  height: 100%;
  width: 100%; /* 로고 크기에 맞게 링크 크기를 조정 */
}

.logo a:hover {
  text-decoration: none; /* 호버 시 밑줄 제거 */
}

.nav-links ul {
  display: flex;
  list-style-type: none;
  margin: 0;
  padding: 0;
}

.nav-links li {
  margin-right: 20px;
}

.nav-links a {
  color: #e5e5e5;
  text-decoration: none;
  font-size: 0.85rem;
  transition: color 0.3s ease;
}

.nav-links a:hover {
  color: #b3b3b3;
}

.icon-button {
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  margin-left: 20px;
  cursor: pointer;
}

.icon-button:hover {
  opacity: 0.5;
}

.mobile-menu-button {
  display: none;
}

.mobile-nav {
  display: none;
  position: fixed;
  top: 0;
  right: -100%;
  width: 50%;
  height: 100%;
  background-color: #141414;
  z-index: 1001;
  transition: right 0.3s ease;
}

.mobile-nav.open {
  right: 0;
}

.mobile-nav ul {
  list-style-type: none;
  padding: 0;
  margin-top: 60px;
}

.mobile-nav li {
  margin: 20px 0;
}

.mobile-nav a {
  color: #e5e5e5;
  text-decoration: none;
  font-size: 1.2rem;
  display: block;
  padding: 10px 20px;
}

.close-button {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-right: 1rem;
}

.user-email {
  color: #e5e5e5;
  font-size: 0.9rem;
  white-space: nowrap;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.logout-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #e5e5e5;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.logout-button:hover {
  background: rgba(255, 255, 255, 0.1);
}

@media (max-width: 768px) {
  .desktop-nav {
    display: none;
  }

  .mobile-menu-button {
    display: block;
  }

  .mobile-nav {
    display: block;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .user-email {
    max-width: 120px;
  }

  .logout-button {
    display: flex;
    align-items: center;
    background: none;
    border: none;
    color: #e5e5e5;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 4px;
    font-size: 0.9rem;
    margin-left: auto;
  }

  .logout-button span {
    display: inline;
    margin-left: 0.5rem;
  }

  .mobile-nav .logout-button {
    width: 100%;
    justify-content: flex-start;
    padding: 10px 20px;
    margin-top: 10px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
}
</style>
