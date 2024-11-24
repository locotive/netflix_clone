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
  genre: ['장르 (전체)', 'Action', 'Adventure', 'Comedy', 'Crime', 'Family'],
  rating: ['평점 (전체)', '9~10', '8~9', '7~8', '6~7', '5~6', '4~5', '4점 이하'],
  language: ['언어 (전체)', '영어', '한국어'],
  year: ['연도 (전체)', '2024', '2023', '2022', '2021', '2020'],
  sort: [
    '정렬 (기본)',
    '인기도 높은순',
    '인기도 낮은순',
    '평점 높은순',
    '평점 낮은순',
    '최신순',
    '오래된순',
  ],
  adult: ['성인물 (제외)', '성인물 포함'],
  runtime: ['상영시간 (전체)', '90분 이하', '90-120분', '120분 이상'],
}

const selectedOptions = reactive({
  genre: '장르 (전체)',
  rating: '평점 (전체)',
  language: '언어 (전체)',
  year: '연도 (전체)',
  sort: '정렬 (기본)',
  adult: '성인물 (제외)',
  runtime: '상영시간 (전체)',
})

function toggleDropdown(key) {
  activeDropdown.value = activeDropdown.value === key ? null : key
}

function selectOption(key, option) {
  selectedOptions[key] = option
  activeDropdown.value = null

  const emitOptions = {
    genre: selectedOptions.genre,
    rating: selectedOptions.rating,
    language: selectedOptions.language,
    year: selectedOptions.year,
    sort: selectedOptions.sort,
    adult: selectedOptions.adult,
    runtime: selectedOptions.runtime,
  }

  console.log('Emitting options:', emitOptions)
  emit('changeOptions', emitOptions)
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
