<template>
  <div class="flex-1 p-8">
    <div class="mb-6">
      <h2 class="text-xl font-bold text-gray-800 mb-2">Архив задач</h2>
      <p class="text-sm text-gray-600 max-w-3xl">
        Здесь собраны задачи по различным медицинским дисциплинам. Решайте, проверяйте свои знания и повышайте уровень подготовки.
      </p>
    </div>

    <!-- Фильтры -->
    <div class="flex gap-4 mb-4 items-center flex-wrap">
      <div class="flex-1 min-w-[200px] relative">
        <svg class="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Поиск по названию, дисциплине или ID" 
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
        v-model="disciplineFilter"
        class="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#4da882] bg-white"
      >
        <option value="all">Все дисциплины</option>
        <option value="Хирургия">Хирургия</option>
        <option value="Кардиология">Кардиология</option>
        <option value="Фармакология">Фармакология</option>
        <option value="Терапия">Терапия</option>
        <option value="Анатомия">Анатомия</option>
        <option value="Эндокринология">Эндокринология</option>
      </select>

      <span class="text-sm text-gray-500" v-if="filteredTasks.length !== tasks.length">
        Найдено: {{ filteredTasks.length }}
      </span>
    </div>

    <!-- Таблица -->
    <div class="bg-white rounded-lg overflow-hidden shadow-sm">
      <table class="w-full">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th 
              @click="sortByField('solved')"
              class="px-4 py-3 text-left text-xs font-semibold text-gray-600 cursor-pointer hover:text-[#4da882] transition select-none"
            >
              <div class="flex items-center gap-1">
                Решено
                <span v-if="sortField === 'solved'" class="text-[#4da882]">
                  {{ sortOrder === 'asc' ? '↑' : '↓' }}
                </span>
              </div>
            </th>
            <th 
              @click="sortByField('id')"
              class="px-4 py-3 text-left text-xs font-semibold text-gray-600 cursor-pointer hover:text-[#4da882] transition select-none"
            >
              <div class="flex items-center gap-1">
                ID
                <span v-if="sortField === 'id'" class="text-[#4da882]">
                  {{ sortOrder === 'asc' ? '↑' : '↓' }}
                </span>
              </div>
            </th>
            <th 
              @click="sortByField('name')"
              class="px-4 py-3 text-left text-xs font-semibold text-gray-600 cursor-pointer hover:text-[#4da882] transition select-none"
            >
              <div class="flex items-center gap-1">
                Название задачи
                <span v-if="sortField === 'name'" class="text-[#4da882]">
                  {{ sortOrder === 'asc' ? '↑' : '↓' }}
                </span>
              </div>
            </th>
            <th 
              @click="sortByField('theme')"
              class="px-4 py-3 text-left text-xs font-semibold text-gray-600 cursor-pointer hover:text-[#4da882] transition select-none"
            >
              <div class="flex items-center gap-1">
                Дисциплина
                <span v-if="sortField === 'theme'" class="text-[#4da882]">
                  {{ sortOrder === 'asc' ? '↑' : '↓' }}
                </span>
              </div>
            </th>
            <th 
              @click="sortByField('analysis')"
              class="px-4 py-3 text-left text-xs font-semibold text-gray-600 cursor-pointer hover:text-[#4da882] transition select-none"
            >
              <div class="flex items-center gap-1">
                Разбор
                <span v-if="sortField === 'analysis'" class="text-[#4da882]">
                  {{ sortOrder === 'asc' ? '↑' : '↓' }}
                </span>
              </div>
            </th>
            <th 
              @click="sortByField('difficulty')"
              class="px-4 py-3 text-left text-xs font-semibold text-gray-600 cursor-pointer hover:text-[#4da882] transition select-none"
            >
              <div class="flex items-center gap-1">
                Сложность
                <span v-if="sortField === 'difficulty'" class="text-[#4da882]">
                  {{ sortOrder === 'asc' ? '↑' : '↓' }}
                </span>
              </div>
            </th>
            <th 
              @click="sortByField('solvability')"
              class="px-4 py-3 text-left text-xs font-semibold text-gray-600 cursor-pointer hover:text-[#4da882] transition select-none"
            >
              <div class="flex items-center gap-1">
                Решаемость
                <span v-if="sortField === 'solvability'" class="text-[#4da882]">
                  {{ sortOrder === 'asc' ? '↑' : '↓' }}
                </span>
              </div>
            </th>
            <th 
              @click="sortByField('accepted')"
              class="px-4 py-3 text-left text-xs font-semibold text-gray-600 cursor-pointer hover:text-[#4da882] transition select-none"
            >
              <div class="flex items-center gap-1">
                Принято
                <span v-if="sortField === 'accepted'" class="text-[#4da882]">
                  {{ sortOrder === 'asc' ? '↑' : '↓' }}
                </span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="(task, index) in sortedTasks" 
            :key="index"
            class="bg-white hover:bg-[#e8f4f0] transition cursor-pointer"
            @click="goToTask(task.id)"
          >
            <td class="px-4 py-3 text-sm text-gray-700">{{ task.solved }}</td>
            <td class="px-4 py-3 text-sm text-gray-700">{{ task.id }}</td>
            <td class="px-4 py-3 text-sm text-gray-800">{{ task.name }}</td>
            <td class="px-4 py-3 text-sm text-gray-700">{{ task.theme }}</td>
            <td class="px-4 py-3 text-sm text-gray-700">{{ task.analysis }}</td>
            <td class="px-4 py-3 text-sm text-gray-700">{{ task.difficulty }}</td>
            <td class="px-4 py-3 text-sm text-gray-700">{{ task.solvability }}</td>
            <td class="px-4 py-3 text-sm text-gray-700">{{ task.accepted }}</td>
          </tr>
          <tr v-if="sortedTasks.length === 0">
            <td colspan="8" class="px-4 py-8 text-center text-gray-500">
              Ничего не найдено. Попробуйте изменить параметры поиска.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const router = useRouter()
