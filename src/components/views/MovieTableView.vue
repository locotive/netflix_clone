<template>
  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th>포스터</th>
          <th>제목</th>
          <th>설명</th>
          <th>개봉일</th>
          <th>평점</th>
          <th>장르</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="movie in movies" :key="movie.id">
          <td class="poster-cell">
            <img
              :src="getImageUrl(movie.poster_path, 'thumbnail')"
              :alt="movie.title"
              loading="lazy"
            />
          </td>
          <td class="title-cell">{{ movie.title }}</td>
          <td class="overview-cell">{{ movie.overview }}</td>
          <td>{{ formatDate(movie.release_date) }}</td>
          <td>
            <span class="rating">{{ movie.vote_average.toFixed(1) }}</span>
          </td>
          <td>{{ getGenres(movie.genre_ids) }}</td>
        </tr>
      </tbody>
    </table>

    <!-- 페이지네이션 -->
    <div class="pagination">
      <button
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
        class="page-btn"
      >
        이전
      </button>
      <div class="page-numbers">
        <button
          v-for="page in displayedPages"
          :key="page"
          @click="changePage(page)"
          :class="{ active: currentPage === page }"
          class="page-btn"
        >
          {{ page }}
        </button>
      </div>
      <button
        :disabled="currentPage === totalPages"
        @click="changePage(currentPage + 1)"
        class="page-btn"
      >
        다음
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMovieUtils } from '@/composables/useMovieUtils'
import createAPI from '@/services/apiService'

const props = defineProps({
  fetchUrl: {
    type: String,
    required: true
  }
})

const movies = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const { getImageUrl } = useMovieUtils()
const loading = ref(false)

// 장르 매핑
const genres = {
  28: '액션',
  12: '모험',
  16: '애니메이션',
  35: '코미디',
  80: '범죄',
  99: '다큐멘터리',
  18: '드라마',
  10751: '가족',
  14: '판타지',
  36: '역사',
  27: '공포',
  10402: '음악',
  9648: '미스터리',
  10749: '로맨스',
  878: 'SF',
  10770: 'TV 영화',
  53: '스릴러',
  10752: '전쟁',
  37: '서부'
}

const getGenres = (genreIds) => {
  return genreIds.map(id => genres[id]).filter(Boolean).join(', ')
}

const fetchMovies = async (page) => {
  try {
    loading.value = true
    const api = createAPI()
    const response = await api.get(props.fetchUrl, {
      params: {
        page: page
      }
    })
    movies.value = response.data.results.slice(0, 7)
    totalPages.value = Math.min(response.data.total_pages, 500)
    currentPage.value = page
  } catch (error) {
    console.error('영화 목록 로딩 실패:', error)
  } finally {
    loading.value = false
  }
}

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    fetchMovies(page)
  }
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('ko-KR')
}

// 페이지네이션 표시 로직
const displayedPages = computed(() => {
  const pages = []
  const maxPages = 5 // 한 번에 표시할 페이지 수
  let start = Math.max(1, currentPage.value - Math.floor(maxPages / 2))
  let end = Math.min(totalPages.value, start + maxPages - 1)

  if (end - start + 1 < maxPages) {
    start = Math.max(1, end - maxPages + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

// 초기 데이터 로드
onMounted(() => {
  fetchMovies(1)
})
</script>

<style scoped>
.table-container {
  height: 100vh;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: rgba(0, 0, 0, 0.2);
  table-layout: fixed;
  margin-bottom: 20px;
}

/* thead 스타일 별도 지정 */
thead th {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #2c2c2c;
  height: 50px; /* 헤더 높이 축소 */
  vertical-align: middle;
}

/* tbody 스타일 */
tbody td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #2c2c2c;
  height: 140px;
  vertical-align: top;
}

.overview-cell {
  height: 120px;
  overflow: hidden;
  line-height: 1.5;
  word-break: keep-all;
  white-space: normal;
  position: relative;
}

.overview-cell::after {
  content: '';
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 20px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.2));
}

/* 각 컬럼 너비 조정 */
th:nth-child(1), td:nth-child(1) { width: 80px; }  /* 포스터 */
th:nth-child(2), td:nth-child(2) { width: 100px; } /* 제목 */
th:nth-child(3), td:nth-child(3) { width: 500px; } /* 설명 */
th:nth-child(4), td:nth-child(4) { width: 100px; } /* 개봉일 */
th:nth-child(5), td:nth-child(5) { width: 80px; }  /* 평점 */
th:nth-child(6), td:nth-child(6) { width: 150px; } /* 장르 */

.poster-cell img {
  width: 50px;
  height: 75px;
  object-fit: cover;
  border-radius: 4px;
}

.title-cell {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rating {
  background-color: #535bf2;
  padding: 4px 8px;
  border-radius: 4px;
}

.pagination {
  padding: 20px 0;
  background: #141414;
  position: fixed; /* sticky 대신 fixed 사용 */
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.page-numbers {
  display: flex;
  gap: 5px;
}

.page-btn {
  padding: 8px 16px;
  background-color: rgba(0, 0, 0, 0.3);
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-btn.active {
  background-color: #535bf2;
}
</style>
