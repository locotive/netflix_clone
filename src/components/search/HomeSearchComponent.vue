<template>
  <div class="container-search">
    <MovieSearch @changeOptions="changeOptions" />
    <MovieInfiniteScroll
      :apiKey="apiKey"
      :genreCode="genreId"
      :sortingOrder="sortId"
      :voteAverage="ageId"
      :year="yearId"
      :adult="adultId"
      :runtime="runtimeId"
      :language="languageId"
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
const sortId = ref('popularity.desc')
const yearId = ref(null)
const adultId = ref(false)
const runtimeId = ref(null)
const languageId = ref(null)

function changeOptions(options) {
  console.log('Received options:', options)

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
    '정렬 (기본)': 'popularity.desc',
    '인기도 높은순': 'popularity.desc',
    '인기도 낮은순': 'popularity.asc',
    '평점 높은순': 'vote_average.desc',
    '평점 낮은순': 'vote_average.asc',
    최신순: 'primary_release_date.desc',
    오래된순: 'primary_release_date.asc',
  }

  const runtimeRanges = {
    '상영시간 (전체)': null,
    '90분 이하': { gte: 0, lte: 90 },
    '90-120분': { gte: 90, lte: 120 },
    '120분 이상': { gte: 120, lte: 999 },
  }

  genreId.value = genreCode[options.genre] || '28'
  ageId.value = ratingCode[options.rating] || -1
  sortId.value = sortingCode[options.sort] || 'popularity.desc'
  yearId.value = options.year === '연도 (전체)' ? null : options.year
  adultId.value = options.adult === '성인물 포함'
  runtimeId.value = runtimeRanges[options.runtime]
  languageId.value =
    options.language === '언어 (전체)' ? null : options.language === '영어' ? 'en' : 'ko'

  console.log('Updating filter values:', {
    genre: genreId.value,
    rating: ageId.value,
    sort: sortId.value,
    year: yearId.value,
    adult: adultId.value,
    runtime: runtimeId.value,
    language: languageId.value,
  })
}
</script>

<style scoped>
.container-search {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  padding: 20px 0;
}
</style>
