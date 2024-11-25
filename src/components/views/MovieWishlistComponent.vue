<template>
  <div class="wishlist-container">
    <!-- 뷰 토글 버튼 -->
    <div class="view-toggle">
      <button @click="currentView = 'grid'" :class="{ active: currentView === 'grid' }">
        <font-awesome-icon :icon="faTh" />
      </button>
      <button @click="currentView = 'list'" :class="{ active: currentView === 'list' }">
        <font-awesome-icon :icon="faBars" />
      </button>
    </div>

    <div v-if="wishlist.length === 0" class="empty-message">위시리스트가 비어 있습니다.</div>

    <template v-else>
      <!-- 그리드 뷰 -->
      <div v-if="currentView === 'grid'" class="grid-view">
        <div class="movie-row">
          <div v-for="movie in wishlist" :key="movie.id" class="movie-card">
            <div class="poster-container" @click="toggleWishlist(movie)">
              <img :src="getImageUrl(movie.poster_path)" :alt="movie.title" />
              <div class="overlay">
                <div class="movie-title">{{ movie.title }}</div>
                <button class="info-btn" @click.stop="showMovieDetails(movie)">
                  <font-awesome-icon :icon="faInfoCircle" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 리스트 뷰 -->
      <div v-else class="list-view">
        <div v-for="movie in wishlist" :key="movie.id" class="list-item">
          <img :src="getImageUrl(movie.poster_path)" :alt="movie.title" class="list-poster" />
          <div class="list-content">
            <h3>{{ movie.title }}</h3>
            <div class="list-meta">
              <span>{{ movie.release_date?.split('-')[0] }}</span>
              <span v-if="movie.runtime">{{ movie.runtime }}분</span>
              <span>⭐ {{ movie.vote_average?.toFixed(1) }}</span>
            </div>
            <p class="list-overview">{{ movie.overview }}</p>
          </div>
          <div class="list-actions">
            <button class="info-btn" @click="showMovieDetails(movie)">
              <font-awesome-icon :icon="faInfoCircle" /> 상세정보
            </button>
            <button class="remove-btn" @click="toggleWishlist(movie)">
              <font-awesome-icon :icon="faHeart" /> 찜해제
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useWishlist } from '@/services/wishlistService'
import { faHeart, faInfoCircle, faTh, faBars } from '@fortawesome/free-solid-svg-icons'

const currentView = ref('grid')
const { wishlist, toggleWishlist } = useWishlist()

function getImageUrl(path) {
  return path ? `https://image.tmdb.org/t/p/w300${path}` : '/placeholder.jpg'
}

function showMovieDetails(movie) {
  // 상세 정보 모달 표시 로직
  console.log('Show details for:', movie.title)
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
  align-items: center;
  gap: 12px;
  margin: 15px 0;
  color: #fff;
}

.star-icon {
  color: #ffd700;
  margin-right: 4px;
}

.rating,
.year,
.runtime {
  font-size: 1.1em;
  display: flex;
  align-items: center;
}

.rating::after,
.year::after {
  content: '•';
  margin-left: 12px;
  opacity: 0.6;
}

.overview {
  font-size: 1.1em;
  line-height: 1.6;
  color: #ccc;
  margin-bottom: 20px;
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

/* 뷰 토글 버튼 스타일 */
.view-toggle {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  justify-content: flex-end;
  padding-right: 20px;
}

.view-toggle button {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-toggle button.active {
  background: rgba(255, 255, 255, 0.3);
}

/* 리스트 뷰 스타일 */
.list-view {
  padding: 0 20px;
}

.list-item {
  display: flex;
  gap: 20px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  margin-bottom: 15px;
  transition: transform 0.2s ease;
}

.list-item:hover {
  transform: scale(1.01);
  background: rgba(255, 255, 255, 0.08);
}

.list-poster {
  width: 100px;
  height: 150px;
  object-fit: cover;
  border-radius: 4px;
}

.list-content {
  flex: 1;
}

.list-content h3 {
  margin: 0 0 10px 0;
  font-size: 1.2em;
}

.list-meta {
  display: flex;
  gap: 15px;
  color: #999;
  margin-bottom: 10px;
}

.list-overview {
  color: #ccc;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
}

.list-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
}

.list-actions button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.2s ease;
}

.list-actions .info-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.list-actions .remove-btn {
  background: rgba(229, 9, 20, 0.8);
  color: white;
}

.list-actions button:hover {
  transform: scale(1.05);
}

/* 반응형 스타일 */
@media (max-width: 768px) {
  .list-item {
    flex-direction: column;
  }

  .list-poster {
    width: 100%;
    height: 200px;
  }

  .list-actions {
    flex-direction: row;
    justify-content: flex-end;
  }
}
</style>
