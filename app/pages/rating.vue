<template>
  <div>
    <h2 class="text-xl font-bold text-gray-800 mb-2">Рейтинг</h2>
    <div class="w-16 h-1 bg-[#4da882] mb-6"></div>
    
    <p class="text-sm text-gray-600 mb-6">
      Рейтинг формируется на основе активности пользователей: решения задач, участие в олимпиадах и активность на форуме.
    </p>

    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">Место</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">Пользователь</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">Уровень</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">Решено задач</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">Баллы</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="(user, index) in users" 
            :key="index"
            class="bg-white hover:bg-[#e8f4f0] transition"
            :class="{'bg-[#e8f4f0]': index < 3}"
          >
            <td class="px-4 py-3 text-sm font-semibold">
              <span v-if="index === 0" class="text-yellow-500">🥇</span>
              <span v-else-if="index === 1" class="text-gray-400">🥈</span>
              <span v-else-if="index === 2" class="text-amber-600">🥉</span>
              <span v-else class="text-gray-500">{{ index + 1 }}</span>
            </td>
            <td class="px-4 py-3 text-sm text-gray-800 font-medium">{{ user.name }}</td>
            <td class="px-4 py-3 text-sm text-gray-700">{{ user.level }}</td>
            <td class="px-4 py-3 text-sm text-gray-700">{{ user.solved }}</td>
            <td class="px-4 py-3 text-sm font-semibold text-[#4da882]">{{ user.points }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
const users = [
  { name: 'Иванов И. И.', level: '15', solved: '247', points: '12 450' },
  { name: 'Петров П. П.', level: '12', solved: '198', points: '9 870' },
  { name: 'Сидоров С. С.', level: '10', solved: '165', points: '8 230' },
  { name: 'Козлова А. А.', level: '8', solved: '134', points: '6 700' },
  { name: 'Михайлов М. М.', level: '7', solved: '112', points: '5 600' },
  { name: 'Новикова Н. Н.', level: '6', solved: '98', points: '4 900' },
  { name: 'Смирнов С. С.', level: '5', solved: '76', points: '3 800' },
  { name: 'Волкова В. В.', level: '4', solved: '54', points: '2 700' }
]
</script>