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
      <div v-for="(movie, index) in wishlistMovies" :key="index" class="movie-card">
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
    <div v-if="currentView === 'list'" class="list-container">
      <div v-for="(movie, index) in wishlistMovies" :key="index" class="movie-list-item">
        <img :src="getImageUrl(movie.poster_path)" :alt="movie.title" />
        <div class="movie-list-info">
          <h3>{{ movie.title }}</h3>
          <p v-if="movie.release_date">개봉일: {{ movie.release_date }}</p>
          <p v-if="movie.vote_average">평점: {{ movie.vote_average.toFixed(1) }}</p>
        </div>
        <button @click="toggleWishlist(movie)" class="list-remove-button">
          <font-awesome-icon :icon="faHeart" />
        </button>
      </div>
    </div>

    <div v-if="wishlistMovies.length === 0" class="empty-wishlist">위시리스트가 비어 있습니다.</div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import { useWishlist } from '@/services/wishlistService'
import { faHeart, faTh, faBars } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

export default {
  name: 'MovieWishlistComponent',
  components: {
    FontAwesomeIcon,
  },
  setup() {
    const { getCurrentWishlist, toggleWishlist } = useWishlist()
    const wishlistMovies = ref(getCurrentWishlist())
    const currentView = ref('grid')

    const getImageUrl = (posterPath) => {
      return posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : '/placeholder-image.jpg'
    }

    const setView = (view) => {
      currentView.value = view
    }

    watch(
      () => getCurrentWishlist(),
      (newWishlist) => {
        wishlistMovies.value = newWishlist
      },
    )

    return {
      wishlistMovies,
      toggleWishlist,
      getImageUrl,
      currentView,
      setView,
      faHeart,
      faTh,
      faBars,
    }
  },
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
.list-container {
  padding: 20px;
}

.movie-list-item {
  display: flex;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #ddd;
  gap: 20px;
}

.movie-list-item img {
  width: 100px;
  height: 150px;
  object-fit: cover;
  border-radius: 4px;
}

.movie-list-info {
  flex-grow: 1;
}

.movie-list-info h3 {
  margin: 0 0 10px 0;
}

.movie-list-info p {
  margin: 5px 0;
  color: #666;
}

/* Common Styles */
.poster-container {
  position: relative;
  width: 100%;
  aspect-ratio: 2/3;
}

.poster-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.movie-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
}

.movie-info h3 {
  margin: 0;
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Grid View Remove Button */
.remove-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: #ff4081;
  cursor: pointer;
  font-size: 1.5rem;
  padding: 5px;
  z-index: 1;
}

/* List View Remove Button */
.list-remove-button {
  background: none;
  border: none;
  color: #ff4081;
  cursor: pointer;
  font-size: 1.5rem;
  padding: 5px;
  margin-right: 20px;
}

.remove-button:hover,
.list-remove-button:hover {
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

  .movie-list-item {
    flex-direction: column;
    text-align: center;
  }

  .movie-list-item img {
    width: 150px;
    height: 225px;
  }
}
</style>
