<template>
  <div class="home">
    <Banner v-if="featuredMovie" :movie="featuredMovie" />

    <MovieRow title="인기 영화" :fetchUrl="popularMoviesUrl" />
    <MovieRow title="최신 영화" :fetchUrl="newReleasesUrl" />
    <MovieRow title="액션 영화" :fetchUrl="actionMoviesUrl" />
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { faSearch, faUser } from '@fortawesome/free-solid-svg-icons'
import Banner from '@/components/home/BannerComponent.vue'
import MovieRow from '@/components/home/MovieRowComponent.vue'
import URLService from '@/services/urlService.js'
import axios from 'axios'

export default {
  name: 'HomeMainComponent',
  components: {
    Banner,
    MovieRow,
  },
  setup(props) {
    const faSearchIcon = faSearch
    const faUserIcon = faUser
    const apiKey = import.meta.env.VITE_TMDB_API_KEY
    const featuredMovie = ref(null)
    const popularMovies = ref([])
    const popularMoviesUrl = ref(URLService.getURL4PopularMovies(1))
    const newReleasesUrl = ref(URLService.getURL4ReleaseMovies(2))
    const actionMoviesUrl = ref(URLService.getURL4GenreMovies('28', 1))

    const loadFeaturedAndPopular = async () => {
      try {
        // 인기 영화 전체 목록을 가져옴
        const response = await axios.get(popularMoviesUrl.value)
        const movies = response.data.results

        // 첫 번째 영화를 featured로 설정
        featuredMovie.value = movies[0]

        // 나머지 영화들을 popularMovies로 설정
        popularMovies.value = movies.slice(1)

        // popularMoviesUrl을 수정된 목록으로 업데이트
        popularMoviesUrl.value = URLService.getURL4PopularMovies(1) +
          `&page=1&without_movies=${featuredMovie.value.id}`

      } catch (error) {
        console.error('Error loading movies:', error)
      }
    }

    const initializeScrollListener = () => {
      const onScroll = () => {
        const header = document.querySelector('.app-header')
        if (window.scrollY > 50) {
          header?.classList.add('scrolled')
        } else {
          header?.classList.remove('scrolled')
        }
      }
      window.addEventListener('scroll', onScroll)

      onUnmounted(() => {
        window.removeEventListener('scroll', onScroll)
      })
    }

    onMounted(() => {
      loadFeaturedAndPopular()
      initializeScrollListener()
    })

    return {
      faSearchIcon,
      faUserIcon,
      featuredMovie,
      popularMoviesUrl,
      newReleasesUrl,
      actionMoviesUrl,
    }
  },
}
</script>

<style scoped>
.home {
  display: block;
}

html,
body {
  overflow-y: scroll !important;
  background-color: #141414 !important;
}
</style>
