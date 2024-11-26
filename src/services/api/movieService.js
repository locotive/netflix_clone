import axios from 'axios'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'

export const movieService = {
  async getMovieDetails(movieId) {
    try {
      const response = await axios.get(`${BASE_URL}/movie/${movieId}`, {
        params: {
          api_key: API_KEY,
          language: 'ko-KR'
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching movie details:', error)
      throw error
    }
  }
}
