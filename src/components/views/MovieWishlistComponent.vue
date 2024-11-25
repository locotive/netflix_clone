<template>
  <div class="movie-grid" ref="gridContainer">
    <div v-if="wishlist.length === 0" class="empty-message">위시리스트가 비어 있습니다.</div>
    <div v-else class="grid-container">
      <div class="movie-row">
        <div
          v-for="movie in wishlist"
          :key="movie.id"
          class="movie-card"
          @mouseover="showTooltip(movie.title, $event)"
          @mouseleave="hideTooltip"
          @mousemove="updateMousePosition"
        >
          <div class="poster-container" @click="toggleWishlist(movie)">
            <img :src="getImageUrl(movie.poster_path)" :alt="movie.title" />
            <div class="wishlist-indicator">
              <font-awesome-icon :icon="faHeart" />
            </div>
          </div>

          <div class="movie-title">{{ movie.title }}</div>

          <button class="info-btn" @click="showMovieDetails(movie)">
            <font-awesome-icon :icon="faInfoCircle" /> 상세정보
          </button>
        </div>
      </div>
    </div>

    <div v-if="tooltip.visible" :style="tooltip.style" class="tooltip">
      {{ tooltip.text }}
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

          <div v-if="trailerUrl" class="trailer-section">
            <h3>트레일러</h3>
            <div class="trailer-container">
              <iframe
                :src="trailerUrl"
                frameborder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useWishlist } from '@/services/wishlistService'
import { faHeart, faInfoCircle, faTimes, faStar } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'

const { wishlist, toggleWishlist } = useWishlist()

function getImageUrl(path) {
  return path ? `https://image.tmdb.org/t/p/w300${path}` : '/placeholder.jpg'
}

const tooltip = ref({
  visible: false,
  text: '',
  style: {
    top: '0px',
    left: '0px',
  },
})

function showTooltip(text, event) {
  tooltip.value.text = text
  tooltip.value.visible = true
  tooltip.value.style = {
    top: `${event.clientY + 10}px`,
    left: `${event.clientX + 10}px`,
  }
}

function hideTooltip() {
  tooltip.value.visible = false
}

function updateMousePosition(event) {
  if (tooltip.value.visible) {
    tooltip.value.style = {
      top: `${event.clientY + 10}px`,
      left: `${event.clientX + 10}px`,
    }
  }
}

const selectedMovie = ref(null)
const trailerUrl = ref(null)

async function showMovieDetails(movie) {
  selectedMovie.value = movie
  await fetchTrailer(movie.id)
}

async function fetchTrailer(movieId) {
  try {
    const apiKey = import.meta.env.VITE_TMDB_API_KEY
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}&language=ko-KR`,
    )
    const trailer = response.data.results.find(
      (video) => video.type === 'Trailer' || video.type === 'Teaser',
    )
    if (trailer) {
      trailerUrl.value = `https://www.youtube.com/embed/${trailer.key}`
    }
  } catch (error) {
    console.error('Error fetching trailer:', error)
    trailerUrl.value = null
  }
}

function closeModal() {
  selectedMovie.value = null
  trailerUrl.value = null
}
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

.movie-grid {
  width: 100%;
  margin-bottom: 40px;
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.grid-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  padding: 0 20px;
}

.movie-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 30px;
  width: 100%;
  max-width: 2000px;
}

.movie-card {
  position: relative;
  transition: transform 0.3s ease;
}

.poster-container {
  position: relative;
  cursor: pointer;
}

.wishlist-indicator {
  position: absolute;
  top: 10px;
  right: 10px;
  color: #e50914;
  background: rgba(0, 0, 0, 0.5);
  padding: 5px;
  border-radius: 50%;
}

.info-btn {
  width: 100%;
  padding: 8px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.info-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.movie-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
}

.modal-content {
  width: 90%;
  max-width: 1200px;
  max-height: 90vh;
  background: #141414;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.5);
  animation: modalFadeIn 0.3s ease-out;
}

.modal-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 400px;
  background-size: cover;
  background-position: center;
}

.backdrop-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(20, 20, 20, 0.2) 0%,
    rgba(20, 20, 20, 0.8) 50%,
    #141414 100%
  );
}

.modal-body {
  position: relative;
  padding: 30px;
  overflow-y: auto;
  max-height: 90vh;
}

.modal-main-info {
  display: flex;
  gap: 30px;
  margin-top: 250px;
}

.modal-poster {
  width: 250px;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
}

.modal-text-content {
  flex: 1;
}

.movie-title {
  font-size: 12px;
  color: white;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
}

.meta-info {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  color: #ccc;
}

.rating {
  color: #ffd700;
}

.overview {
  font-size: 1.1em;
  line-height: 1.6;
  color: #ccc;
  margin-bottom: 20px;
}

.genre-tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.genre-tag {
  padding: 5px 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  font-size: 0.9em;
  color: #fff;
}

.trailer-section {
  margin-top: 40px;
}

.trailer-section h3 {
  color: white;
  margin-bottom: 15px;
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  font-size: 1.5em;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 2;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
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
    flex-direction: column;
    margin-top: 150px;
  }

  .modal-poster {
    width: 200px;
    margin: 0 auto;
  }

  .movie-title {
    font-size: 1.8em;
  }
}

.empty-message {
  text-align: center;
  padding: 40px;
  font-size: 1.2em;
  color: #666;
}

@media (max-width: 1200px) {
  .movie-card {
    width: calc(20% - 24px);
  }
}

@media (max-width: 992px) {
  .movie-card {
    width: calc(25% - 22.5px);
  }
}

@media (max-width: 768px) {
  .movie-card {
    width: calc(33.333% - 20px);
  }
  .movie-row {
    gap: 20px;
  }
  .grid-container {
    padding: 0 15px;
  }
  .remove-btn {
    opacity: 1;
    padding: 6px 10px;
    font-size: 0.8em;
  }
}

@media (max-width: 480px) {
  .movie-card {
    width: calc(50% - 15px);
  }
  .movie-row {
    gap: 15px;
  }
  .grid-container {
    padding: 0 10px;
  }
}
</style>
