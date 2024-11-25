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
          <img
            :src="movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/no-poster.jpg'"
            :alt="movie.title"
            class="movie-poster"
            loading="lazy"
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
  apiKey: String,
  genreCode: String,
  sortingOrder: String,
  voteAverage: Number,
  year: String,
  runtime: [String, Object, null],
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

watch(
  () => ({
    genreCode: props.genreCode,
    sortingOrder: props.sortingOrder,
    voteAverage: props.voteAverage,
    year: props.year,
    runtime: props.runtime,
    language: props.language,
    adult: props.adult
  }),
  async (newVal, oldVal) => {
    if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
      console.log('Filter changed, resetting and fetching new movies')
      currentPage.value = 1
      movies.value = []
      hasMore.value = true
      await fetchMovies()
    }
  },
  { deep: true }
)

async function fetchMovies() {
  if (isLoading.value || !hasMore.value) return

  try {
    isLoading.value = true
    const url = urlService.getFilteredMoviesURL({
      page: currentPage.value,
      genre: props.genreCode,
      rating: props.voteAverage,
      language: props.language,
      year: props.year,
      sortBy: props.sortingOrder,
      runtime: props.runtime,
      adult: props.adult
    })

    console.log('Final fetch URL:', url)
    const response = await axios.get(url)

    if (response.data.results) {
      if (response.data.results.length === 0) {
        hasMore.value = false
      } else {
        movies.value = currentPage.value === 1 ?
          response.data.results :
          [...movies.value, ...response.data.results]
        currentPage.value++
      }
      console.log(`Fetched ${response.data.results.length} movies`)
    }
  } catch (error) {
    console.error('Error fetching movies:', error)
    hasMore.value = false
  } finally {
    isLoading.value = false
  }
}

const gridContainer = ref(null)
const observer = ref(null)

onMounted(() => {
  fetchMovies()

  observer.value = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !isLoading.value && hasMore.value) {
      fetchMovies()
    }
  })

  if (gridContainer.value) {
    observer.value.observe(gridContainer.value)
  }
})

onUnmounted(() => {
  if (observer.value) {
    observer.value.disconnect()
  }
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
  overflow: hidden;
}

.poster-container:hover img {
  transform: scale(1.1);
  transition: transform 0.3s ease;
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
