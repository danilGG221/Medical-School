<template>
  <div>
    <div class="mb-6">
      <h2 class="text-xl font-bold text-gray-800 mb-2">Состояние системы</h2>
      <p class="text-sm text-gray-600 max-w-3xl">
        В данном разделе отображается статус проверки решений задач пользователями. Здесь вы можете отслеживать, какие решения были приняты, а какие отклонены с указанием причины.
      </p>
    </div>

    <!-- Filters -->
    <div class="flex gap-4 mb-4 items-center flex-wrap">
      <div class="flex-1 min-w-[200px] relative">
        <svg class="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Поиск по ID, задаче или автору" 
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
        v-model="statusFilter"
        class="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#4da882] bg-white"
      >
        <option value="all">Все статусы</option>
        <option value="Принято">Принято</option>
        <option value="Неверный ответ">Неверный ответ</option>
        <option value="На проверке">На проверке</option>
      </select>

      <span class="text-sm text-gray-500" v-if="filteredStatuses.length !== statuses.length">
        Найдено: {{ filteredStatuses.length }}
      </span>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-lg overflow-hidden shadow-sm">
      <table class="w-full">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">ID</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">Дата проверки</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">№ Задачи</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">Автор решения</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">Статус ответа</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="(status, index) in filteredStatuses" 
            :key="index"
            class="bg-white hover:bg-[#e8f4f0] transition"
          >
            <td class="px-4 py-3 text-sm text-gray-700">{{ status.id }}</td>
            <td class="px-4 py-3 text-sm text-gray-700">{{ status.date }}</td>
            <td class="px-4 py-3 text-sm text-gray-700">{{ status.taskNumber }}</td>
            <td class="px-4 py-3 text-sm text-gray-700">{{ status.author }}</td>
            <td class="px-4 py-3 text-sm font-medium" :class="getStatusColor(status.status)">
              {{ status.status }}
            </td>
          </tr>
          <tr v-if="filteredStatuses.length === 0">
            <td colspan="5" class="px-4 py-8 text-center text-gray-500">
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

const searchQuery = ref('')
const statusFilter = ref('all')

const statuses = [
  { id: '001', date: '18.06.2026 13:15', taskNumber: '1213', author: 'Иванов И. И.', status: 'Принято' },
  { id: '002', date: '18.06.2026 12:45', taskNumber: '12', author: 'Петров П. П.', status: 'Неверный ответ' },
  { id: '003', date: '18.06.2026 11:30', taskNumber: '12', author: 'Сидоров С. С.', status: 'Неверный ответ' },
  { id: '004', date: '18.06.2026 10:20', taskNumber: '12', author: 'Козлова А. А.', status: 'Неверный ответ' },
  { id: '005', date: '17.06.2026 16:50', taskNumber: '12', author: 'Михайлов М. М.', status: 'Неверный ответ' },
  { id: '006', date: '17.06.2026 15:10', taskNumber: '12', author: 'Новикова Н. Н.', status: 'Неверный ответ' },
  { id: '007', date: '17.06.2026 14:00', taskNumber: '1213', author: 'Смирнов С. С.', status: 'Принято' },
  { id: '008', date: '17.06.2026 12:30', taskNumber: '1213', author: 'Волкова В. В.', status: 'Принято' },
  { id: '009', date: '16.06.2026 17:20', taskNumber: '1213', author: 'Алексеев А. А.', status: 'Принято' },
  { id: '010', date: '16.06.2026 16:00', taskNumber: '1213', author: 'Григорьева Г. Г.', status: 'Принято' },
  { id: '011', date: '16.06.2026 14:40', taskNumber: '1213', author: 'Дмитриев Д. Д.', status: 'Принято' },
  { id: '012', date: '16.06.2026 13:15', taskNumber: '12', author: 'Егорова Е. Е.', status: 'Неверный ответ' },
  { id: '013', date: '15.06.2026 17:45', taskNumber: '12', author: 'Жуков Ж. Ж.', status: 'Неверный ответ' },
  { id: '014', date: '15.06.2026 16:20', taskNumber: '12', author: 'Зайцева З. З.', status: 'Неверный ответ' },
  { id: '015', date: '15.06.2026 15:00', taskNumber: '12', author: 'Ильин И. И.', status: 'Неверный ответ' },
  { id: '016', date: '15.06.2026 13:30', taskNumber: '12', author: 'Крылова К. К.', status: 'Неверный ответ' },
  { id: '017', date: '14.06.2026 17:10', taskNumber: '12', author: 'Львов Л. Л.', status: 'Неверный ответ' },
  { id: '018', date: '14.06.2026 15:40', taskNumber: '12', author: 'Морозова М. М.', status: 'Неверный ответ' },
  { id: '019', date: '14.06.2026 14:20', taskNumber: '12', author: 'Николаев Н. Н.', status: 'Неверный ответ' }
]

const getStatusColor = (status) => {
  switch(status) {
    case 'Принято':
      return 'text-green-600'
    case 'Неверный ответ':
      return 'text-red-600'
    case 'На проверке':
      return 'text-yellow-600'
    default:
      return 'text-gray-600'
  }
}

const filteredStatuses = computed(() => {
  return statuses.filter(status => {
    // Поиск по тексту
    const searchMatch = !searchQuery.value || 
      status.id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      status.taskNumber.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      status.author.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    // Фильтр по статусу
    const statusMatch = statusFilter.value === 'all' || status.status === statusFilter.value
    
    return searchMatch && statusMatch
  })
})

const resetFilters = () => {
  searchQuery.value = ''
  statusFilter.value = 'all'
}
</script>