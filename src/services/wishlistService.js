import { ref } from 'vue'
import axios from 'axios'

// 전역 상태로 wishlist 관리
const wishlist = ref(JSON.parse(localStorage.getItem('movieWishlist') || '[]'))

function saveWishlist() {
  localStorage.setItem('movieWishlist', JSON.stringify(wishlist.value))
}

export function useWishlist() {
  const toggleWishlist = async (movie) => {
    const index = wishlist.value.findIndex((item) => item.id === movie.id)

    if (index === -1) {
      try {
        const apiKey = import.meta.env.VITE_TMDB_API_KEY
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}&language=ko-KR`,
        )
        wishlist.value = [...wishlist.value, { ...movie, ...response.data }]
      } catch (error) {
        console.error('Error fetching movie details:', error)
        wishlist.value = [...wishlist.value, movie]
      }
    } else {
      wishlist.value = wishlist.value.filter((item) => item.id !== movie.id)
    }
    saveWishlist()
  }

  const isInWishlist = (movieId) => wishlist.value.some((item) => item.id === movieId)

  const getCurrentWishlist = () => wishlist.value

  return {
    wishlist, // 반응형 상태 직접 반환
    toggleWishlist,
    isInWishlist,
    getCurrentWishlist,
  }
}
