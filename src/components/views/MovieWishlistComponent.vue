<template>
  <div class="popular-container">
    <!-- View Toggle Buttons -->
    <div class="view-toggle" role="tablist">
      <button
        @click="setView('grid')"
        :class="{ active: currentView === 'grid' }"
        :aria-selected="currentView === 'grid'"
        aria-label="그리드 보기"
        role="tab"
      >
        <font-awesome-icon :icon="faTh" />
      </button>
      <button
        @click="setView('list')"
        :class="{ active: currentView === 'list' }"
        :aria-selected="currentView === 'list'"
        aria-label="리스트 보기"
        role="tab"
      >
        <font-awesome-icon :icon="faBars" />
      </button>
    </div>

    <div v-if="wishlist.length === 0" class="empty-message">위시리스트가 비어 있습니다.</div>

    <template v-else>
      <!-- 그리드 뷰 -->
      <div v-if="currentView === 'grid'" class="movie-grid">
        <div class="grid-container">
          <div class="movie-row">
            <div v-for="movie in wishlist" :key="movie.id" class="movie-card">
              <div class="poster-container" @click="toggleWishlist(movie)">
                <img :src="getImageUrl(movie.poster_path)" :alt="movie.title" />
                <div class="remove-overlay">
                  <font-awesome-icon :icon="faHeart" class="heart-icon" />
                  <span>찜 해제</span>
                </div>
              </div>
              <div class="movie-title">{{ movie.title }}</div>
              <div class="grid-actions">
                <button class="grid-info-btn" @click.stop="showMovieDetails(movie)">
                  상세정보
                </button>
              </div>
            </div>
          </div>
          <button @click="toggleWishlist(movie)" class="remove-button">
            <font-awesome-icon :icon="faHeart" />
          </button>
        </div>
      </div>
    </div>

    <!-- List View -->
    <div v-else class="movie-list-container">
      <div v-for="movie in wishlistMovies" :key="movie.id" class="movie-item">
        <div class="movie-poster">
          <img :src="getImageUrl(movie.poster_path)" :alt="movie.title" />
        </div>
        <div class="movie-info">
          <h3 class="movie-title">{{ movie.title }}</h3>
          <div class="movie-genres">
            {{ movie.genres?.map((genre) => genre.name).join(', ') }}
          </div>
          <p class="movie-overview">{{ movie.overview }}</p>
          <div class="movie-details">
            <span class="movie-rating">
              <font-awesome-icon :icon="faStar" class="star-icon" />
              {{ movie.vote_average?.toFixed(1) }}
            </span>
            <span class="movie-runtime" v-if="movie.runtime"> {{ movie.runtime }}분 </span>
            <span class="movie-year">
              {{ movie.release_date?.split('-')[0] }}
            </span>
            <button @click="toggleWishlist(movie)" class="remove-button">
              <font-awesome-icon :icon="faHeart" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="wishlistMovies.length === 0" class="empty-wishlist">위시리스트가 비어 있습니다.</div>
  </div>
</template>

<script>
import { ref, watch, onMounted } from 'vue'
import { useWishlist } from '@/services/wishlistService'

import {
  faHeart,
  faTh,
  faBars,
  faTimes,
  faStar,
} from '@fortawesome/free-solid-svg-icons'

const currentView = ref('grid')
const selectedMovie = ref(null)
const { wishlist, toggleWishlist } = useWishlist()

function getImageUrl(path) {
  return path ? `https://image.tmdb.org/t/p/w300${path}` : '/placeholder.jpg'
}

function showMovieDetails(movie) {
  selectedMovie.value = movie
}

function closeModal() {
  selectedMovie.value = null
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
  justify-content: flex-start;
  gap: 30px;
  margin: 0 auto 40px;
  width: 100%;
  max-width: 2000px;
  flex-wrap: wrap;
  padding: 0 20px;
}

.movie-card {
  width: calc(16.666% - 25px);
  margin: 0;
  transition: transform 0.3s;
  position: relative;
}

.movie-card:hover {
  transform: scale(1.1);
  z-index: 1;
}

.movie-card img {
  width: 100%;
  height: auto;
  aspect-ratio: 27/40;
  border-radius: 8px;
  object-fit: cover;
}

.poster-container {
  position: relative;
  cursor: pointer;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.poster-container:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.remove-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  color: white;
}

.remove-overlay .heart-icon {
  font-size: 2em;
  color: #e50914;
  margin-bottom: 10px;
}

.poster-container:hover .remove-overlay {
  opacity: 1;
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

.movie-title {
  margin-top: 5px;
  text-align: center;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 8px;
  line-height: 1.2;
  color: #fff;
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
    margin-top: 100px;
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

/* View Toggle Buttons */
.view-toggle {
  display: flex;
  justify-content: flex-end;
  margin: 20px 0 30px;
  padding: 0 20px;
}

.view-toggle button {
  background-color: #333;
  color: white;
  border: none;
  padding: 10px 15px;
  margin-left: 10px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.view-toggle button.active {
  background-color: #535bf2;
}

.view-toggle button:focus {
  outline: 2px solid #fff;
  outline-offset: 2px;
}

/* Grid View Styles */
.grid-container {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
  padding: 20px;
}

.movie-card {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s;
}


/* 리스트 뷰 스타일 */
.list-view {
  padding: 0 20px;
  margin-top: 20px;
}

/* List View Styles */
.movie-list-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.movie-item {
  display: flex;
  margin-bottom: 20px;
  background: #1a1a1a;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s;
}

.movie-item:hover {
  transform: translateY(-2px);
}

.movie-poster {
  flex: 0 0 150px;
}

.movie-poster img {
  width: 100%;
  height: 225px;
  object-fit: cover;
}

.movie-info {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.movie-title {
  margin: 0;
  font-size: 1.5rem;
  color: #fff;
}

.movie-genres {
  color: #888;
  font-size: 0.9rem;
}

.movie-overview {
  margin: 0;
  color: #ccc;
  font-size: 0.9rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.movie-details {
  margin-top: auto;
  display: flex;
  align-items: center;
  gap: 15px;
  color: #999;
}

.movie-rating {
  display: flex;
  align-items: center;
  gap: 5px;
}

.star-icon {
  color: #ffd700;
}

/* 그리드 뷰 버튼 스타일 수정 */
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

@media (max-width: 768px) {
  .popular-container {
    padding: 10px;
  }

  .grid-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    padding: 10px;
  }

  .movie-item {
    flex-direction: column;
  }

  .movie-poster {
    flex: 0 0 auto;
  }

  .movie-poster img {
    width: 100%;
    height: 300px;
  }

  .movie-info {
    padding: 15px;
  }
}

/* 그리드 뷰 스타일 수정 */
.movie-grid {
  margin-top: 20px;
}
</style>
