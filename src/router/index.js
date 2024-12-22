import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import KakaoCallback from '@/views/KakaoCallback.vue'

const router = createRouter({
  history: createWebHistory('/netflix_clone/'),
  routes: [
    {
      path: '/signin',
      name: 'SignIn',
      component: () => import('@/components/sign-in/SignInComponent.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      component: () => import('@/components/home/HomeComponent.vue'),
      children: [
        {
          path: '',
          name: 'Home',
          component: () => import('@/components/home/HomeMainComponent.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'popular',
          name: 'Popular',
          component: () => import('@/components/home/HomePopularComponent.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'wishlist',
          name: 'Wishlist',
          component: () => import('@/components/views/MovieWishlistComponent.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'search',
          name: 'Search',
          component: () => import('@/components/search/HomeSearchComponent.vue'),
          meta: { requiresAuth: true }
        }
      ]
    },
    {
      path: '/oauth/callback/kakao',
      name: 'KakaoCallback',
      component: KakaoCallback,
      meta: { requiresAuth: false }
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.checkAuth()

  console.log('Navigation Guard:', {
    to: to.path,
    isAuthenticated: authStore.isAuthenticated,
    requiresAuth: to.meta.requiresAuth
  })

  if (authStore.isAuthenticated && to.path === '/signin') {
    next('/')
    return
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/signin')
    return
  }

  next()
})

export default router
