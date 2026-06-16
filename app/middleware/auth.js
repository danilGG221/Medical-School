export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  authStore.initAuth()

  // Список публичных страниц (доступны без авторизации)
  const publicPages = ['/', '/login', '/register', '/about']
  
  // Если страница публичная - пропускаем
  if (publicPages.includes(to.path)) {
    return
  }

  // Если пользователь не авторизован - редирект на логин с сообщением
  if (!authStore.user) {
    sessionStorage.setItem('authMessage', 'Для доступа к этой странице необходимо авторизоваться')
    return navigateTo('/login')
  }
})