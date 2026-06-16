<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
      <div class="text-center mb-6">
        <div class="inline-flex items-center justify-center w-20 h-20 mb-4">
          <img src="/images/logo-icon.png" alt="Medical School" class="w-full h-full object-contain" />
        </div>
        <h1 class="text-2xl font-bold text-gray-800">Регистрация</h1>
        <p class="text-sm text-gray-500 mt-2">Создайте аккаунт в Medical School</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Фамилия</label>
            <input 
              v-model="form.lastName"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#4da882] text-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Имя</label>
            <input 
              v-model="form.firstName"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#4da882] text-sm"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Отчество</label>
          <input 
            v-model="form.patronymic"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#4da882] text-sm"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input 
            v-model="form.email"
            type="email"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#4da882] text-sm"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
          <input 
            v-model="form.password"
            type="password"
            required
            minlength="6"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#4da882] text-sm"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Повторите пароль</label>
          <input 
            v-model="form.passwordConfirm"
            type="password"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#4da882] text-sm"
          />
        </div>

        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
          {{ error }}
        </div>

        <button 
          type="submit"
          class="w-full bg-[#4da882] text-white py-2 rounded-lg hover:bg-[#5cb894] transition font-medium"
        >
          Зарегистрироваться
        </button>
      </form>

      <div class="mt-6 text-center text-sm text-gray-600">
        Уже есть аккаунт? 
        <NuxtLink to="/login" class="text-[#4da882] hover:underline font-medium">
          Войти
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
  firstName: '',
  lastName: '',
  patronymic: '',
  email: '',
  password: '',
  passwordConfirm: ''
})

const error = ref('')

const handleRegister = () => {
  error.value = ''

  if (form.value.password !== form.value.passwordConfirm) {
    error.value = 'Пароли не совпадают'
    return
  }

  const result = authStore.register({
    firstName: form.value.firstName,
    lastName: form.value.lastName,
    patronymic: form.value.patronymic,
    email: form.value.email,
    password: form.value.password
  })

  if (result.success) {
    navigateTo('/')
  } else {
    error.value = result.message
  }
}

onMounted(() => {
  authStore.initAuth()
  if (authStore.user) {
    navigateTo('/')
  }
})
</script>