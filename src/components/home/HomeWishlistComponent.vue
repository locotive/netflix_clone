<!-- src/components/home/wishlist/HomeWishlistComponent.vue -->
<template>
  <div>
    <!-- Angular에서 <app-movie-wishlist>가 표시된 부분을 Vue의 MovieWishlist 컴포넌트로 변환 -->
    <MovieWishlist />
  </div>
</template>

<script>
import MovieWishlist from '@/components/views/MovieWishlistComponent.vue'

export default {
  name: 'HomeWishlistComponent',
  components: {
    MovieWishlist,
  },
}
</script>

<style scoped></style>
