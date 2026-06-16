<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
      <div class="text-center mb-6">
        <div class="inline-flex items-center justify-center w-20 h-20 mb-4">
          <img src="/images/logo-icon.png" alt="Medical School" class="w-full h-full object-contain" />
        </div>
        <h1 class="text-2xl font-bold text-gray-800">Вход в Medical School</h1>
        <p class="text-sm text-gray-500 mt-2">Введите данные для входа</p>
      </div>

      <!-- Сообщение от middleware -->
      <div v-if="authMessage" class="mb-4 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg text-sm">
        {{ authMessage }}
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input 
            v-model="form.email"
            type="email"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#4da882] focus:ring-1 focus:ring-[#4da882]"
            placeholder="example@mail.com"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
          <input 
            v-model="form.password"
            type="password"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#4da882] focus:ring-1 focus:ring-[#4da882]"
            placeholder="••••••••"
          />
        </div>

        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
          {{ error }}
        </div>

        <button 
          type="submit"
          class="w-full bg-[#4da882] text-white py-2 rounded-lg hover:bg-[#5cb894] transition font-medium"
        >
          Войти
        </button>
      </form>

      <div class="mt-6 text-center text-sm text-gray-600">
        Нет аккаунта? 
        <NuxtLink to="/register" class="text-[#4da882] hover:underline font-medium">
          Зарегистрироваться
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'auth'
})

const authStore = useAuthStore()

const form = ref({
  email: '',
  password: ''
})

const error = ref('')
const authMessage = ref('')

// Проверяем наличие сообщения от middleware
onMounted(() => {
  authStore.initAuth()
  
  const message = sessionStorage.getItem('authMessage')
  if (message) {
    authMessage.value = message
    sessionStorage.removeItem('authMessage')
  }
  
  if (authStore.user) {
    navigateTo('/')
  }
})

const handleLogin = () => {
  error.value = ''
  
  const result = authStore.login(form.value)
  
  if (result.success) {
    sessionStorage.removeItem('authMessage')
    navigateTo('/')
  } else {
    error.value = result.message
  }
}
</script>