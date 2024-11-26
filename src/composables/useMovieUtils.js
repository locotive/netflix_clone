import { ref, onMounted, onUnmounted } from 'vue'

export function useMovieUtils() {
  const isMobile = ref(window.innerWidth <= 768)
  const isLoading = ref(false)

  const getImageUrl = (path, size = 'w300') => {
    return path ? `https://image.tmdb.org/t/p/${size}${path}` : null
  }

  const handleResize = () => {
    isMobile.value = window.innerWidth <= 768
  }

  const cleanup = () => {
    window.removeEventListener('resize', handleResize)
  }

  onMounted(() => {
    window.addEventListener('resize', handleResize)
  })

  onUnmounted(() => {
    cleanup()
  })

  return {
    isMobile,
    isLoading,
    getImageUrl,
    cleanup
  }
}
