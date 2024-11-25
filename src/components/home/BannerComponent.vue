<template>
  <div v-if="movie" class="banner" :style="{ backgroundImage: `url(${backdropUrl})` }">
    <div class="banner-content">
      <h1>{{ movie.title }}</h1>
      <p>{{ movie.overview }}</p>
      <div class="button-group">
        <button class="play-btn title-btn">재생</button>
        <button class="info-btn title-btn">상세 정보</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  movie: Object,
})

const backdropUrl = computed(() => {
  return props.movie ? `https://image.tmdb.org/t/p/original${props.movie.backdrop_path}` : ''
})
</script>

<style scoped>
/* 배너 스타일 */
.banner {
  width: 100%;
  height: 50vh;
  background-size: cover;
  background-position: center;
  color: white;
  display: flex;
  align-items: flex-end;
  margin: 0;
  border-radius: 0;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
}

.banner-content {
  padding: 30px 60px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.banner h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.8);
}

.banner p {
  font-size: 1rem;
  max-width: 70%;
  margin-bottom: 1.5rem;
  text-align: left;
  line-height: 1.5;
}

.button-group {
  display: flex;
  gap: 10px;
}

.play-btn,
.info-btn {
  padding: 12px 25px;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.play-btn {
  background-color: white;
  color: black;
}

.play-btn:hover {
  background-color: #e5e5e5;
}

.info-btn {
  background-color: rgba(109, 109, 110, 0.7);
  color: white;
}

.info-btn:hover {
  background-color: rgba(109, 109, 110, 1);
}

@media screen and (max-width: 1024px) {
  .banner {
    width: 100%;
    height: 40vh;
  }

  .banner-content {
    padding: 20px;
  }

  .banner h1 {
    font-size: 2rem;
  }

  .banner p {
    font-size: 0.9rem;
    max-width: 80%;
  }

  .play-btn,
  .info-btn {
    padding: 10px 20px;
    font-size: 0.9rem;
  }
}

@media screen and (max-width: 768px) {
  .banner {
    height: 35vh;
  }

  .banner h1 {
    font-size: 1.8rem;
  }

  .banner p {
    font-size: 0.8rem;
  }

  .play-btn,
  .info-btn {
    padding: 8px 18px;
    font-size: 0.8rem;
  }
}
</style>
