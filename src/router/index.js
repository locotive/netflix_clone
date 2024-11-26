import { createRouter, createWebHashHistory } from 'vue-router'

// 라우트 컴포넌트
import HomeComponent from '@/components/home/HomeComponent.vue'
import SignInComponent from '@/components/sign-in/SignInComponent.vue'

const routes = [
  {
    path: '/',
    component: HomeComponent,
    meta: { requiresAuth: false },
    children: [
      {
        path: '',
        name: 'HomeMain',
        component: () => import('@/components/home/HomeMainComponent.vue'),
      },
      {
        path: 'wishlist',
        name: 'HomeWishlist',
        component: () => import('@/components/views/MovieWishlistComponent.vue'),
      },
      {
        path: 'popular',
        name: 'HomePopular',
        component: () => import('@/components/home/HomePopularComponent.vue'),
      },
      {
        path: 'search',
        name: 'HomeSearch',
        component: () => import('@/components/search/HomeSearchComponent.vue'),
      },
    ],
  },
  {
    path: '/signin',
    name: 'SignIn',
    component: SignInComponent,
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('TMDb-Key') !== null

  console.log('Route Change Detected:', { from: from.path, to: to.path })
  console.log('Route Meta:', to.meta)
  console.log('Is Authenticated:', isAuthenticated)

  if (to.meta.requiresAuth && !isAuthenticated) {
    console.log('Redirecting to SignIn due to authentication.')
    next('/signin')
  } else {
    next()
  }
})

export default router