const searchQuery = ref('')
const disciplineFilter = ref('all')
const sortField = ref('id')
const sortOrder = ref('asc')

const tasks = [
  { solved: 'Да', id: '1', name: 'Диагностика острого аппендицита', theme: 'Хирургия', analysis: 'Есть', difficulty: '15%', solvability: '85%', accepted: '2345' },
  { solved: 'Да', id: '2', name: 'Интерпретация ЭКГ при инфаркте миокарда', theme: 'Кардиология', analysis: 'Есть', difficulty: '25%', solvability: '75%', accepted: '1876' },
  { solved: 'Да', id: '3', name: 'Фармакокинетика антибиотиков', theme: 'Фармакология', analysis: 'Есть', difficulty: '20%', solvability: '80%', accepted: '2156' },
  { solved: 'Да', id: '4', name: 'Дифференциальная диагностика желтух', theme: 'Терапия', analysis: 'Есть', difficulty: '30%', solvability: '70%', accepted: '1567' },
  { solved: 'Нет', id: '5', name: 'Анатомия черепных нервов', theme: 'Анатомия', analysis: 'Нет', difficulty: '45%', solvability: '55%', accepted: '987' },
  { solved: 'Да', id: '6', name: 'Лечение сахарного диабета 2 типа', theme: 'Эндокринология', analysis: 'Есть', difficulty: '18%', solvability: '82%', accepted: '1987' }
]

// Фильтрация
const filteredTasks = computed(() => {
  return tasks.filter(task => {
    const searchMatch = !searchQuery.value || 
      task.id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      task.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      task.theme.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const disciplineMatch = disciplineFilter.value === 'all' || task.theme === disciplineFilter.value
    
    return searchMatch && disciplineMatch
  })
})

// Сортировка
const sortedTasks = computed(() => {
  const result = [...filteredTasks.value]
  
  result.sort((a, b) => {
    let valA = a[sortField.value]
    let valB = b[sortField.value]
    
    // Для числовых полей (id, accepted)
    if (sortField.value === 'id' || sortField.value === 'accepted') {
      valA = parseFloat(valA)
      valB = parseFloat(valB)
    }
    
    // Для процентных полей (difficulty, solvability)
    if (sortField.value === 'difficulty' || sortField.value === 'solvability') {
      valA = parseFloat(valA)
      valB = parseFloat(valB)
    }
    
    if (valA < valB) return sortOrder.value === 'asc' ? -1 : 1
    if (valA > valB) return sortOrder.value === 'asc' ? 1 : -1
    return 0
  })
  
  return result
})

const sortByField = (field) => {
  if (sortField.value === field) {
    // Если уже сортируем по этому полю, меняем порядок
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    // Иначе сортируем по новому полю (по возрастанию)
    sortField.value = field
    sortOrder.value = 'asc'
  }
}

const resetFilters = () => {
  searchQuery.value = ''
  disciplineFilter.value = 'all'
  sortField.value = 'id'
  sortOrder.value = 'asc'
}

const goToTask = (id) => {
  router.push(`/archive/${id}`)
}
</script>

<style scoped>
thead th {
  user-select: none;
}
</style>