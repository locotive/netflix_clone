import { ref } from 'vue'

const wishlist = ref(JSON.parse(localStorage.getItem('movieWishlist') || '[]'))

function saveWishlist() {
  localStorage.setItem('movieWishlist', JSON.stringify(wishlist.value))
}

export function useWishlist() {
  const toggleWishlist = (movie) => {
    const index = wishlist.value.findIndex((item) => item.id === movie.id)
    if (index === -1) {
      wishlist.value.push(movie)
    } else {
      wishlist.value.splice(index, 1)
    }
    saveWishlist()
  }

  const isInWishlist = (movieId) => wishlist.value.some((item) => item.id === movieId)

  const getCurrentWishlist = () => wishlist.value

  return {
    toggleWishlist,
    isInWishlist,
    getCurrentWishlist,
  }
}
