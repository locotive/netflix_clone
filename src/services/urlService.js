import axios from 'axios'

export default {
  async fetchFeaturedMovie() {
    // 환경 변수에서 apiKey 가져오기
    const apiKey = import.meta.env.VITE_TMDB_API_KEY
    console.log('API Key:', apiKey)

    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=ko-KR`,
      )
      console.log(response.data.results[0])
      return response.data.results[0]
    } catch (error) {
      console.error('Error fetching featured movie:', error)
    }
  },

  getURL4PopularMovies(page = 1) {
    const apiKey = import.meta.env.VITE_TMDB_API_KEY
    return `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=ko-KR`
  },

  getURL4ReleaseMovies(page = 1) {
    // 환경 변수에서 apiKey 가져오기
    const apiKey = import.meta.env.VITE_TMDB_API_KEY
    return `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=ko-KR&page=${page}`
  },

  getURL4GenreMovies(genre, page = 1) {
    // 환경 변수에서 apiKey 가져오기
    const apiKey = import.meta.env.VITE_TMDB_API_KEY
    return `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genre}&language=ko-KR&page=${page}`
  },
}
