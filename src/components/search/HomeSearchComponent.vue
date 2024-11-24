<template>
  <div class="container-search">
    <div class="container-search-bar">
      <MovieSearch @changeOptions="changeOptions" />
    </div>
    <MovieInfiniteScroll
      :apiKey="apiKey"
      :genreCode="genreId"
      :sortingOrder="sortId"
      :voteAverage="ageId"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import MovieSearch from './MovieSearchComponent.vue'
import MovieInfiniteScroll from '../views/MovieInfiniteScrollComponent.vue'

const apiKey = import.meta.env.VITE_TMDB_API_KEY
if (!apiKey) {
  console.error('API Key is not defined in environment variables')
}

const genreId = ref('28')
const ageId = ref(-1)
const sortId = ref('all')

function changeOptions(options) {
  console.log('Received options in HomeSearch:', options)

  const genreCode = {
    '장르 (전체)': '28',
    Action: '28',
    Adventure: '12',
    Comedy: '35',
    Crime: '80',
    Family: '10751',
  }

  const ratingCode = {
    '평점 (전체)': -1,
    '9~10': 9,
    '8~9': 8,
    '7~8': 7,
    '6~7': 6,
    '5~6': 5,
    '4~5': 4,
    '4점 이하': -2,
  }

  const sortingCode = {
    '언어 (전체)': 'all',
    영어: 'en',
    한국어: 'ko',
  }

  genreId.value = genreCode[options.genre] || '28'
  ageId.value = ratingCode[options.rating] || -1
  sortId.value = sortingCode[options.language] || 'all'

  console.log('Updated values:', {
    genre: genreId.value,
    rating: ageId.value,
    language: sortId.value,
  })
}
</script>

<style scoped>
.container-search {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.container-search-bar {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
