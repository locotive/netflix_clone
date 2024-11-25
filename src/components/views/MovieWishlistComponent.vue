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

    <!-- Grid View -->
    <div v-if="currentView === 'grid'" ref="gridContainer" class="grid-container">
      <div v-for="movie in wishlist" :key="movie.id" class="movie-card">
        <div class="poster-container">
          <img :src="getImageUrl(movie.poster_path)" :alt="movie.title" />
          <div class="movie-info">
            <h3>{{ movie.title }}</h3>
          </div>
          <button @click="toggleWishlist(movie)" class="remove-button">
            <font-awesome-icon :icon="faHeart" />
          </button>
        </div>
      </div>
    </div>

    <!-- List View -->
    <div v-else class="movie-list-container">
      <div v-for="movie in wishlist" :key="movie.id" class="movie-item">
        <div class="movie-poster">
          <img :src="getImageUrl(movie.poster_path)" :alt="movie.title" />
        </div>
        <div class="movie-info">
          <h3 class="movie-title">{{ movie.title }}</h3>
          <p class="movie-overview">{{ movie.overview }}</p>
          <div class="movie-details">
            <span class="movie-rating">
              <font-awesome-icon :icon="faStar" class="star-icon" />
              {{ movie.vote_average?.toFixed(1) }}
            </span>
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

    <div v-if="wishlist.length === 0" class="empty-wishlist">위시리스트가 비어 있습니다.</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useWishlist } from '@/services/wishlistService'
import { faHeart, faTh, faBars, faStar } from '@fortawesome/free-solid-svg-icons'

const currentView = ref('grid')
const { wishlist, toggleWishlist } = useWishlist()

function getImageUrl(path) {
  return path ? `https://image.tmdb.org/t/p/w500${path}` : '/placeholder.jpg'
}

function setView(view) {
  currentView.value = view
}
</script>

<style scoped>
.popular-container {
  width: 180vh;
  padding: 20px;
}

/* View Toggle Buttons */
.view-toggle {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
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

.movie-card:hover {
  transform: scale(1.05);
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

.movie-runtime {
  color: #888;
}

.remove-button {
  margin-left: auto;
  background: none;
  border: none;
  color: #ff4081;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 5px;
}

.remove-button:hover {
  color: #ff1744;
}

.empty-wishlist {
  text-align: center;
  padding: 40px;
  font-size: 1.2em;
  color: #666;
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
</style>
