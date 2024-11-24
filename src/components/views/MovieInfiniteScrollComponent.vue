<template>
  <div class="movie-grid" ref="gridContainer">
    <div v-if="movies.length === 0">영화를 불러오는 중...</div>
    <div v-else class="list-view">
      <div v-for="movie in movies" :key="movie.id" class="movie-banner">
        <div
          class="banner-image"
          :style="{ backgroundImage: `url(${getBackdropUrl(movie.backdrop_path)})` }"
        >
          <div class="banner-content">
            <div class="movie-info">
              <h2>{{ movie.title }}</h2>
              <p>{{ movie.overview }}</p>
              <div class="movie-meta">
                <span class="rating">평점: {{ movie.vote_average.toFixed(1) }}</span>
                <span class="release-date">개봉일: {{ movie.release_date }}</span>
              </div>
            </div>
            <div class="action-buttons">
              <button class="play-btn">재생</button>
              <button class="wishlist-btn" @click="toggleWishlist(movie)">
                {{ isInWishlist(movie.id) ? '찜해제' : '찜하기' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div ref="loadingTrigger"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import axios from 'axios'
import { useWishlist } from '@/services/wishlistService'

const props = defineProps({
  genreCode: String,
  apiKey: String,
  sortingOrder: String,
  voteAverage: Number,
  year: String,
  adult: Boolean,
  runtime: Object,
  language: String,
  fetchUrl: String,
})

const movies = ref([])
const currentPage = ref(1)
const isLoading = ref(false)
const hasMore = ref(true)
const gridContainer = ref(null)
const loadingTrigger = ref(null)
let observer = null

const { toggleWishlist, isInWishlist } = useWishlist()

function getBackdropUrl(path) {
  return path ? `https://image.tmdb.org/t/p/w1280${path}` : '/placeholder-backdrop.jpg'
}

async function fetchMovies() {
  if (isLoading.value || !hasMore.value) return

  isLoading.value = true
  try {
    let url
    // fetchUrl이 제공된 경우 (Popular 리스트용)
    if (props.fetchUrl) {
      url = `${props.fetchUrl}&page=${currentPage.value}`
      console.log('Using provided fetchUrl:', url)
    } else {
      // 검색 조건에 따른 URL 구성 (Search 컴포넌트용)
      url = `https://api.themoviedb.org/3/discover/movie?api_key=${props.apiKey}&language=ko-KR&page=${currentPage.value}`

      if (props.genreCode && props.genreCode !== '0') {
        url += `&with_genres=${props.genreCode}`
      }

      if (props.voteAverage > 0) {
        if (props.voteAverage === -2) {
          url += `&vote_average.lte=4`
        } else {
          url += `&vote_average.gte=${props.voteAverage}`
        }
      }

      if (props.sortingOrder && props.sortingOrder !== 'all') {
        url += `&sort_by=${props.sortingOrder}`
      }

      // ... other filters ...
    }

    console.log('Final fetch URL:', url)
    const response = await axios.get(url)
    const newMovies = response.data.results || []

    if (newMovies.length > 0) {
      if (currentPage.value === 1) {
        movies.value = newMovies
      } else {
        movies.value = [...movies.value, ...newMovies]
      }
      currentPage.value++
    } else {
      hasMore.value = false
    }

    console.log(`Fetched ${newMovies.length} movies`)
  } catch (error) {
    console.error('Error fetching movies:', error)
    hasMore.value = false
  } finally {
    isLoading.value = false
  }
}

function setupIntersectionObserver() {
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !isLoading.value && hasMore.value) {
        fetchMovies()
      }
    },
    { rootMargin: '100px', threshold: 0.1 },
  )
  if (loadingTrigger.value) {
    observer.observe(loadingTrigger.value)
  }
}

onMounted(() => {
  console.log('Component mounted, fetching movies...')
  movies.value = []
  currentPage.value = 1
  hasMore.value = true
  fetchMovies()
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})

// props 변경 감지
watch(
  [
    () => props.fetchUrl,
    () => props.genreCode,
    () => props.sortingOrder,
    () => props.voteAverage,
    () => props.year,
    () => props.adult,
    () => props.runtime,
    () => props.language,
  ],
  () => {
    console.log('Props changed, resetting and fetching new movies')
    movies.value = []
    currentPage.value = 1
    hasMore.value = true
    fetchMovies()
  },
  { deep: true },
)
</script>

<style scoped>
.movie-grid {
  width: 100%;
  padding: 20px;
}

.list-view {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
}

.movie-banner {
  width: 100%;
  height: 40vh;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  transition: transform 0.3s ease;
}

.movie-banner:hover {
  transform: scale(1.02);
}

.banner-image {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  position: relative;
}

.banner-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.9));
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.movie-info {
  flex: 1;
}

.movie-info h2 {
  font-size: 24px;
  margin-bottom: 10px;
}

.movie-info p {
  font-size: 14px;
  margin-bottom: 10px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.movie-meta {
  display: flex;
  gap: 20px;
  font-size: 14px;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.play-btn,
.wishlist-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.play-btn {
  background-color: #e50914;
  color: white;
}

.wishlist-btn {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
}

.play-btn:hover {
  background-color: #f40612;
}

.wishlist-btn:hover {
  background-color: rgba(255, 255, 255, 0.3);
}
</style>
