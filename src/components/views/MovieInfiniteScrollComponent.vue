<template>
  <div class="movie-grid" v-if="movies && movies.length > 0">
    <div v-for="movie in movies" :key="movie.id" class="movie-card">
      <img
        :src="
          movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : '/no-poster.jpg'
        "
        :alt="movie.title"
        class="movie-poster"
      />
      <div class="movie-info">
        <h3>{{ movie.title }}</h3>
        <p>평점: {{ movie.vote_average.toFixed(1) }}</p>
        <p>개봉일: {{ formatDate(movie.release_date) }}</p>
      </div>
    </div>
  </div>
  <div v-else-if="isLoading" class="loading">영화를 불러오는 중...</div>
  <div v-else class="no-results">검색 결과가 없습니다.</div>
</template>

<script setup>
import { ref, watch } from 'vue'
import axios from 'axios'

const props = defineProps({
  apiKey: {
    type: String,
    required: true,
  },
  genreCode: {
    type: String,
    required: true,
  },
  sortingOrder: {
    type: String,
    default: 'all',
  },
  voteAverage: {
    type: Number,
    default: -1,
  },
})

const movies = ref([])
const currentPage = ref(1)
const isLoading = ref(false)
const hasMore = ref(true)

// watch 수정
watch(
  () => [props.genreCode, props.sortingOrder, props.voteAverage],
  (newValues) => {
    console.log('필터 변경 감지됨:', {
      genre: newValues[0],
      sort: newValues[1],
      vote: newValues[2],
    })

    // 필터가 변경되면 데이터 초기화 후 새로 불러오기
    movies.value = []
    currentPage.value = 1
    hasMore.value = true
    fetchMovies()
  },
  { immediate: true },
)

async function fetchMovies() {
  if (isLoading.value || !hasMore.value) return

  isLoading.value = true
  try {
    const params = new URLSearchParams({
      api_key: props.apiKey,
      language: 'ko-KR',
      page: currentPage.value.toString(),
      sort_by: 'popularity.desc',
    })

    // 장르 필터
    if (props.genreCode && props.genreCode !== '28') {
      params.append('with_genres', props.genreCode)
    }

    // 언어 필터
    if (props.sortingOrder && props.sortingOrder !== 'all') {
      params.append('with_original_language', props.sortingOrder)
    }

    // 평점 필터
    if (props.voteAverage > 0) {
      params.append('vote_average.gte', props.voteAverage.toString())
      params.append('vote_average.lte', (props.voteAverage + 1).toString())
      params.append('vote_count.gte', '50') // 신뢰성 있는 평점을 위한 최소 투표 수
    } else if (props.voteAverage === -2) {
      params.append('vote_average.lte', '4')
      params.append('vote_count.gte', '50')
    }

    const url = `https://api.themoviedb.org/3/discover/movie?${params.toString()}`
    console.log('Fetching movies with URL:', url)

    const response = await axios.get(url)
    const newMovies = response.data.results || []

    if (newMovies.length > 0) {
      movies.value = currentPage.value === 1 ? newMovies : [...movies.value, ...newMovies]
      currentPage.value++
    } else {
      hasMore.value = false
    }
  } catch (error) {
    console.error('Error fetching movies:', error)
  } finally {
    isLoading.value = false
  }
}

// 날짜 포맷 함수
function formatDate(dateStr) {
  if (!dateStr) return '미정'
  const date = new Date(dateStr)
  return date.toLocaleDateString('ko-KR')
}
</script>

<style scoped>
.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  padding: 20px;
}

.movie-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s;
}

.movie-card:hover {
  transform: scale(1.05);
}

.movie-poster {
  width: 100%;
  height: 300px;
  object-fit: cover;
}

.movie-info {
  padding: 10px;
}

.movie-info h3 {
  margin: 0;
  font-size: 1.1em;
}

.movie-info p {
  margin: 5px 0;
  color: #666;
}

.loading,
.no-results {
  text-align: center;
  padding: 20px;
  font-size: 1.2em;
  color: #666;
}
</style>
