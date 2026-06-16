<template>
  <div class="bg-[#4da882] text-white p-4 rounded-lg">
    <h3 class="text-center font-semibold mb-3">{{ title }}</h3>
    <ul class="space-y-2">
      <li v-for="(item, index) in items" :key="index">
        <a 
          :href="getLink(item)"
          @click.prevent="handleNavigation(item)"
          class="block text-sm hover:bg-[#5cb894] px-2 py-1 rounded transition cursor-pointer"
        >
          {{ item }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
  items: Array
})

const authStore = useAuthStore()

const getLink = (item) => {
  const links = {
    'О школе': '/about',
    'Правила': '/rules',
    'Форум': '/forum',
    'Олимпиады': '/olympiads',
    'Архив задач': '/archive',
    'Состояние системы': '/status',
    'Рейтинг': '/rating',
    'Курсы': '/courses',
    'Новичкам': '/beginners',
    'Статьи': '/articles',
    'Ссылки': '/links',
    'Работа в системе': '/work'
  }
  return links[item] || '#'
}

const handleNavigation = (item) => {
  const link = getLink(item)
  
  // Проверяем, защищенная ли страница
  const protectedPages = ['/rules', '/forum', '/olympiads', '/archive', '/status', '/rating', '/courses', '/beginners', '/articles', '/links', '/work']
  const isProtected = protectedPages.includes(link)
  
  if (isProtected && !authStore.user) {
    sessionStorage.setItem('authMessage', 'Для доступа к этой странице необходимо авторизоваться')
    navigateTo('/login')
    return
  }
  
  navigateTo(link)
}
</script>