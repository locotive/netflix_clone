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
}

const selectedOptions = reactive({
  genre: '장르 (전체)',
  rating: '평점 (전체)',
  language: '언어 (전체)',
})

function toggleDropdown(key) {
  activeDropdown.value = activeDropdown.value === key ? null : key
}

function selectOption(key, option) {
  selectedOptions[key] = option
  activeDropdown.value = null

  // 선택된 옵션을 적절한 형식으로 변환하여 emit
  const emitOptions = {
    genre: selectedOptions.genre,
    rating: selectedOptions.rating,
    language: selectedOptions.language,
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
