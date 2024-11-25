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
          <img :src="getImageUrl(movie.poster_path)" :alt="movie.title" />
          <div class="movie-title">{{ movie.title }}</div>
          <button class="remove-btn" @click.stop="toggleWishlist(movie)">
            <font-awesome-icon :icon="faHeart" /> 찜해제
          </button>
        </div>
      </div>
    </div>

    <!-- 커스텀 툴팁 -->
    <div v-if="tooltip.visible" :style="tooltip.style" class="tooltip">
      {{ tooltip.text }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useWishlist } from '@/services/wishlistService'
import { faHeart } from '@fortawesome/free-solid-svg-icons'

const { wishlist, toggleWishlist } = useWishlist()

function getImageUrl(path) {
  return path ? `https://image.tmdb.org/t/p/w300${path}` : '/placeholder.jpg'
}

// 툴팁 관련 로직
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
  width: calc(16.666% - 25px);
  margin: 0;
  transition: transform 0.3s;
  position: relative;
  flex-shrink: 0;
}

.movie-card:hover {
  transform: scale(1.1);
}

.movie-card img {
  width: 100%;
  height: auto;
  aspect-ratio: 27/40;
  border-radius: 8px;
  object-fit: cover;
}

.movie-title {
  margin-top: 5px;
  text-align: center;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.remove-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 8px 12px;
  background-color: rgba(229, 9, 20, 0.8);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.9em;
  opacity: 0;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 5px;
  backdrop-filter: blur(2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.movie-card:hover .remove-btn {
  opacity: 1;
}

.remove-btn:hover {
  background-color: rgba(229, 9, 20, 1);
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
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
