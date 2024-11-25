<template>
  <div class="search-container">
    <div class="dropdown-group">
      <div v-for="(options, key) in dropdowns" :key="key" class="dropdown">
        <button @click="toggleDropdown(key)" class="dropdown-button">
          {{ selectedOptions[key] || `Select ${key}` }}
        </button>
        <div v-if="activeDropdown === key" class="dropdown-content">
          <div
            v-for="option in options"
            :key="option"
            @click="selectOption(key, option)"
            class="dropdown-item"
          >
            {{ option }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const emit = defineEmits(['changeOptions'])
const activeDropdown = ref(null)

const dropdowns = {
  genre: [
    '장르 (전체)',
    '액션',
    '모험',
    '애니메이션',
    '코미디',
    '범죄',
    '다큐멘터리',
    '드라마',
    '가족',
    '판타지',
    '역사',
    '공포',
    '음악',
    '미스터리',
    '로맨스',
    'SF',
    'TV 영화',
    '스릴러',
    '전쟁',
    '서부'
  ],
  rating: [
    '평점 (전체)',
    '9점 이상',
    '8점 이상',
    '7점 이상',
    '6점 이상',
    '5점 이상',
    '4점 이상',
    '3점 이상'
  ],
  language: [
    '언어 (전체)',
    '한국어',
    '영어',
    '일본어',
    '중국어',
    '프랑스어',
    '독일어',
    '스페인어',
    '이탈리아어',
    '러시아어'
  ],
  year: [
    '연도 (전체)',
    '2024',
    '2023',
    '2022',
    '2021',
    '2020',
    '2019',
    '2018',
    '2017',
    '2016',
    '2015'
  ],
  sort: [
    '정렬 (기본)',
    '인기도 높은순',
    '인기도 낮은순',
    '평점 높은순',
    '평점 낮은순',
    '최신순',
    '오래된순',
    '수익 높은순',
    '수익 낮은순',
    '제목 오름차순',
    '제목 내림차순'
  ],
  runtime: [
    '상영시간 (전체)',
    '60분 이하',
    '60-90분',
    '90-120분',
    '120-150분',
    '150분 이상'
  ],
  adult: [
    '성인물 제외',
    '성인물 포함'
  ]
}

const selectedOptions = reactive({
  genre: '장르 (전체)',
  rating: '평점 (전체)',
  language: '언어 (전체)',
  year: '연도 (전체)',
  sort: '정렬 (기본)',
  runtime: '상영시간 (전체)',
  adult: '성인물 제외'
})

function toggleDropdown(key) {
  activeDropdown.value = activeDropdown.value === key ? null : key
}

function selectOption(key, option) {
  selectedOptions[key] = option
  activeDropdown.value = null

  emit('changeOptions', {
    genre: selectedOptions.genre,
    rating: selectedOptions.rating,
    language: selectedOptions.language,
    year: selectedOptions.year,
    sort: selectedOptions.sort,
    runtime: selectedOptions.runtime,
    adult: selectedOptions.adult
  })
}
</script>

<style scoped>
.search-container {
  width: 100%;
}

.dropdown-group {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.dropdown {
  position: relative;
  min-width: 150px;
}

.dropdown-button {
  width: 100%;
  padding: 10px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  text-align: left;
}

.dropdown-button:hover {
  background: #f5f5f5;
}

.dropdown-content {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: #333;
  border: 1px solid #fff;
  z-index: 99;
  display: block;
}

.dropdown-item {
  color: white;
  padding: 10px;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: #575757;
}
</style>
