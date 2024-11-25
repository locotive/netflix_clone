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
          >
            <div class="image-wrapper" @click="handleWishlistToggle(movie)">
              <img :src="getImageUrl(movie.poster_path)" :alt="movie.title" />
            </div>
            <div v-if="isInWishlist(movie.id)" class="wishlist-indicator">👍</div>
            <div class="grid-actions">
              <button class="grid-info-btn" @click.stop="showMovieDetails(movie)">
                상세정보
              </button>
            </div>
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
    <div v-if="selectedMovie" class="movie-modal" @click.self="closeModal">
      <div class="modal-content">
        <div
          class="modal-backdrop"
          :style="{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${selectedMovie.backdrop_path})`,
          }"
        >
          <div class="backdrop-overlay"></div>
        </div>

        <button class="close-btn" @click="closeModal">
          <font-awesome-icon :icon="faTimes" />
        </button>

        <div class="modal-body">
          <div class="modal-main-info">
            <img
              :src="getImageUrl(selectedMovie.poster_path)"
              :alt="selectedMovie.title"
              class="modal-poster"
            />
            <div class="modal-text-content">
              <h2 class="movie-title">{{ selectedMovie.title }}</h2>
              <div class="meta-info">
                <span class="rating">
                  <font-awesome-icon :icon="faStar" /> {{ selectedMovie.vote_average?.toFixed(1) }}
                </span>
                <span class="year">{{ selectedMovie.release_date?.split('-')[0] }}</span>
                <span class="runtime" v-if="selectedMovie.runtime">
                  {{ selectedMovie.runtime }}분
                </span>
              </div>
              <p class="overview">{{ selectedMovie.overview }}</p>
              <div class="genre-tags" v-if="selectedMovie.genres">
                <span v-for="genre in selectedMovie.genres" :key="genre.id" class="genre-tag">
                  {{ genre.name }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import axios from 'axios'
import { useWishlist } from '@/services/wishlistService'
import { useToast } from "vue-toastification";
import { faTimes, faStar } from '@fortawesome/free-solid-svg-icons'

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

const selectedMovie = ref(null)

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
    if (props.title === "인기 영화") {
      movies.value = response.data.results.slice(1)
    } else {
      movies.value = response.data.results || []
    }
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

function showMovieDetails(movie) {
  selectedMovie.value = movie
}

function closeModal() {
  selectedMovie.value = null
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

.grid-actions {
  position: absolute;
  bottom: 10px;
  right: 10px;
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 2;
}

.grid-info-btn {
  padding: 8px 16px;
  border-radius: 20px;
  background: rgba(180, 180, 180, 0.9);
  backdrop-filter: blur(4px);
  border: 2px solid rgba(255, 255, 255, 0.5);
  color: #1a1a1a;
  font-size: 0.9em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.grid-info-btn:hover {
  transform: scale(1.05);
  background: rgba(210, 210, 210, 1);
  border-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0 6px 20px rgba(255, 255, 255, 0.3);
}

.movie-card:hover .grid-actions {
  opacity: 1;
  transform: translateY(-5px);
}

.movie-modal {
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

.modal-content {
  width: 95%;
  max-width: 1400px;
  max-height: 95vh;
  background: #141414;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  animation: modalFadeIn 0.3s ease;
}

.modal-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  z-index: 0;
}

.backdrop-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(20, 20, 20, 0.5), #141414);
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.6);
  border: none;
  color: white;
  border-radius: 50%;
  cursor: pointer;
  z-index: 2;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-body {
  position: relative;
  z-index: 1;
  padding: 30px;
}

.modal-main-info {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 30px;
  margin-top: 150px;
}

.modal-poster {
  width: 300px;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
}

.modal-text-content {
  color: white;
}

.modal-text-content h2.movie-title {
  font-size: 2.5em;
  margin: 0 0 15px 0;
  text-align: left;
}

.meta-info {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  color: #999;
}

.overview {
  font-size: 1.1em;
  line-height: 1.6;
  margin-bottom: 20px;
  color: #ccc;
}

.genre-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 15px;
}

.genre-tag {
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  font-size: 0.9em;
  color: #fff;
  backdrop-filter: blur(4px);
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@media (max-width: 768px) {
  .modal-main-info {
    grid-template-columns: 1fr;
  }
}
</style>
