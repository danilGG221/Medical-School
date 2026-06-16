<template>
  <div>
    <h2 class="text-xl font-bold text-gray-800 mb-6">Форум</h2>
    
    <!-- Фильтры и поиск -->
    <div class="flex gap-4 mb-6 items-center flex-wrap">
      <div class="flex-1 min-w-[200px] relative">
        <svg class="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Поиск по темам, авторам или содержанию..." 
          class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#4da882]"
        />
      </div>
      
      <button 
        @click="resetFilters"
        class="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
        title="Сбросить фильтры"
      >
        <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
        </svg>
      </button>

      <select 
        v-model="categoryFilter"
        class="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#4da882] bg-white"
      >
        <option value="all">Все категории</option>
        <option value="Учеба">Учеба</option>
        <option value="Медицина">Медицина</option>
        <option value="Олимпиады">Олимпиады</option>
        <option value="Обсуждения">Обсуждения</option>
        <option value="Вопросы">Вопросы</option>
      </select>

      <select 
        v-model="sortBy"
        class="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#4da882] bg-white"
      >
        <option value="newest">Сначала новые</option>
        <option value="oldest">Сначала старые</option>
        <option value="popular">По популярности</option>
      </select>

      <span class="text-sm text-gray-500" v-if="filteredTopics.length !== topics.length">
        Найдено: {{ filteredTopics.length }}
      </span>
    </div>

    <!-- Карточки тем -->
    <div class="grid grid-cols-3 gap-4">
      <ForumCard
        v-for="(topic, index) in filteredTopics"
        :key="index"
        :id="topic.id"
        :title="topic.title"
        :author="topic.author"
        :date="topic.date"
        :excerpt="topic.excerpt"
        :replies="topic.replies"
        :category="topic.category"
      />
      <div v-if="filteredTopics.length === 0" class="col-span-3 py-12 text-center text-gray-500">
        Ничего не найдено. Попробуйте изменить параметры поиска.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')
const categoryFilter = ref('all')
const sortBy = ref('newest')

const topics = [
  {
    id: 1,
    title: 'Как правильно решать задачи по химии?',
    author: 'Петров А. С.',
    date: '15 июня 2026 14:30',
    dateSort: new Date(2026, 5, 15, 14, 30),
    replies: 12,
    category: 'Учеба',
    excerpt: 'Всем привет! Хочу поделиться своим опытом решения задач по органической химии. Часто у студентов возникают трудности с...'
  },
  {
    id: 2,
    title: 'Обсуждение нового учебного плана на 2026-2027 год',
    author: 'Иванова М. В.',
    date: '14 июня 2026 10:15',
    dateSort: new Date(2026, 5, 14, 10, 15),
    replies: 8,
    category: 'Обсуждения',
    excerpt: 'Коллеги, давайте обсудим изменения в учебном плане. Появились новые дисциплины, изменилось количество часов по...'
  },
  {
    id: 3,
    title: 'Советы по подготовке к олимпиаде по биологии',
    author: 'Сидоров К. Н.',
    date: '13 июня 2026 16:45',
    dateSort: new Date(2026, 5, 13, 16, 45),
    replies: 5,
    category: 'Олимпиады',
    excerpt: 'Подготовка к олимпиаде требует системного подхода. Я участвовал в нескольких олимпиадах и хочу поделиться...'
  },
  {
    id: 4,
    title: 'Вопросы по анатомии человека',
    author: 'Козлова Е. Д.',
    date: '12 июня 2026 09:00',
    dateSort: new Date(2026, 5, 12, 9, 0),
    replies: 7,
    category: 'Вопросы',
    excerpt: 'Здравствуйте! У меня возникли вопросы по строению опорно-двигательной системы. Может кто-то сможет помочь с...'
  },
  {
    id: 5,
    title: 'Лучшие ресурсы для изучения медицинской латыни',
    author: 'Михайлов И. Р.',
    date: '11 июня 2026 11:20',
    dateSort: new Date(2026, 5, 11, 11, 20),
    replies: 15,
    category: 'Медицина',
    excerpt: 'Хочу собрать список полезных материалов для изучения латинского языка. Поделитесь, кто чем пользовался и что...'
  },
  {
    id: 6,
    title: 'Организация практических занятий по хирургии',
    author: 'Алексеев Д. В.',
    date: '10 июня 2026 13:40',
    dateSort: new Date(2026, 5, 10, 13, 40),
    replies: 4,
    category: 'Обсуждения',
    excerpt: 'Уважаемые преподаватели и студенты! Предлагаю обсудить организацию практических занятий по хирургии. Какие...'
  }
]

const filteredTopics = computed(() => {
  let result = topics.filter(topic => {
    // Поиск по тексту
    const searchMatch = !searchQuery.value || 
      topic.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      topic.author.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      topic.excerpt.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    // Фильтр по категории
    const categoryMatch = categoryFilter.value === 'all' || topic.category === categoryFilter.value
    
    return searchMatch && categoryMatch
  })

  // Сортировка
  switch(sortBy.value) {
    case 'newest':
      result.sort((a, b) => b.dateSort - a.dateSort)
      break
    case 'oldest':
      result.sort((a, b) => a.dateSort - b.dateSort)
      break
    case 'popular':
      result.sort((a, b) => b.replies - a.replies)
      break
    default:
      break
  }

  return result
})

const resetFilters = () => {
  searchQuery.value = ''
  categoryFilter.value = 'all'
  sortBy.value = 'newest'
}
</script>