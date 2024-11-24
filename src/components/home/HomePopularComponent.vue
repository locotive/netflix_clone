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

    <!-- Movie Views -->
    <MovieGrid v-if="currentView === 'grid'" :fetchUrl="fetchUrl" />
    <MovieInfiniteScroll
      v-if="currentView === 'list'"
      :apiKey="apiKey"
      :fetchUrl="fetchUrl"
      genreCode="0"
      sortingOrder="all"
      :voteAverage="-1"
    />
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { faTh, faBars } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import MovieGrid from '@/components/views/MovieGridComponent.vue'
import MovieInfiniteScroll from '@/components/views/MovieInfiniteScrollComponent.vue'
import URLService from '@/services/urlService'

export default {
  name: 'HomePopularComponent',
  components: {
    FontAwesomeIcon,
    MovieGrid,
    MovieInfiniteScroll,
  },
  setup() {
    // API Key from .env
    const apiKey = import.meta.env.VITE_TMDB_API_KEY || ''
    if (!apiKey) {
      console.error('API Key is missing! Please check your .env file.')
    }

    // Current view state: 'grid' or 'list'
    const currentView = ref('grid')

    // Fetch URL for popular movies
    const fetchUrl = computed(() => {
      return URLService.getURL4PopularMovies(1)
    })

    // View toggle function
    const setView = (view) => {
      currentView.value = view
    }

    return {
      faTh,
      faBars,
      apiKey,
      fetchUrl,
      currentView,
      setView,
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

/* Responsive Styles */
@media (max-width: 768px) {
  .popular-container {
    padding: 10px;
  }

  .view-toggle {
    margin-top: 30px;
  }
}
</style>
