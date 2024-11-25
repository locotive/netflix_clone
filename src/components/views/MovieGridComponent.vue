<template>
  <div class="movie-grid" ref="gridContainer">
    <div v-if="isLoading && movies.length === 0" class="loading-overlay">
      <div class="loading-spinner"></div>
    </div>
    <div :class="['grid-container', currentView]">
      <div
        v-for="(movieGroup, i) in visibleMovieGroups"
        :key="i"
        :class="['movie-row', { full: movieGroup.length === rowSize }]"
      >
        <div
          v-for="movie in movieGroup"
          :key="movie.id"
          class="movie-card"
          @mouseup="toggleWishlist(movie)"
          @mouseover="showTooltip(movie.title, $event)"
          @mouseleave="hideTooltip"
          @mousemove="updateMousePosition"
        >
          <img :src="getImageUrl(movie.poster_path)" :alt="movie.title" />
          <div class="movie-title">{{ movie.title }}</div>
          <div v-if="isInWishlist(movie.id)" class="wishlist-indicator">👍</div>
        </div>
      </div>
    </div>

    <!-- 커스텀 툴팁 -->
    <div v-if="tooltip.visible" :style="tooltip.style" class="tooltip">
      {{ tooltip.text }}
    </div>

    <div class="pagination" v-if="totalPages > 1">
      <button @click="prevPage" :disabled="currentPage === 1">&lt; 이전</button>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">다음 &gt;</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import axios from 'axios'
import { useWishlist } from '@/services/wishlistService'

const props = defineProps({
  fetchUrl: String,
})

const gridContainer = ref(null)
const movies = ref([])
const currentPage = ref(1)
const rowSize = ref(4)
const moviesPerPage = ref(20)
const isMobile = ref(window.innerWidth <= 768)
const currentView = ref('grid')

const { toggleWishlist, isInWishlist } = useWishlist()

// 툴팁 상태 관리
const tooltip = ref({
  visible: false,
  text: '',
  style: {
    top: '0px',
    left: '0px',
  },
})

// 마우스 위치 관리
const mousePosition = ref({ x: 0, y: 0 })

// 마우스 위치 갱신
function updateMousePosition(event) {
  mousePosition.value = {
    x: event.clientX,
    y: event.clientY,
  }
}

// 툴팁 표시 함수
function showTooltip(text, event) {
  tooltip.value.text = text
  tooltip.value.visible = true
  tooltip.value.style = {
    top: `${event.clientY + 10}px`,
    left: `${event.clientX + 10}px`,
  }
}

// 툴팁 숨김 함수
function hideTooltip() {
  tooltip.value.visible = false
}

// 1.5초마다 툴팁 위치를 갱신
let tooltipUpdater = null
function startTooltipUpdater() {
  tooltipUpdater = setInterval(() => {
    if (tooltip.value.visible) {
      tooltip.value.style = {
        top: `${mousePosition.value.y + 10}px`,
        left: `${mousePosition.value.x + 10}px`,
      }
    }
  }, 1500)
}

function stopTooltipUpdater() {
  if (tooltipUpdater) {
    clearInterval(tooltipUpdater)
    tooltipUpdater = null
  }
}

const isLoading = ref(false)

// Fetch movies
async function fetchMovies() {
  try {
    isLoading.value = true
    const response = await axios.get(props.fetchUrl)
    movies.value = response.data.results
  } catch (error) {
    console.error('Error fetching movies:', error)
  } finally {
    isLoading.value = false
  }
}

const visibleMovieGroups = computed(() => {
  const startIndex = (currentPage.value - 1) * moviesPerPage.value
  const endIndex = startIndex + moviesPerPage.value
  const paginatedMovies = movies.value.slice(startIndex, endIndex)

  return paginatedMovies.reduce((resultArray, item, index) => {
    const groupIndex = Math.floor(index / rowSize.value)
    if (!resultArray[groupIndex]) resultArray[groupIndex] = []
    resultArray[groupIndex].push(item)
    return resultArray
  }, [])
})

const totalPages = computed(() => Math.ceil(movies.value.length / moviesPerPage.value))

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}

function prevPage() {
  if (currentPage.value > 1) currentPage.value--
}

function handleResize() {
  isMobile.value = window.innerWidth <= 768
  calculateLayout()
}

function calculateLayout() {
  if (gridContainer.value) {
    rowSize.value = isMobile.value ? 3 : 6

    const numberOfRows = 3
    moviesPerPage.value = rowSize.value * numberOfRows
  }
}

function getImageUrl(path) {
  return `https://image.tmdb.org/t/p/w300${path}`
}

// 컴포넌트 마운트 및 언마운트 시 처리
onMounted(async () => {
  await fetchMovies()
  calculateLayout()
  window.addEventListener('resize', handleResize)
  startTooltipUpdater()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  stopTooltipUpdater()
})
</script>

<style scoped>
.tooltip {
  position: fixed;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
  z-index: 1000;
  pointer-events: none;
  white-space: nowrap;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

.wishlist-indicator {
  position: absolute;
  top: 0;
  right: 10px;
  font-size: 20px;
  background-color: rgba(229, 9, 20, 0.5);
  box-shadow: 0 0 5px rgba(229, 9, 20, 0.7);
}

.movie-card.in-wishlist::after {
  content: '찜됨';
  position: absolute;
  top: 16px;
  right: 16px;
  background: #e50914;  /* Netflix 레드 컬러 */
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  z-index: 3;
  transition: all 0.3s ease;
  animation: popIn 0.3s ease;
}

.movie-card:hover.in-wishlist::after {
  transform: scale(1.1);
  background: #ff0f1f;  /* 좀 더 밝은 레드 */
}

@keyframes popIn {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.movie-grid {
  width: 100%;
  height: calc(100vh - 200px);
  margin-bottom: 40px;
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.grid-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.movie-row {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin: 0 auto 40px;
  width: 100%;
  max-width: 2000px;
}

.grid-container.list .movie-row {
  flex-direction: column;
}

.movie-card {
  position: relative;
  width: calc(16.666% - 25px);
  margin: 0;
  transition: transform 0.3s;
  cursor: pointer;
}

.grid-container.list .movie-card {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.movie-card:hover {
  transform: scale(1.05);
  z-index: 2;
}

.movie-card:hover img {
  transform: none;
}

.movie-title {
  margin-top: 8px;
  text-align: center;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 8px;
  line-height: 1.2;
  color: #fff;
  transition: color 0.3s ease;
}

.movie-card:hover .movie-title {
  color: #535bf2;
}

.grid-container.list .movie-title {
  text-align: left;
  white-space: normal;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination button {
  background-color: #333;
  color: white;
  border: none;
  padding: 10px 15px;
  margin: 0 10px;
  cursor: pointer;
  border-radius: 4px;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-left-color: #e50914;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.movie-card.in-wishlist {
  position: relative;
}

.movie-card.in-wishlist::after {
  content: '찜됨';
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(229, 9, 20, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9rem;
  z-index: 2;
}
</style>
