import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

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
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  authStore.checkAuth()

  console.log('Navigation Guard:', {
    to: to.path,
    isAuthenticated: authStore.isAuthenticated,
    requiresAuth: to.meta.requiresAuth
  })

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/signin')
  } else if (to.path === '/signin' && authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
