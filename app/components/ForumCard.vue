<template>
  <a :href="`/forum/${id}`" class="block bg-[#e8f4f0] p-4 rounded-lg hover:bg-[#dceee8] transition no-underline text-inherit">
    <div class="flex justify-between items-start mb-2">
      <h3 class="font-semibold text-gray-800 text-sm line-clamp-2 flex-1 mr-2">{{ title }}</h3>
      <span class="text-xs text-gray-500 whitespace-nowrap">{{ date }}</span>
    </div>
    <div class="flex items-center gap-2 mb-1">
      <span class="text-xs text-[#4da882] font-medium">{{ category }}</span>
      <span class="text-xs text-gray-400">•</span>
      <p class="text-xs text-gray-600">{{ author }}</p>
    </div>
    <p class="text-xs text-gray-600 line-clamp-2 mb-2">{{ excerpt }}</p>
    <div class="flex justify-between items-center">
      <span class="text-xs text-[#4da882] hover:underline">Подробнее →</span>
      <span class="text-xs text-gray-400">Ответов: {{ replies }}</span>
    </div>
  </a>
</template>

<script setup>
defineProps({
  id: {
    type: [String, Number],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    required: true
  },
  replies: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    default: 'Общее'
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>