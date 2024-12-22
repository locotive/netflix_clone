import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    base: mode === 'production' ? '/netflix_clone/' : '/',
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      proxy: {
        '/api': {
          target: 'https://api.themoviedb.org/3',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        },
        '/v1': {
          target: 'https://kapi.kakao.com',
          changeOrigin: true
        },
        '/oauth': {
          target: 'https://kauth.kakao.com',
          changeOrigin: true
        }
      }
    },
    envDir: '.',
    envPrefix: 'VITE_'
  }
})
