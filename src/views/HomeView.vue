<template>
  <div>
    <h1>Popular Movies</h1>
    <ul>
      <li v-for="movie in movies" :key="movie.id">
        {{ movie.title }}
      </li>
    </ul>
  </div>
</template>

<script>
import api from '@/services/api'

export default {
  data() {
    return {
      movies: [],
    }
  },
  async created() {
    try {
      // API 키가 제대로 설정되어 있는지 확인
      console.log('API Key:', import.meta.env.VITE_TMDB_API_KEY)

      // API 호출
      const response = await api.get('/movie/popular')

      // 응답 결과 확인
      console.log('API Response:', response)

      this.movies = response.data.results
    } catch (error) {
      console.error('Failed to fetch popular movies:', error)
    }
  },
}
</script>
