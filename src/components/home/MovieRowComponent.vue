<template>
  <div class="movie-row">
    <h2>{{ title }}</h2>
    <div
      class="slider-container"
      @wheel="handleWheel"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
      @mousemove="showButtons = true"
      @mouseleave="showButtons = false"
    >
      <button
        class="slider-button left"
        @click="slide('left')"
        :style="{ opacity: showButtons && !atLeftEdge ? 1 : 0 }"
        :disabled="atLeftEdge"
      >
        &lt;
      </button>

      <div class="slider-window" ref="sliderWindow">
        <div
          class="movie-slider"
          ref="slider"
          :style="{ transform: `translateX(-${scrollAmount}px)` }"
        >
          <div
            v-for="movie in movies"
            :key="movie.id"
            class="movie-card"
            @click="handleWishlistToggle(movie)"
          >
            <div class="image-wrapper">
              <img :src="getImageUrl(movie.poster_path)" :alt="movie.title" />
            </div>
            <!-- 좋아요 인디케이터 -->
            <div v-if="isInWishlist(movie.id)" class="wishlist-indicator">👍</div>
          </div>
        </div>
      </div>

      <button
        class="slider-button right"
        @click="slide('right')"
        :style="{ opacity: showButtons && !atRightEdge ? 1 : 0 }"
        :disabled="atRightEdge"
      >
        &gt;
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import axios from 'axios'
import { useWishlist } from '@/services/wishlistService'
import { useToast } from "vue-toastification";

const props = defineProps({
  title: String,
  fetchUrl: String,
})

const movies = ref([])
const scrollAmount = ref(0)
const showButtons = ref(false)
let touchStartX = 0
let touchEndX = 0
const maxScroll = ref(0)

const slider = ref(null)
const sliderWindow = ref(null)

const toast = useToast();
const { toggleWishlist: toggleWishlistService, isInWishlist } = useWishlist()

const atLeftEdge = computed(() => scrollAmount.value <= 0)
const atRightEdge = computed(() => scrollAmount.value >= maxScroll.value)

onMounted(async () => {
  if (!props.fetchUrl) {
    console.error('Fetch URL is not defined!')
    return
  }

  await fetchMovies()

  // Debugging logs for slider and sliderWindow references
  console.log('Slider:', slider.value)
  console.log('Slider Window:', sliderWindow.value)

  window.addEventListener('resize', calculateMaxScroll)
  calculateMaxScroll()
})

onUnmounted(() => {
  window.removeEventListener('resize', calculateMaxScroll)
})

async function fetchMovies() {
  try {
    console.log('Fetching movies from:', props.fetchUrl)
    const response = await axios.get(props.fetchUrl)
    movies.value = response.data.results || []
    console.log(`Fetched movies for ${props.title}:`, movies.value)
  } catch (error) {
    console.error('Error fetching movies:', error)
  }
}

function getImageUrl(path) {
  return `https://image.tmdb.org/t/p/original${path}`
}

function slide(direction) {
  const slideAmount = (sliderWindow.value.clientWidth / 7) * 3
  if (direction === 'left') {
    scrollAmount.value = Math.max(0, scrollAmount.value - slideAmount)
  } else {
    scrollAmount.value = Math.min(maxScroll.value, scrollAmount.value + slideAmount)
  }
}

function handleWheel(event) {
  event.preventDefault()
  if (event.deltaY > 0) slide('right')
  else slide('left')
}

function handleTouchStart(event) {
  touchStartX = event.touches[0].clientX
}

function handleTouchMove(event) {
  touchEndX = event.touches[0].clientX
}

function handleTouchEnd() {
  const touchDiff = touchStartX - touchEndX
  if (Math.abs(touchDiff) > 50) {
    slide(touchDiff > 0 ? 'right' : 'left')
  }
}

function calculateMaxScroll() {
  if (slider.value && sliderWindow.value) {
    // sliderWindow와 slider의 크기 차이를 기반으로 maxScroll 계산
    const sliderWidth = slider.value.scrollWidth
    const windowWidth = sliderWindow.value.clientWidth

    maxScroll.value = sliderWidth - windowWidth
    console.log('Max Scroll Calculated:', maxScroll.value)
  } else {
    console.error('Slider or SliderWindow references are not available.')
  }
}

function handleWishlistToggle(movie) {
  const wasInWishlist = isInWishlist(movie.id);
  toggleWishlistService(movie);

  if (!wasInWishlist) {
    toast.success(`'${movie.title}' 위시리스트에 추가되었습니다!`);
  } else {
    toast.info(`'${movie.title}' 위시리스트에서 제거되었습니다.`);
  }
}
</script>

<style scoped>
.movie-card {
  position: relative;
  width: 100%;
  display: inline-block;
  aspect-ratio: 27/40;
  transition: transform 0.3s;
  transform-origin: center center;
  margin-top: 10px;
  margin-bottom:15px;
}

.movie-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.image-wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 4px;
}

.movie-card:hover {
  transform: scale(1.1);
  z-index: 1;
}

.wishlist-indicator {
  position: absolute;
  top: 0;
  right: 10px;
  font-size: 20px;
  background-color: rgba(229, 9, 20, 0.5);
  box-shadow: 0 0 5px rgba(229, 9, 20, 0.7);
  border-radius: 0 4px 0 4px;
  padding: 5px 8px;
  color: white;
  z-index: 2;
}

.movie-row {
  margin-bottom: 40px;
  position: relative;
  width: 100%;
  overflow: hidden;
  margin-top: 10px;
}

.movie-row h2 {
  text-align: left;
  margin-left: 10px;
  margin-top: 15px;
  margin-bottom: 10px;
}

.slider-container {
  position: relative;
  overflow: visible;
  padding: 2px 0;
  touch-action: pan-y;
  display: flex;
  justify-content: center;
}

.slider-window {
  overflow: visible;
  width: 100%;
  margin: 0 auto;
  max-width: 95vw;
  padding: 2px 0;
}

.movie-slider {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(calc(14.28% - 20px), 200px);
  gap: 20px;
  transition: transform 0.3s ease;
  overflow: visible;
}

.slider-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 20px 10px;
  cursor: pointer;
  z-index: 10;
  transition:
    opacity 0.3s,
    background-color 0.3s;
}

.slider-button:hover {
  background-color: rgba(0, 0, 0, 0.8);
}

.slider-button.left {
  left: 0;
}

.slider-button.right {
  right: 0;
}

.slider-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 1400px) {
  .movie-slider {
    grid-auto-columns: calc(16.666% - 10px); /* 6개 */
  }
}

@media (max-width: 1200px) {
  .movie-slider {
    grid-auto-columns: calc(20% - 10px); /* 5개 */
  }
}

@media (max-width: 992px) {
  .movie-slider {
    grid-auto-columns: calc(33.333% - 10px); /* 3개 */
  }
}

@media (max-width: 768px) {
  .movie-slider {
    grid-auto-columns: calc(33.333% - 10px); /* 3개 */
  }
}

@media (max-width: 480px) {
  .movie-slider {
    grid-auto-columns: calc(100% - 5px); /* 1개 */
  }
}
</style>
