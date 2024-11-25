<template>
  <div class="movie-grid" ref="gridContainer">
    <div v-if="isLoading && movies.length === 0" class="loading">
      <div class="loading-spinner"></div>
      <p>영화를 불러오는 중...</p>
    </div>
    <div v-else-if="!isLoading && movies.length === 0" class="no-results">
      검색 결과가 없습니다. 필터 조건을 변경해보세요.
    </div>
    <div v-else class="movie-list">
      <div
        v-for="movie in movies"
        :key="movie.id"
        class="movie-item"
        :class="{ 'in-wishlist': isInWishlist(movie.id) }"
        @click="toggleWishlist(movie)"
      >
        <div class="poster-container">
          <div v-if="!movie.imageLoaded" class="loading-overlay">
            <div class="loading-spinner"></div>
          </div>
          <img
            :src="movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/no-poster.jpg'"
            :alt="movie.title"
            class="movie-poster"
            loading="lazy"
            @load="movie.imageLoaded = true"
            :class="{ 'loaded': movie.imageLoaded }"
          />
        </div>
        <div class="movie-info">
          <h3>{{ movie.title }}</h3>
          <div class="movie-details">
            <div class="meta-info">
              <p class="rating">⭐ {{ movie.vote_average.toFixed(1) }}</p>
              <p class="release-date">{{ formatDate(movie.release_date) }}</p>
            </div>
            <p class="overview">{{ movie.overview || '줄거리 없음' }}</p>
          </div>
        </div>
        <div v-if="isInWishlist(movie.id)" class="wishlist-badge">
          찜됨
        </div>
      </div>
    </div>
    <div v-if="isLoading && movies.length > 0" class="loading-more">
      <div class="loading-spinner"></div>
      <p>더 많은 영화를 불러오는 중...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import urlService from '@/services/urlService'
import { useWishlist } from '@/services/wishlistService'

const props = defineProps({
  apiKey: {
    type: String,
    required: true
  },
  fetchUrl: {
    type: String,
    required: true
  },
  genreCode: String,
  sortingOrder: String,
  voteAverage: Number,
  year: [String, Number],
  runtime: String,
  language: String,
  adult: Boolean
})

const movies = ref([])
const currentPage = ref(1)
const isLoading = ref(false)
const hasMore = ref(true)

const { isInWishlist, toggleWishlist } = useWishlist()

function formatDate(dateStr) {
  if (!dateStr) return '개봉일 미정'
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// URL 생성 함수
const getFinalUrl = (page) => {
  if (!props.fetchUrl) {
    // 기본 URL 생성 (검색 페이지용)
    return urlService.getFilteredMoviesURL({
      page,
      genre: props.genreCode,
      rating: props.voteAverage,
      language: props.language,
      year: props.year,
      sortBy: props.sortingOrder,
      runtime: props.runtime,
      adult: props.adult
    })
  }
  // Popular 페이지용 URL
  return `${props.fetchUrl}&page=${page}`
}

// 영화 데이터 로드 함수 수정
const loadMovies = async () => {
  if (isLoading.value) return

  try {
    isLoading.value = true
    const url = getFinalUrl(currentPage.value)
    console.log('Loading movies from URL:', url)

    const response = await axios.get(url)

    if (response.data && response.data.results) {
      const newMovies = response.data.results
      if (currentPage.value === 1) {
        movies.value = newMovies
      } else {
        movies.value = [...movies.value, ...newMovies]
      }
      console.log(`Loaded ${newMovies.length} movies. Total: ${movies.value.length}`)
    }
  } catch (error) {
    console.error('Error loading movies:', error)
  } finally {
    isLoading.value = false
  }
}

// props가 변경될 때 데이터 리로드
watch(
  () => [
    props.genreCode,
    props.sortingOrder,
    props.voteAverage,
    props.year,
    props.runtime,
    props.language,
    props.adult
  ],
  () => {
    console.log('Search params changed, reloading data...')
    currentPage.value = 1
    movies.value = []
    loadMovies()
  }
)

const gridContainer = ref(null)
const observer = ref(null)

// 스크롤 감지 함수 추가
const handleScroll = () => {
  const scrollPosition = window.innerHeight + window.scrollY
  const bottomOfPage = document.documentElement.offsetHeight - 200 // 하단에서 200px 여유

  console.log('Scroll Position:', scrollPosition)
  console.log('Bottom of Page:', bottomOfPage)

  if (scrollPosition >= bottomOfPage && !isLoading.value) {
    console.log('Loading more movies...')
    currentPage.value++
    loadMovies()
  }
}

// 컴포넌트 마운트 시 스크롤 이벤트 리스너 추가
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  loadMovies() // 초기 데이터 로드
})

// 컴포넌트 언마운트 시 이벤트 리스너 제거
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.movie-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
}

.movie-list {
  display: flex;
  flex-direction: column;
  width: 98%;
  max-width: 2400px;
  margin: 0 auto;
  gap: 30px;
  padding: 20px 10px;
}

.movie-item {
  width: 100%;
  position: relative;
  display: flex;
  background: #333;
  border-radius: 8px;
  overflow: hidden;
}

.movie-item img {
  width: 200px;
  height: 300px;
  object-fit: cover;
}

.movie-info {
  padding: 20px;
  flex-grow: 1;
}

.movie-item:hover {
  transform: scale(1.02);
}

.poster-container {
  position: relative;
  width: 200px;
  aspect-ratio: 2/3;
  background: #1a1a1a;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #1a1a1a;
  z-index: 1;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-left-color: #e50914;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

img {
  opacity: 0;
  transition: opacity 0.3s ease;
}

img.loaded {
  opacity: 1;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.wishlist-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(229, 9, 20, 0.8);
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  z-index: 3;
}

.movie-poster {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.movie-item:hover .movie-poster {
  transform: scale(1.05);
}

.movie-info h3 {
  margin: 0;
  font-size: 1.8rem;
  color: white;
  margin-bottom: 16px;
  font-weight: 600;
}

.movie-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.meta-info {
  display: flex;
  gap: 20px;
  align-items: center;
}

.rating {
  color: #ffd700;
  font-size: 1.2rem;
  margin: 0;
}

.release-date {
  color: #aaa;
  font-size: 1.1rem;
  margin: 0;
}

.overview {
  color: #ddd;
  font-size: 1.1rem;
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-left-color: #e50914;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading, .no-results, .loading-more {
  text-align: center;
  padding: 20px;
  color: white;
}

/* 모바일 대응 */
@media (max-width: 768px) {
  .movie-list {
    width: 100%;
    padding: 10px;
    gap: 15px;
  }

  .movie-item {
    flex-direction: column;
  }

  .movie-item img {
    width: 100%;
    height: auto;
  }

  .movie-info {
    padding: 15px;
  }
}
</style>
